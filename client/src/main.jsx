import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { store, persistor } from "./store/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store} persistor={persistor}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
