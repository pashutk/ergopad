import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import App from "./App.js";
import "./index.css.proxy.js";
import {Windmill} from "../_snowpack/pkg/@windmill/react-ui.js";
ReactDOM.render(/* @__PURE__ */ React.createElement(Windmill, {
  dark: true,
  theme: {
    button: {
      primary: {
        base: "text-white bg-gray-600 border border-transparent",
        active: "active:bg-gray-600 hover:bg-gray-700 focus:ring focus:ring-gray-300",
        disabled: "opacity-50 cursor-not-allowed"
      }
    }
  }
}, /* @__PURE__ */ React.createElement(App, null)), document.getElementById("root"));
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
