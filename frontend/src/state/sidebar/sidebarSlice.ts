import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SidebarState {
    isOpen: boolean;
}

const initialState: SidebarState = {
    isOpen: false,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isOpen = !state.isOpen;
        },
        setSidebarState: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebarState } = sidebarSlice.actions;
export default sidebarSlice.reducer;
