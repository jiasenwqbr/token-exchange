import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import App from "./components/App";
import configureStore from "./store/configureStore";
import * as serviceWorker from "./serviceWorker";

// BigInt.prototype.toJSON = function () {
//   return this.toString();
// };
ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
