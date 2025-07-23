import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AppProvider } from "./context/AppContext";  // Import Provider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ToastContainer></ToastContainer>
    <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
     
    </BrowserRouter>
  </React.StrictMode>
);
