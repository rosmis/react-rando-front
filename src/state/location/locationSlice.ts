import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ZoomLevels } from "../../types/zoomLevels";
import { Location as LocationType } from "react-router-dom";
import { RootState } from "../store";
import { Feature, MapboxGeocodingResponse } from "@/types/mapbox";
import {
    HikeComparaison,
    HikeComparaisonFilters,
    HikeQueryFilters,
} from "@/types/hikes";
import { setHikeFilterComparaison, setHikeFilters } from "../hike/hikeSlice";

export interface Location {
    coordinates: number[];
    bbox: number[];
    placeType: keyof typeof ZoomLevels;
}

type HikeFilterKeys = "duration" | "distance" | "difficulty" | "radius";

interface HikeFilterValue {
    comparaison?: HikeComparaison;
    value: string | number;
}

type SelectedHikeFilters = {
    [K in HikeFilterKeys]?: HikeFilterValue;
};

export interface ResultLocation {
    name: string;
    location: string;
    centerCoordinates: number[];
    bbox: number[];
    placeType: string;
}

interface LocationState {
    searchedLocation: string;
    selectedLocation?: Location;
    selectedLocationBoundingBox?: number[];
    locations: ResultLocation[];
}

const initialState: LocationState = {
    searchedLocation: "",
    selectedLocation: undefined,
    selectedLocationBoundingBox: undefined,
    locations: [],
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setSearchedLocation: (state, action: PayloadAction<string>) => {
            state.searchedLocation = action.payload;
        },
        setSelectedLocation: (state, action: PayloadAction<Location>) => {
            state.selectedLocation = action.payload;
        },
        setSelectedLocationBoundingBox: (
            state,
            action: PayloadAction<number[] | undefined>
        ) => {
            state.selectedLocationBoundingBox = action.payload;
        },
        setLocations: (state, action: PayloadAction<ResultLocation[]>) => {
            state.locations = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(locationsAsync.fulfilled, (state, action) => {
            if (!action.payload) return;

            state.locations = action.payload.features.map((location) => {
                const [exactLocation, ...locationName] =
                    location.place_name.split(", ");

                return {
                    name: exactLocation,
                    location: locationName.join(", "),
                    centerCoordinates: location.center,
                    bbox: location.bbox!,
                    placeType: location.place_type[0],
                };
            });
        });
    },
});

export const locationsAsync = createAsyncThunk(
    "location/fetchLocations",
    async (
        location: {
            location?: string;
            coordinates?: number[];
        },
        { dispatch }
    ) => {
        const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        const locationParameters = `${location?.location}.json`;
        const coordinatesParameters = `${location?.coordinates?.join(
            ","
        )}.json`;

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${
                location.location ? locationParameters : coordinatesParameters
            }?proximity=ip&language=fr&access_token=${accessToken}`
        );

        const data: MapboxGeocodingResponse = await response.json();

        // set selected location if coordinates are provided
        if (location.coordinates) {
            dispatch(
                setSelectedLocationWithUrlParams({
                    features: data.features,
                    coordinates: location.coordinates,
                })
            );
            return;
        }

        return data;
    }
);

const setSelectedLocationWithUrlParams = createAsyncThunk(
    "app/setSelectedLocationWithUrlParams",
    async (
        data: {
            features: Feature[];
            coordinates: number[];
        },
        { dispatch }
    ) => {
        const resultLocationWithBbox = data.features.find(
            (location) => location.bbox
        );

        if (resultLocationWithBbox) {
            const [exactLocation, ...locationName] =
                resultLocationWithBbox.place_name.split(", ");

            dispatch(
                setSelectedLocation({
                    coordinates: data.coordinates,
                    bbox: resultLocationWithBbox.bbox!,
                    placeType: resultLocationWithBbox
                        .place_type[0] as keyof typeof ZoomLevels,
                })
            );
            dispatch(
                setSearchedLocation(
                    exactLocation.concat(", ", locationName.join(", "))
                )
            );
        }
    }
);

export const setLocationsAsyncWithUrlParams = createAsyncThunk(
    "app/setLocationsAsyncWithUrlParams",
    async (location: LocationType, { dispatch, getState }) => {
        const urlParams = new URLSearchParams(location.search);
        const state = getState() as RootState;
        const { selectedLocation } = state.location;

        const queryHikeFilterParams: Array<keyof HikeQueryFilters> = [
            "duration",
            "distance",
            "difficulty",
            "radius",
        ];

        if (
            urlParams.has("latitude") &&
            urlParams.has("longitude") &&
            !selectedLocation
        ) {
            //if it has query filter params, set them by default
            if (queryHikeFilterParams.some((param) => urlParams.has(param))) {
                await dispatch(
                    setSelectedFiltersWithUrlParams({
                        queryParams: urlParams,
                        queryHikeFilterParams,
                    })
                );
            }

            await dispatch(
                locationsAsync({
                    coordinates: [
                        parseFloat(urlParams.get("longitude")!),
                        parseFloat(urlParams.get("latitude")!),
                    ],
                })
            );
        }
    }
);

const setSelectedFiltersWithUrlParams = createAsyncThunk(
    "app/setSelectedFiltersWithUrlParams",
    async (
        data: {
            queryParams: URLSearchParams;
            queryHikeFilterParams: Array<keyof HikeQueryFilters>;
        },
        { dispatch, getState }
    ) => {
        const state = getState() as RootState;
        const { hikeFilters } = state.hike;

        const hikeFiltersResult: SelectedHikeFilters =
            data.queryHikeFilterParams.reduce((acc, hikeFilter) => {
                const splittedParam = data.queryParams.get(hikeFilter);

                if (splittedParam) {
                    const [comparaison, value] = splittedParam.split(".");
                    const isParamSplitted = splittedParam.split(".").length > 1;

                    return {
                        ...acc,
                        [hikeFilter]: {
                            comparaison: isParamSplitted
                                ? comparaison
                                : undefined,
                            value: isParamSplitted ? +value : splittedParam,
                        },
                    };
                }

                return acc;
            }, {} as SelectedHikeFilters);

        dispatch(
            setHikeFilters({
                ...hikeFilters,
                ...Object.keys(hikeFiltersResult).reduce((acc, key) => {
                    return {
                        ...acc,
                        [key]: hikeFiltersResult[key as HikeFilterKeys]?.value,
                    };
                }, {} as HikeQueryFilters),
            })
        );

        dispatch(
            setHikeFilterComparaison(
                Object.keys(hikeFiltersResult).reduce((acc, key) => {
                    if (hikeFiltersResult[key as HikeFilterKeys]?.comparaison) {
                        return {
                            [key]: hikeFiltersResult[key as HikeFilterKeys]
                                ?.comparaison,
                        };
                    }

                    return acc;
                }, {} as HikeComparaisonFilters)
            )
        );
    }
);

export const {
    setSearchedLocation,
    setSelectedLocation,
    setLocations,
    setSelectedLocationBoundingBox,
} = locationSlice.actions;

export default locationSlice.reducer;
