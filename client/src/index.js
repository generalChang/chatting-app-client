import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { BrowserRouter } from "react-router-dom";

import reducer from "./_reducers/index";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promise from "redux-promise";
import thunk from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(promise, thunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider
    store={createStoreWithMiddleware(
      reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
