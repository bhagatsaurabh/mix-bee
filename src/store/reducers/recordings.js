import { createAction, createReducer } from "@reduxjs/toolkit";

const add = createAction("recordings/add");

const reducer = createReducer([], (builder) => {
  builder
    .addCase(add, (state, action) => {
      if (action.payload) state.push(action.payload);
      return state;
    })
    .addDefaultCase(() => {});
});

export default reducer;
