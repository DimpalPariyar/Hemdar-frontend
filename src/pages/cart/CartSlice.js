import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // cart: [],
  cart: [
    {
      id: 12,
      title: "earing",
      category: "Keychain",
      price: 120.5,
      image: "../src/images/octopus_earing.png",
    },
  ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    // increaseItemQuantity(state, action) {},
    // decreaseItemQuantity(state, action) {},
    // clearCart(state, action) {},
  },
});

export const {
  addItem,
  deleteItem,
  //   increaseItemQuantity,
  //   decreaseItemQuantity,
  //   clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;
