import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { leastSquares } from './leastSquares';
import { useTwo } from './hooks';
import {
  Point2D,
  projectPointToLine,
  slopeInterceptFormToStandardForm,
} from './geometry';

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
  <div className="buttonGroup">
    {columns.map((a) => (
      <div
        key={a}
        className={`button ${column === a ? 'columnButtonActive' : ''}`}
        onClick={() => onChange(a)}
      >
        <div>{a}</div>
        <div
          className="columnButtonColor"
          style={{ backgroundColor: columnToColor(a) }}
        ></div>
      </div>
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

export default () => {
  const [column, setColumn] = useState(defaultColumn);
  const [positions, setPositions] = useState(defaultPositions);
  const ref = useRef<HTMLDivElement>(null);
  const [mmPer300px, setMmPer300px] = useState(defaultMMPer300px);
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
      <div className="topbar buttonGroup">
        <ColumnSelect column={column} onChange={(c) => setColumn(c)} />
        <div className="buttonGroup">
          <button
            className="button resetButton"
            onClick={() =>
              setPositions((pos) => ({
                ...pos,
                [column]: [],
              }))
            }
          >
            Reset column
          </button>
          <button
            className="button resetButton"
            onClick={() => setPositions(defaultPositions)}
          >
            Reset all
          </button>
        </div>
        <div>
          <label>Scale: </label>
          <input
            type="number"
            value={mmPer300px}
            onChange={(evt) => {
              setMmPer300px(parseFloat(evt.target.value));
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
