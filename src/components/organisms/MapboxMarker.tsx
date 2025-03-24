import { FaLocationDot } from "react-icons/fa6";
import { Marker } from "react-map-gl";
import { HikePreview } from "../../types/hikes";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useEffect, useMemo } from "react";
import useHikeCentroid from "@/hooks/useHikeCentroid";
import { useLocation, useNavigate } from "react-router-dom";

const MapboxMarker = ({ hike }: { hike: HikePreview }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const selectedHike = useSelector(
        (state: RootState) => state.hike.selectedHike
    );
    const selectedGeoJsonHike = useSelector(
        (state: RootState) => state.hike.selectedGeoJsonHike
    );
    const hoveredHikePreviewId = useSelector(
        (state: RootState) => state.hike.hoveredPreviewHikeId
    );

    const calculateAndDispatchCentroid = useHikeCentroid({
        selectedGeoJsonHike,
    });

    const handleUserSelection = () => {
        const searchQuery = location.state?.searchQuery;

        navigate(`/hike/${hike?.id}`, {
            state: { searchQuery },
        });
    };

    // handle geojson path and camera position when hike is selected
    useEffect(() => {
        if (selectedHike?.id === hike.id) {
            console.log("geojson USE EFFECT", selectedGeoJsonHike);

            calculateAndDispatchCentroid();
        }
    }, [
        selectedGeoJsonHike,
        selectedHike,
        hike.id,
        calculateAndDispatchCentroid,
    ]);

    const markerOpacity = useMemo(() => {
        if (hoveredHikePreviewId === hike.id) return 1;

        if (!selectedHike && !hoveredHikePreviewId) return 1;
        if (selectedHike && selectedHike.id === hike.id) return 1;

        return 0.2;
    }, [selectedHike, hoveredHikePreviewId, hike.id]);

    return (
        <>
            <Marker
                longitude={hike.longitude}
                latitude={hike.latitude}
                onClick={handleUserSelection}
                style={{
                    cursor: "pointer",
                }}
            >
                <FaLocationDot
                    size={30}
                    color="#ad4343"
                    // color="#ad4343"
                    style={{
                        opacity: markerOpacity,
                    }}
                />
            </Marker>
        </>
    );
};

export default MapboxMarker;
