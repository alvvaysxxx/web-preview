import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./18n.js";

import { Suspense } from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense
    fallback={
      <>
        <p>Loading...</p>
      </>
    }
  >
    <App />
  </Suspense>
);
