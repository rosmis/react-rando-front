import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    Hike,
    HikeComparaisonFilters,
    HikePreview,
    HikeQueryFilters,
} from "../../types/hikes";
import { Location } from "../location/locationSlice";
import { FeatureCollection } from "geojson";
import { gpx } from "@tmcw/togeojson";
import { api } from "@/services/api";

interface HikeState {
    hikesPreview?: {
        data: HikePreview[];
        total: number;
    };

    selectedHike?: Hike;
    hikeFilters: HikeQueryFilters;
    hikeFilterComparaisons?: HikeComparaisonFilters;
    selectedGeoJsonHike?: FeatureCollection;
    hoveredPreviewHikeId?: number;
    isHikesPreviewLoading: boolean;
}

const initialState: HikeState = {
    hikesPreview: undefined,
    selectedHike: undefined,
    selectedGeoJsonHike: undefined,
    isHikesPreviewLoading: false,
    hikeFilters: {
        radius: 50000,
        difficulty: undefined,
        duration: undefined,
        distance: undefined,
    },
    hikeFilterComparaisons: {
        distance: undefined,
        duration: undefined,
    },
    hoveredPreviewHikeId: undefined,
};

const hikeSlice = createSlice({
    name: "hike",
    initialState,
    reducers: {
        setSelectedHike: (state, action: PayloadAction<Hike | undefined>) => {
            state.selectedHike = action.payload;
        },
        setHikesPreviewLoading: (state, action: PayloadAction<boolean>) => {
            state.isHikesPreviewLoading = action.payload;
        },
        setSelectedGeoJsonHike: (
            state,
            action: PayloadAction<FeatureCollection | undefined>
        ) => {
            state.selectedGeoJsonHike = action.payload;
        },
        setHoveredPreviewHikeId: (
            state,
            action: PayloadAction<number | undefined>
        ) => {
            state.hoveredPreviewHikeId = action.payload;
        },
        setHikeFilters: (state, action: PayloadAction<HikeQueryFilters>) => {
            state.hikeFilters = action.payload;
        },
        setHikeFilterComparaison: (
            state,
            action: PayloadAction<HikeComparaisonFilters>
        ) => {
            state.hikeFilterComparaisons = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            hikePreviewsAsync.fulfilled,
            (
                state,
                action: PayloadAction<{
                    meta: {
                        total: number;
                    };
                    data: HikePreview[];
                }>
            ) => {
                state.hikesPreview = {
                    data: action.payload.data,
                    total: action.payload.meta.total,
                };
            }
        );

        builder.addCase(
            hikeAsync.fulfilled,
            (state, action: PayloadAction<Hike>) => {
                state.selectedHike = action.payload;
            }
        );
        builder.addCase(
            gpxAsync.fulfilled,
            (state, action: PayloadAction<FeatureCollection>) => {
                state.selectedGeoJsonHike = action.payload;
            }
        );
    },
});

export const hikePreviewsAsync = createAsyncThunk(
    "hike/fetchHikesPreview",
    async (location: {
        location: Location;
        page?: number;
        query?: HikeQueryFilters;
        filterComparaisons?: HikeComparaisonFilters;
    }) => {
        const hikes = await api.get(`/api/hikes/search`, {
            params: {
                latitude: location.location.coordinates[1],
                longitude: location.location.coordinates[0],
                page: location.page ?? 1,
                ...setDynamicQueryParamsQuery(
                    location.query,
                    location.filterComparaisons
                ),
            },
        });

        return hikes.data;
    }
);

export const hikeAsync = createAsyncThunk(
    "hike/fetchHike",
    async (id: number) => {
        const { data: hike } = await api.get(`/api/hikes/${id}`);

        return hike.data;
    }
);

export const gpxAsync = createAsyncThunk(
    "hike/fetchGpx",
    async (url: string) => {
        const geoJson: FeatureCollection = await fetch(url)
            .then((response) => response.text())
            .then((data) => {
                return gpx(new DOMParser().parseFromString(data, "text/xml"));
            });

        return geoJson;
    }
);

const setDynamicQueryParamsQuery = (
    query?: HikeQueryFilters,
    filterComparaisons?: HikeComparaisonFilters
) => {
    let queryFilters = {};

    if (query?.distance && filterComparaisons?.distance) {
        const filter = `filter[distance-${filterComparaisons.distance}]`;

        queryFilters = {
            ...queryFilters,
            [filter]: query.distance,
        };
    }

    if (query?.duration && filterComparaisons?.duration) {
        const filter = `filter[duration-${filterComparaisons.duration}]`;

        queryFilters = {
            ...queryFilters,
            [filter]: query.duration,
        };
    }

    if (query?.difficulty) {
        queryFilters = {
            ...queryFilters,
            "filter[difficulty]": query.difficulty,
        };
    }

    queryFilters = {
        ...queryFilters,
        radius: query?.radius ?? 50000,
    };

    return queryFilters;
};

export const {
    setSelectedHike,
    setHoveredPreviewHikeId,
    setHikesPreviewLoading,
    setSelectedGeoJsonHike,
    setHikeFilters,
    setHikeFilterComparaison,
} = hikeSlice.actions;
export default hikeSlice.reducer;
