import { createAction, createReducer } from "@reduxjs/toolkit";

const init = createAction("mixer/init");
const activate = createAction("mixer/activate");
const setLoaded = createAction("mixer/set-loaded");
const clearQueued = createAction("mixer/clear-queued");
const clearQueuedAll = createAction("mixer/clear-queued-all");

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
      if (hexpad.active) {
        hexpad.queued = true;
      } else {
        hexpad.queued = false;
      }
      return state;
    })
    .addCase(setLoaded, (state, action) => {
      const hexpad = state[action.payload.group - 1].hexpads.find(
        (hexpad) => hexpad.id === action.payload.id
      );
      hexpad.loaded = true;
      return state;
    })
    .addCase(clearQueued, (state, action) => {
      const hexpad = state[action.payload.group - 1].hexpads.find(
        (hexpad) => hexpad.id === action.payload.id
      );
      hexpad.queued = false;
      return state;
    })
    .addCase(clearQueuedAll, (state) => {
      state.forEach((group) => group.hexpads.forEach((hexpad) => (hexpad.queued = false)));
      return state;
    })

    .addDefaultCase(() => {});
});

export default reducer;
