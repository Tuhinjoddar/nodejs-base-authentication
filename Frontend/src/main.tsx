import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router.tsx";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./reduxThunkRTK/store.ts";

createRoot(document.getElementById("root")!).render(
  // Wrap Redux store
  <Provider store={store}>
    <RouterProvider router={router} /> {/* Provide React Router */}
  </Provider>
);
