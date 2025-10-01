// import { createSlice } from "@reduxjs/toolkit";

// const authSlice= createSlice({
//     name:"auth",
//     initialState:{isLoggedIn: false, role: "user"},
//     reducers:{
//         login(state){
//             state.isLoggedIn=true;
//         },
//         logout(state){
//             state.isLoggedIn=false;
//         },
//         changeRole(state, action){
//             const role = action.payload;
//             state.role=role;
//         },
//     },

// });

// export const authActions= authSlice.actions;
// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    isSeller: false,
    isPremium: false,
    premiumType: "free",
    premiumExpiry: null,
  },
  reducers: {
    login(state, action) {
      const payload = action.payload || {};
  state.isLoggedIn = true;
  state.role = payload.role || "user";
  state.isSeller = payload.isSeller || false;
  state.isPremium = payload.isPremium || false;
  state.premiumType = payload.premiumType || "free";
  state.premiumExpiry = payload.premiumExpiry || null;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user";
      state.isSeller = false;
      state.isPremium = false;
      state.premiumType = "free";
      state.premiumExpiry = null;
    },
    changeRole(state, action) {
      state.role = action.payload.role;
    },
    updatePremium(state, action) {
      state.isPremium = action.payload.isPremium;
      state.premiumType = action.payload.premiumType;
      state.premiumExpiry = action.payload.premiumExpiry;
    },
    updateSeller(state, action) {
      state.isSeller = action.payload.isSeller;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;