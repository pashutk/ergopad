import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from "../_snowpack/pkg/react.js";
import "./App.css.proxy.js";
import {leastSquares} from "./leastSquares.js";
import {usePopupState, useTwo} from "./hooks.js";
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
  Label,
  Dropdown,
  DropdownItem
} from "../_snowpack/pkg/@windmill/react-ui.js";
import {SaveIcon} from "../_snowpack/pkg/@heroicons/react/solid.js";
import toast, {Toaster} from "../_snowpack/pkg/react-hot-toast.js";
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
  ppm,
  showAuxiliaryLines
}) => {
  const ref = useRef(null);
  useTwo(ref, (two, el) => {
    Object.entries(data).forEach(([column, positions]) => {
      const fill = columnToColor(column);
      if (showAuxiliaryLines) {
        positions.forEach((pos) => {
          const circle = two.makeCircle(pos.x, pos.y, 15);
          circle.linewidth = 0;
          circle.fill = fill;
          circle.opacity = 0.5;
        });
      }
      if (positions.length > 1) {
        const trendline = leastSquares(positions, column !== "thumb");
        if (showAuxiliaryLines) {
          const line = two.makeLine(0, trendline.b, el.clientWidth, trendline.m * el.clientWidth + trendline.b);
          line.stroke = fill;
          line.opacity = 0.5;
        }
        const projections = positions.map(projectPointToLine(slopeInterceptFormToStandardForm(trendline)));
        if (showAuxiliaryLines) {
          projections.forEach((pos, i) => {
            const circle = two.makeCircle(pos.x, pos.y, 3);
            circle.linewidth = 0;
            circle.fill = "red";
            circle.opacity = 0.3;
            const line = two.makeLine(pos.x, pos.y, positions[i].x, positions[i].y);
            line.stroke = fill;
          });
        }
        const xs = projections.map(({x}) => x);
        const minX = Math.min(...xs);
        const averageX = (Math.max(...xs) - minX) / 2 + minX;
        const midPoint = {
          x: averageX,
          y: trendline.m * averageX + trendline.b
        };
        const keyWidth = 17 * ppm;
        const keyHeight = keyWidth;
        const gapY = 2 * ppm;
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
  }, [data, ref.current, ppm, showAuxiliaryLines]);
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
const DEFAULT_PX_PER_MM_VALUE = 5;
const PIX_PER_MM_LOCALSTORAGE_KEY = "stored_ppm";
const PxPerMMControl = ({
  defaultValue,
  value,
  onChange
}) => {
  const [inputVal, setInputVal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const measureRef = useRef(null);
  const onChangeHandler = useCallback((evt) => {
    const newValue = pipe(O.Do, O.apS("px", pipe(measureRef.current, O.fromNullable, O.map((el) => el.clientWidth))), O.apS("mm", pipe(evt.target.value, N.floatFromString)), O.bind("value", ({mm, px}) => O.of(px / mm)));
    setInputVal(pipe(newValue, O.map(({mm}) => mm), O.getOrElse(() => 130)));
    onChange(pipe(newValue, O.map(({value: value2}) => value2), O.getOrElse(() => defaultValue * 130)));
  }, [onChange]);
  useEffect(() => {
    if (isModalOpen && measureRef.current) {
      setInputVal(measureRef.current.clientWidth / value);
    }
  }, [measureRef.current, isModalOpen]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setIsModalOpen(true)
  }, "Tune scale"), /* @__PURE__ */ React.createElement(Modal, {
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false)
  }, /* @__PURE__ */ React.createElement(ModalHeader, null, /* @__PURE__ */ React.createElement("span", {
    className: "text-xl"
  }, "Tune scale factor")), /* @__PURE__ */ React.createElement(ModalBody, null, /* @__PURE__ */ React.createElement("p", {
    className: "mb-4 text-base"
  }, "Default values used for displaying keycap size can be too far from real keycap size. To correct that measure width of the red line below and enter width in mm in the input."), /* @__PURE__ */ React.createElement("div", {
    ref: measureRef,
    className: "h-1 bg-red-700 mb-2"
  }), /* @__PURE__ */ React.createElement(Label, null, /* @__PURE__ */ React.createElement("p", {
    className: "mb-1 text-sm"
  }, "Red line width in mm"), /* @__PURE__ */ React.createElement(Input, {
    css: "",
    type: "number",
    value: inputVal,
    onChange: onChangeHandler
  }))), /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
    className: "w-full sm:w-auto",
    onClick: () => setIsModalOpen(false)
  }, "Ok"))));
};
const Export = ({
  onRawExport,
  state
}) => {
  const key = String(state.isOpen);
  return /* @__PURE__ */ React.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React.createElement(Button, {
    key: key + "button",
    onClick: state.toggle,
    "aria-label": "Notifications",
    "aria-haspopup": "true",
    icon: SaveIcon
  }, "Export"), /* @__PURE__ */ React.createElement(Dropdown, {
    isOpen: state.isOpen,
    onClose: state.close,
    key: key + "dropdown"
  }, /* @__PURE__ */ React.createElement(DropdownItem, {
    onClick: onRawExport
  }, /* @__PURE__ */ React.createElement("span", null, "Raw"))));
};
export const App = ({storedPpm}) => {
  const [column, setColumn] = useState(defaultColumn);
  const [positions, setPositions] = useState(defaultPositions);
  const [showAuxiliaryLines, setShowAuxiliaryLines] = useState(true);
  const ref = useRef(null);
  const defaultPpm = pipe(storedPpm, O.getOrElse(() => DEFAULT_PX_PER_MM_VALUE));
  const [ppm, setPpm] = useState(defaultPpm);
  const onPpmChange = useCallback((newPpm) => {
    setPrimitive(PIX_PER_MM_LOCALSTORAGE_KEY, newPpm)();
    setPpm(newPpm);
  }, [setPpm, setPrimitive]);
  const exportState = usePopupState(false);
  const onRawExport = useCallback(() => {
    globalThis.navigator.clipboard.writeText(JSON.stringify(positions)).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Something went wrong");
    }).finally(() => {
      exportState.close();
    });
  }, [positions, exportState.close]);
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
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Toaster, null)), /* @__PURE__ */ React.createElement("div", {
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
  }, "Reset all"), /* @__PURE__ */ React.createElement(PxPerMMControl, {
    value: ppm,
    onChange: onPpmChange,
    defaultValue: defaultPpm
  }), /* @__PURE__ */ React.createElement(Label, null, /* @__PURE__ */ React.createElement(Button, {
    tag: "span"
  }, /* @__PURE__ */ React.createElement(Input, {
    type: "checkbox",
    css: "",
    checked: showAuxiliaryLines,
    onChange: (evt) => {
      setShowAuxiliaryLines((val) => !val);
    }
  }), /* @__PURE__ */ React.createElement("span", {
    className: "ml-2"
  }, "Aux lines"))), /* @__PURE__ */ React.createElement(Export, {
    onRawExport,
    state: exportState
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "touchytouchy",
    ref
  }, /* @__PURE__ */ React.createElement(Boo, {
    data: positions,
    ppm,
    showAuxiliaryLines
  })));
};
const setup = () => pipe({ppm: TE.fromIOEither(getFloat(PIX_PER_MM_LOCALSTORAGE_KEY))}, sequenceS(TE.ApplyPar));
export default () => pipe(AED.useAsyncEitherData(setup()), AED.fold(() => /* @__PURE__ */ React.createElement(React.Fragment, null, "Initialization"), () => /* @__PURE__ */ React.createElement(React.Fragment, null, "Loading"), (e) => /* @__PURE__ */ React.createElement("p", null, "Error: ", JSON.stringify(e)), (config) => /* @__PURE__ */ React.createElement(App, {
  storedPpm: config.ppm
})));
