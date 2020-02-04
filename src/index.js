import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// import { Provider } from "react-redux";

// import session from "./redux/store";

import App from "./App";

ReactDOM.render(
  // <Provider session={session}>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </Provider>
  document.getElementById("root")
);
