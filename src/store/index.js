import { combineReducers, configureStore } from "@reduxjs/toolkit";
import mixer from "./reducers/mixer";

const rootReducer = combineReducers({
  mixer,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
