import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import AppRoutes from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <AppRoutes/>
      </PersistGate>
    </BrowserRouter>
  </Provider>
);
