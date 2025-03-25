import { setSelectedLocation } from "@/state/location/locationSlice";
import { AppDispatch } from "@/state/store";
import {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
    LineString,
} from "geojson";
import { useDispatch } from "react-redux";

const useHikeCentroid = ({
    selectedGeoJsonHike,
}: {
    selectedGeoJsonHike?: FeatureCollection;
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const calculateAndDispatchCentroid = () => {
        if (!selectedGeoJsonHike) return;

        console.log("selectedGeoJsonHike");

        const geoJsonHikeCentroids: Array<number[]> =
            selectedGeoJsonHike.features.map(
                (feature: Feature<Geometry, GeoJsonProperties>) => {
                    const center = calculateCentroid(
                        feature as Feature<LineString>
                    );
                    return center;
                }
            );

        let latSum = 0;
        let lngSum = 0;
        let count = 0;

        geoJsonHikeCentroids.forEach((centroid) => {
            lngSum += centroid[0];
            latSum += centroid[1];
            count++;
        });

        const selectedHikeBoundingBox = calculateBbox(
            [lngSum / count, latSum / count],
            3
        );

        console.log("bbox", selectedHikeBoundingBox);

        dispatch(
            setSelectedLocation({
                coordinates: [lngSum / count, latSum / count],
                bbox: selectedHikeBoundingBox,
                placeType: "HIKE",
            })
        );
    };

    return calculateAndDispatchCentroid;
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

function calculateCentroid(geoJson: Feature<LineString>): [number, number] {
    let latSum = 0;
    let lngSum = 0;
    let count = 0;

    if (isArrayNested(geoJson.geometry.coordinates)) {
        for (const coord of geoJson.geometry.coordinates) {
            lngSum += coord[0];
            latSum += coord[1];
            count++;
        }

        return [lngSum / count, latSum / count];
    }

    latSum = +geoJson.geometry.coordinates[1];
    lngSum = +geoJson.geometry.coordinates[0];

    return [lngSum, latSum];
}

function isArrayNested(arr: number[] | Array<number[]>): boolean {
    return Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]);
}

export default useHikeCentroid;
