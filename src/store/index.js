import { combineReducers, configureStore } from "@reduxjs/toolkit";

import mixer from "./reducers/mixer";
import recordings from "./reducers/recordings";

const rootReducer = combineReducers({
  mixer,
  recordings,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
