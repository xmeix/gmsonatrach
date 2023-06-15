import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import statReducer from "./features/statSlice";
import demandeReducer from "./features/demandeSlice";
import missionReducer from "./features/missionSlice";
import ticketReducer from "./features/ticketSlice";
import rfmsReducer from "./features/rfmsSlice";
import omsReducer from "./features/omsSlice";
import notificationsReducer from "./features/notificationsSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import localforage from "localforage";

const persistConfig = {
  key: "root",
  version: 1,
  storage: localforage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  mission: missionReducer,
  stat: statReducer,
  ticket: ticketReducer,
  notifications: notificationsReducer,
  rfms: rfmsReducer,
  oms: omsReducer,
  demande: demandeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

export const persistor = persistStore(store);
