import React, {useState, useEffect, useRef} from "../_snowpack/pkg/react.js";
import "./App.css.proxy.js";
import {leastSquares} from "./leastSquares.js";
import {useTwo} from "./hooks.js";
import {
  projectPointToLine,
  slopeInterceptFormToStandardForm
} from "./geometry.js";
import {pipe} from "../_snowpack/pkg/fp-ts/lib/function.js";
import * as O from "../_snowpack/pkg/fp-ts/lib/Option.js";
import * as TE from "../_snowpack/pkg/fp-ts/lib/TaskEither.js";
import {getFloat, setPrimitive} from "./localStorage.js";
import {sequenceS} from "../_snowpack/pkg/fp-ts/lib/Apply.js";
import * as AED from "./asyncEitherData.js";
import * as N from "../_snowpack/pkg/fp-ts-std/Number.js";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label
} from "../_snowpack/pkg/@windmill/react-ui.js";
const defaultColumn = "middle";
const columns = [
  "thumb",
  "index_far",
  "index",
  "middle",
  "ring",
  "pinky"
];
const columnToColor = (c) => {
  switch (c) {
    case "thumb":
      return "#363636";
    case "index_far":
      return "#5454E8";
    case "index":
      return "#9C9CB8";
    case "middle":
      return "#CF9393";
    case "ring":
      return "#59BDBD";
    case "pinky":
      return "#A5FAFA";
  }
};
const ColumnSelect = ({
  column,
  onChange
}) => /* @__PURE__ */ React.createElement("div", {
  className: "overflow-auto flex gap-2 pt-1 pb-1 pr-4"
}, columns.map((a) => /* @__PURE__ */ React.createElement(Button, {
  layout: column === a ? "outline" : "primary",
  key: a,
  onClick: () => onChange(a),
  iconRight: () => /* @__PURE__ */ React.createElement("div", {
    className: "h-4 w-4 ml-2 rounded",
    style: {backgroundColor: columnToColor(a)}
  }),
  size: "large"
}, a)));
const Boo = ({
  data,
  linearScale
}) => {
  const ref = useRef(null);
  useTwo(ref, (two, el) => {
    Object.entries(data).forEach(([column, positions]) => {
      const fill = columnToColor(column);
      positions.forEach((pos) => {
        const circle = two.makeCircle(pos.x, pos.y, 15);
        circle.linewidth = 0;
        circle.fill = fill;
        circle.opacity = 0.5;
      });
      if (positions.length > 1) {
        const trendline = leastSquares(positions, column !== "thumb");
        const line = two.makeLine(0, trendline.b, el.clientWidth, trendline.m * el.clientWidth + trendline.b);
        line.stroke = fill;
        line.opacity = 0.5;
        const projections = positions.map(projectPointToLine(slopeInterceptFormToStandardForm(trendline)));
        projections.forEach((pos, i) => {
          const circle = two.makeCircle(pos.x, pos.y, 3);
          circle.linewidth = 0;
          circle.fill = "red";
          circle.opacity = 0.3;
          const line2 = two.makeLine(pos.x, pos.y, positions[i].x, positions[i].y);
          line2.stroke = fill;
        });
        const xs = projections.map(({x}) => x);
        const minX = Math.min(...xs);
        const averageX = (Math.max(...xs) - minX) / 2 + minX;
        const midPoint = {
          x: averageX,
          y: trendline.m * averageX + trendline.b
        };
        const keyWidth = 17 * linearScale;
        const keyHeight = keyWidth;
        const gapY = 2 * linearScale;
        const originX = 0;
        const originY = 0;
        const homeRowKey = two.makeRectangle(originX, originY, keyWidth, keyHeight);
        homeRowKey.stroke = "black";
        homeRowKey.linewidth = 2;
        homeRowKey.fill = "transparent";
        const topRowKey = two.makeRectangle(originX, originY + gapY + keyHeight, keyWidth, keyHeight);
        topRowKey.stroke = "black";
        topRowKey.linewidth = 2;
        topRowKey.fill = "transparent";
        const bottomRowKey = two.makeRectangle(originX, originY - gapY - keyHeight, keyWidth, keyHeight);
        bottomRowKey.stroke = "black";
        bottomRowKey.linewidth = 2;
        bottomRowKey.fill = "transparent";
        const group = two.makeGroup([
          bottomRowKey,
          homeRowKey,
          topRowKey
        ]);
        group.translation.set(midPoint.x, midPoint.y);
        group.rotation = Math.PI / 2 + Math.atan(trendline.m);
      }
    });
    two.update();
    return () => {
      two.clear();
    };
  }, [data, ref.current, linearScale]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "boo",
    ref
  });
};
const defaultPositions = {
  thumb: [],
  index_far: [],
  index: [],
  middle: [],
  ring: [],
  pinky: []
};
const defaultMMPer300px = 100;
const ScaleTune = ({
  value,
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setIsModalOpen(true)
  }, "Tune scale"), /* @__PURE__ */ React.createElement(Modal, {
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false)
  }, /* @__PURE__ */ React.createElement(ModalHeader, null, /* @__PURE__ */ React.createElement("h2", {
    className: "text-xl"
  }, "Tune scale factor")), /* @__PURE__ */ React.createElement(ModalBody, null, /* @__PURE__ */ React.createElement("p", {
    className: "mb-4 text-base"
  }, "Default values used for displaying keycap size can be too far from real keycap size. To correct that measure width of the red line below and enter width in mm in the input."), /* @__PURE__ */ React.createElement("div", {
    className: "h-1 bg-red-700 mb-2"
  }), /* @__PURE__ */ React.createElement(Label, null, /* @__PURE__ */ React.createElement("p", {
    className: "mb-1 text-sm"
  }, "Enter scale factor"), /* @__PURE__ */ React.createElement(Input, {
    css: true,
    type: "number",
    value
  }))), /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
    className: "w-full sm:w-auto",
    onClick: () => setIsModalOpen(false)
  }, "Ok"))));
};
export const App = ({storedScale}) => {
  const [column, setColumn] = useState(defaultColumn);
  const [positions, setPositions] = useState(defaultPositions);
  const ref = useRef(null);
  const [mmPer300px, setMmPer300px] = useState(pipe(storedScale, O.getOrElse(() => defaultMMPer300px)));
  const linearScale = mmPer300px / 30;
  useEffect(() => {
    function f(evt) {
      evt.preventDefault();
      setPositions((pos) => ({
        ...pos,
        [column]: pos[column].concat([
          {
            x: evt.offsetX,
            y: evt.offsetY
          }
        ])
      }));
    }
    ref.current?.addEventListener("pointerdown", f);
    return () => {
      ref.current?.removeEventListener("pointerdown", f);
    };
  }, [ref.current, column]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "app"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "container p-4 pt-3 pr-0 flex flex-col gap-4"
  }, /* @__PURE__ */ React.createElement(ColumnSelect, {
    column,
    onChange: (c) => setColumn(c)
  }), /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-2 pr-4"
  }, /* @__PURE__ */ React.createElement(Button, {
    className: "",
    onClick: () => setPositions((pos) => ({
      ...pos,
      [column]: []
    }))
  }, "Reset column"), /* @__PURE__ */ React.createElement(Button, {
    className: "",
    onClick: () => setPositions(defaultPositions)
  }, "Reset all"), /* @__PURE__ */ React.createElement(ScaleTune, {
    value: String(mmPer300px),
    onChange: (v) => {
      pipe(N.floatFromString(v), O.fold(() => {
      }, (n) => {
        setPrimitive("SCALE_FACTOR", n)();
        setMmPer300px(n);
      }));
    }
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "touchytouchy",
    ref
  }, /* @__PURE__ */ React.createElement(Boo, {
    data: positions,
    linearScale
  })));
};
const setup = () => pipe({scale: TE.fromIOEither(getFloat("SCALE_FACTOR"))}, sequenceS(TE.ApplyPar));
export default () => pipe(AED.useAsyncEitherData(setup()), AED.fold(() => /* @__PURE__ */ React.createElement(React.Fragment, null, "Initialization"), () => /* @__PURE__ */ React.createElement(React.Fragment, null, "Loading"), (e) => /* @__PURE__ */ React.createElement("p", null, "Error: ", JSON.stringify(e)), (config) => /* @__PURE__ */ React.createElement(App, {
  storedScale: config.scale
})));
