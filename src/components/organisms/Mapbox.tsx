import { useMemo } from "react";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import {
    hikePreviewsAsync,
    setHikesPreviewLoading,
} from "../../state/hike/hikeSlice";
import Map, { Layer, MapRef, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxMarker from "./MapboxMarker";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa6";
import { setSidebarState, toggleSidebar } from "@/state/sidebar/sidebarSlice";
import { useMapRef } from "@/composables/useMapRef";
import { setSelectedLocationBoundingBox } from "@/state/location/locationSlice";
import { HikePreview } from "@/types/hikes";

const Mapbox = () => {
    const mapRef = useMapRef();
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const dispatch = useDispatch<AppDispatch>();

    const viewState = useSelector((state: RootState) => state.mapbox.viewState);

    const selectedLocation = useSelector(
        (state: RootState) => state.location.selectedLocation
    );
    const hikesPreview = useSelector(
        (state: RootState) => state.hike.hikesPreview
    );
    const selectedHike = useSelector(
        (state: RootState) => state.hike.selectedHike
    );

    const selectedGeoJsonHike = useSelector(
        (state: RootState) => state.hike.selectedGeoJsonHike
    );

    const isSidebarOpened = useSelector(
        (state: RootState) => state.sidebar.isOpen
    );

    const hikeFilters = useSelector(
        (state: RootState) => state.hike.hikeFilters
    );

    const hikeComparaisonFilter = useSelector(
        (state: RootState) => state.hike.hikeFilterComparaisons
    );

    // let bearing = 0;
    // let timeoutId: NodeJS.Timeout;

    // // camera animation
    // const rotateCamera = () => {
    //     if (mapRef.current && selectedLocation) {
    //         mapRef.current.flyTo({
    //             center: selectedLocation.coordinates,
    //             bearing: bearing,
    //             speed: 0.1,
    //             pitch: 65,
    //             curve: 1,
    //         });

    //         bearing = (bearing + 1) % 360;

    //         timeoutId = setTimeout(rotateCamera, 100);
    //     }
    // };

    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            let selectedBoundingBox = selectedLocation.bbox;

            if (selectedLocation.placeType !== "HIKE") {
                dispatch(setSidebarState(true));
                dispatch(setHikesPreviewLoading(true));

                // Delay hike preview fetch to prevent flickering
                setTimeout(
                    async () =>
                        await dispatch(
                            hikePreviewsAsync({
                                location: selectedLocation,
                                query: hikeFilters,
                                filterComparaisons: hikeComparaisonFilter,
                            })
                        ).then(() => {
                            // TODO add dynamic radius after sidebar creation with radius
                            // Recalculate bbox with radius
                            selectedBoundingBox = calculateBbox(
                                selectedLocation.coordinates,
                                hikeFilters.radius / 1000
                            );

                            redirectToSeletedViewport(
                                mapRef,
                                selectedBoundingBox
                            );

                            dispatch(setHikesPreviewLoading(false));
                            dispatch(
                                setSelectedLocationBoundingBox(
                                    selectedBoundingBox
                                )
                            );
                        }),
                    200
                );

                return;
            }

            redirectToSeletedViewport(mapRef, selectedBoundingBox);

            // TODO find a way to implement this gadget feature properly
            // rotate camera only when hike selected and not when location selected
            // mapRef.current.once("moveend", () => {
            //     console.log("MOVE END");

            //     if (selectedLocation.placeType === "HIKE") {
            //         rotateCamera();
            //     }
            // });
        }

        // return () => {
        //     clearTimeout(timeoutId);
        // };
        console.log("mapbox HUGE effect REACALCULATING");
    }, [dispatch, selectedLocation]);

    const markers = useMemo(() => {
        if (!hikesPreview && selectedHike) {
            return <MapboxMarker hike={selectedHike as HikePreview} />;
        }

        // console.log("USE MEMO MARKERS");

        return hikesPreview?.data.map((hike, i) => {
            return <MapboxMarker key={i} hike={hike} />;
        });
    }, [hikesPreview, selectedHike]);

    // const onMove = useCallback((event: ViewStateChangeEvent) => {
    //     dispatch(setViewState(event.viewState));
    // }, []);

    // const onClick = useCallback(() => {
    //     console.log("click", selectedLocation, timeoutId);
    //     if (
    //         selectedLocation &&
    //         selectedLocation.placeType === "HIKE" &&
    //         timeoutId
    //     ) {
    //         console.log("clearing timeout");
    //         clearTimeout(timeoutId);
    //     }
    // }, [selectedLocation]);

    return (
        <div className="relative w-full rounded-tl-md rounded-bl-md">
            {/* <div className="absolute top-20 left-0 bg-red-600 z-50">
                {JSON.stringify(hikeFilters)}
            </div> */}
            <Button
                className="z-10 absolute top-20 left-6 hidden md:block"
                onClick={() => dispatch(toggleSidebar())}
            >
                <FaChevronRight
                    className={
                        isSidebarOpened
                            ? "transform transition rotate-180"
                            : "transition"
                    }
                />
            </Button>

            <div className="relative h-[90vh] md:h-screen">
                <Map
                    initialViewState={viewState}
                    mapStyle="mapbox://styles/mapbox/standard"
                    // mapStyle="mapbox://styles/abdoulaye01/clu26vfli00m301mjgf4z16fy"
                    mapboxAccessToken={mapboxAccessToken}
                    style={{ width: "100vw", height: "100%" }}
                    // onMove={onMove}
                    ref={mapRef}
                >
                    {selectedGeoJsonHike && (
                        <Source
                            id="selected-hike"
                            type="geojson"
                            data={selectedGeoJsonHike}
                        >
                            <Layer
                                id="hike"
                                type="line"
                                paint={{
                                    "line-color": "#ff0000",
                                    "line-width": 2,
                                }}
                            />
                        </Source>
                    )}
                    {markers}
                </Map>
            </div>

            {/* <div
                style={{ minWidth: "65vw", maxWidth: "100vw", height: "100vh" }}
                className="bg-red-600"
            ></div> */}
        </div>
    );
};

function calculateBbox(center: number[], radiusInKm: number) {
    const [lng, lat] = center;

    // Radius of the Earth in km
    const R = 6371;

    // Angular distance in radians on a great circle
    const radDist = radiusInKm / R;

    const minLat = lat - radDist * (180 / Math.PI);
    const maxLat = lat + radDist * (180 / Math.PI);

    const deltaLng = Math.asin(
        Math.sin(radDist) / Math.cos((lat * Math.PI) / 180)
    );
    const minLng = lng - deltaLng * (180 / Math.PI);
    const maxLng = lng + deltaLng * (180 / Math.PI);

    return [minLng, minLat, maxLng, maxLat];
}

function redirectToSeletedViewport(
    mapRef: React.RefObject<MapRef | null>,
    selectedBoundingBox: number[]
) {
    return mapRef.current?.fitBounds(
        [
            [selectedBoundingBox[0], selectedBoundingBox[1]],
            [selectedBoundingBox[2], selectedBoundingBox[3]],
        ],
        {
            padding: { top: 10, bottom: 25, left: 15, right: 5 },
        }
    );
}

export default Mapbox;
