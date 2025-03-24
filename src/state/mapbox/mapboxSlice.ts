import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
}

interface MapboxState {
    viewState: ViewState;
}

const initialState: MapboxState = {
    viewState: {
        longitude: 3.074001,
        latitude: 46.959325,
        zoom: 5,
    },
};

const mapboxSlice = createSlice({
    name: "mapbox",
    initialState,
    reducers: {
        setViewState: (state, action: PayloadAction<ViewState>) => {
            state.viewState = action.payload;
        },
    },
});

export const { setViewState } = mapboxSlice.actions;
export default mapboxSlice.reducer;
