import { configureStore } from "@reduxjs/toolkit";
import { productSlice } from "./slices/ProductSlice";

const store = configureStore({
  reducer: {
    [productSlice.name]: productSlice.reducer,
  },
});
export default store;
export type RootStateType = ReturnType<typeof store.getState>;
