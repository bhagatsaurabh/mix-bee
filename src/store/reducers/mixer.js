import { createAction, createReducer } from "@reduxjs/toolkit";

const init = createAction("mixer/init");
const activate = createAction("mixer/activate");

const reducer = createReducer([], (builder) => {
  builder
    .addCase(init, (_state, action) => {
      if (action.payload) return [...action.payload];
      return [];
    })
    .addCase(activate, (state, action) => {
      const hexpad = state[action.payload.group - 1].hexpads.find(
        (hexpad) => hexpad.id === action.payload.id
      );
      hexpad.active = !hexpad.active;
      return state;
    })
    .addDefaultCase(() => {});
});

export default reducer;
