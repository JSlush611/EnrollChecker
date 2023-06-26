import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    courses: [],
    courseList: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null; 
        },
        setCourses: (state, action) => {
            state.courses = action.payload.courses;
        },
        setSubscriptions: (state, action) => {
            state.courseList = action.payload.courseList;
        },
    }
})

export const { setMode, setLogin, setLogout, setCourses, setSubscriptions} = authSlice.actions;
export default authSlice.reducer;