import React, { useState, useEffect, useRef, useReducer } from 'react';
import './App.css';
import { leastSquares } from './leastSquares';
import { useTwo } from './hooks';
import {
  Point2D,
  projectPointToLine,
  slopeInterceptFormToStandardForm,
} from './geometry';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as IO from 'fp-ts/lib/IO';
import * as IOE from 'fp-ts/lib/IOEither';
import { getFloat, getItem, setPrimitive } from './localStorage';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as AED from './asyncEitherData';
import * as N from 'fp-ts-std/Number';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
} from '@windmill/react-ui';

type Column = 'pinky' | 'ring' | 'middle' | 'index' | 'index_far' | 'thumb';

const defaultColumn = 'middle' as Column;

const columns: Column[] = [
  'thumb',
  'index_far',
  'index',
  'middle',
  'ring',
  'pinky',
];

const columnToColor = (c: Column): string => {
  switch (c) {
    case 'thumb':
      return '#363636';
    case 'index_far':
      return '#5454E8';
    case 'index':
      return '#9C9CB8';
    case 'middle':
      return '#CF9393';
    case 'ring':
      return '#59BDBD';
    case 'pinky':
      return '#A5FAFA';
  }
};

const ColumnSelect = ({
  column,
  onChange,
}: {
  column: Column;
  onChange: (c: Column) => void;
}) => (
  <div className="overflow-auto flex gap-2 pt-1 pb-1 pr-4">
    {columns.map((a) => (
      <Button
        layout={column === a ? 'outline' : 'primary'}
        key={a}
        onClick={() => onChange(a)}
        iconRight={() => (
          <div
            className="h-4 w-4 ml-2 rounded"
            style={{ backgroundColor: columnToColor(a) }}
          ></div>
        )}
        size="large"
      >
        {a}
      </Button>
    ))}
  </div>
);

type Pos = { x: number; y: number };

const Boo = ({
  data,
  linearScale,
}: {
  data: Record<Column, Pos[]>;
  linearScale: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useTwo(
    ref,
    (two, el) => {
      Object.entries(data).forEach(([column, positions]) => {
        const fill = columnToColor(column as Column);
        positions.forEach((pos) => {
          const circle = two.makeCircle(pos.x, pos.y, 15);
          circle.linewidth = 0;
          circle.fill = fill;
          circle.opacity = 0.5;
        });
        if (positions.length > 1) {
          const trendline = leastSquares(positions, column !== 'thumb');
          const line = two.makeLine(
            0,
            trendline.b,
            el.clientWidth,
            trendline.m * el.clientWidth + trendline.b,
          );
          line.stroke = fill;
          line.opacity = 0.5;

          const projections = positions.map(
            projectPointToLine(slopeInterceptFormToStandardForm(trendline)),
          );

          projections.forEach((pos, i) => {
            const circle = two.makeCircle(pos.x, pos.y, 3);
            circle.linewidth = 0;
            circle.fill = 'red';
            circle.opacity = 0.3;

            const line = two.makeLine(
              pos.x,
              pos.y,
              positions[i].x,
              positions[i].y,
            );
            line.stroke = fill;
          });

          const xs = projections.map(({ x }) => x);

          const minX = Math.min(...xs);
          const averageX = (Math.max(...xs) - minX) / 2 + minX;

          const midPoint: Point2D = {
            x: averageX,
            y: trendline.m * averageX + trendline.b,
          };

          const keyWidth = 17 * linearScale;
          const keyHeight = keyWidth;
          const gapY = 2 * linearScale;
          const originX = 0;
          const originY = 0;

          const homeRowKey = two.makeRectangle(
            originX,
            originY,
            keyWidth,
            keyHeight,
          );
          homeRowKey.stroke = 'black';
          homeRowKey.linewidth = 2;
          homeRowKey.fill = 'transparent';

          const topRowKey = two.makeRectangle(
            originX,
            originY + gapY + keyHeight,
            keyWidth,
            keyHeight,
          );
          topRowKey.stroke = 'black';
          topRowKey.linewidth = 2;
          topRowKey.fill = 'transparent';

          const bottomRowKey = two.makeRectangle(
            originX,
            originY - gapY - keyHeight,
            keyWidth,
            keyHeight,
          );
          bottomRowKey.stroke = 'black';
          bottomRowKey.linewidth = 2;
          bottomRowKey.fill = 'transparent';

          // const columnOutline = two.makeRectangle(
          //   originX,
          //   originY,
          //   keyWidth + gapY * 2,
          //   keyHeight * 3 + gapY * 5,
          // );
          // columnOutline.stroke = 'black';
          // columnOutline.linewidth = 2;
          // columnOutline.fill = 'transparent';

          const group = two.makeGroup([
            bottomRowKey,
            homeRowKey,
            topRowKey,
            // columnOutline,
          ]);
          group.translation.set(midPoint.x, midPoint.y);
          group.rotation = Math.PI / 2 + Math.atan(trendline.m);
        }
      });

      two.update();
      return () => {
        two.clear();
      };
    },
    [data, ref.current, linearScale],
  );
  return <div className="boo" ref={ref}></div>;
};

const defaultPositions: Record<Column, Pos[]> = {
  thumb: [],
  index_far: [],
  index: [],
  middle: [],
  ring: [],
  pinky: [],
};

const defaultMMPer300px = 100;

const ScaleTune = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (a: string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Tune scale</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          <h2 className="text-xl">Tune scale factor</h2>
        </ModalHeader>
        <ModalBody>
          <p className="mb-4 text-base">
            Default values used for displaying keycap size can be too far from
            real keycap size. To correct that measure width of the red line
            below and enter width in mm in the input.
          </p>
          <div className="h-1 bg-red-700 mb-2" />
          <Label>
            <p className="mb-1 text-sm">Enter scale factor</p>
            <Input css type="number" value={value} />
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsModalOpen(false)}
          >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const App = ({ storedScale }: { storedScale: O.Option<number> }) => {
  const [column, setColumn] = useState(defaultColumn);
  const [positions, setPositions] = useState(defaultPositions);
  const ref = useRef<HTMLDivElement>(null);
  const [mmPer300px, setMmPer300px] = useState(
    pipe(
      storedScale,
      O.getOrElse(() => defaultMMPer300px),
    ),
  );
  const linearScale = mmPer300px / 30;

  useEffect(() => {
    function f(this: HTMLDivElement, evt: PointerEvent) {
      evt.preventDefault();
      setPositions((pos) => ({
        ...pos,
        [column]: pos[column].concat([
          {
            x: evt.offsetX,
            y: evt.offsetY,
          },
        ]),
      }));
    }
    ref.current?.addEventListener('pointerdown', f);
    return () => {
      ref.current?.removeEventListener('pointerdown', f);
    };
  }, [ref.current, column]);

  return (
    <div className="app">
      <div className="container p-4 pt-3 pr-0 flex flex-col gap-4">
        <ColumnSelect column={column} onChange={(c) => setColumn(c)} />
        <div className="flex gap-2 pr-4">
          <Button
            className=""
            onClick={() =>
              setPositions((pos) => ({
                ...pos,
                [column]: [],
              }))
            }
          >
            Reset column
          </Button>
          <Button className="" onClick={() => setPositions(defaultPositions)}>
            Reset all
          </Button>
          <ScaleTune
            value={String(mmPer300px)}
            onChange={(v) => {
              pipe(
                N.floatFromString(v),
                O.fold(
                  () => {},
                  (n) => {
                    setPrimitive('SCALE_FACTOR', n)();
                    setMmPer300px(n);
                  },
                ),
              );
            }}
          />
        </div>
      </div>
      <div className="touchytouchy" ref={ref}>
        <Boo data={positions} linearScale={linearScale} />
      </div>
    </div>
  );
};

const setup = () =>
  pipe(
    { scale: TE.fromIOEither(getFloat('SCALE_FACTOR')) },
    sequenceS(TE.ApplyPar),
  );

export default () =>
  pipe(
    AED.useAsyncEitherData(setup()),
    AED.fold(
      () => <>Initialization</>,
      () => <>Loading</>,
      (e) => <p>Error: {JSON.stringify(e)}</p>,
      (config) => <App storedScale={config.scale} />,
    ),
  );
