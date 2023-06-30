import { createAsyncThunk } from "@reduxjs/toolkit";

const loadSample = createAsyncThunk("sample/load", async ({ gId, hId, ctx }, { dispatch }) => {
  try {
    const response = await (await fetch(`/samples/${hId - 1}.ogg`)).arrayBuffer();
    const buffer = await ctx.decodeAudioData(response);
    dispatch({ type: "mixer/set-loaded", payload: { group: gId, id: hId } });
    return buffer;
  } catch (error) {
    console.log(error);
  }
});

export { loadSample };
