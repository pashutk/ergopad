import React, {useState, useEffect, useRef} from "../_snowpack/pkg/react.js";
import "./App.css.proxy.js";
import {leastSquares} from "./leastSquares.js";
import {useTwo} from "./hooks.js";
import {
  projectPointToLine,
  slopeInterceptFormToStandardForm
} from "./geometry.js";
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
  className: "buttonGroup"
}, columns.map((a) => /* @__PURE__ */ React.createElement("div", {
  key: a,
  className: `button ${column === a ? "columnButtonActive" : ""}`,
  onClick: () => onChange(a)
}, /* @__PURE__ */ React.createElement("div", null, a), /* @__PURE__ */ React.createElement("div", {
  className: "columnButtonColor",
  style: {backgroundColor: columnToColor(a)}
}))));
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
export default () => {
  const [column, setColumn] = useState(defaultColumn);
  const [positions, setPositions] = useState(defaultPositions);
  const ref = useRef(null);
  const [mmPer300px, setMmPer300px] = useState(defaultMMPer300px);
  const linearScale = mmPer300px / 30;
  useEffect(() => {
    function f(evt) {
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
  }, [ref, column]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "app"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "topbar buttonGroup"
  }, /* @__PURE__ */ React.createElement(ColumnSelect, {
    column,
    onChange: (c) => setColumn(c)
  }), /* @__PURE__ */ React.createElement("div", {
    className: "buttonGroup"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "button resetButton",
    onClick: () => setPositions((pos) => ({
      ...pos,
      [column]: []
    }))
  }, "Reset column"), /* @__PURE__ */ React.createElement("button", {
    className: "button resetButton",
    onClick: () => setPositions(defaultPositions)
  }, "Reset all")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Scale: "), /* @__PURE__ */ React.createElement("input", {
    type: "number",
    value: mmPer300px,
    onChange: (evt) => {
      setMmPer300px(parseFloat(evt.target.value));
    }
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "touchytouchy",
    ref
  }, /* @__PURE__ */ React.createElement(Boo, {
    data: positions,
    linearScale
  })));
};
