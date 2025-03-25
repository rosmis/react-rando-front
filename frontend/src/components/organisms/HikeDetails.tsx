import { AppDispatch, RootState } from "@/state/store";
import { FaChevronLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { MapRef } from "react-map-gl";
import { useMapRef } from "@/composables/useMapRef";
import {
    gpxAsync,
    hikeAsync,
    setSelectedGeoJsonHike,
    setSelectedHike,
} from "@/state/hike/hikeSlice";
import HikePercs from "../molecules/HikePercs";
import icons from "@/assets/icons/icons";
import { HikeDifficulty, HikeDifficultyTitle } from "@/types/hikes";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
import { setSidebarState } from "@/state/sidebar/sidebarSlice";
import useHikeCentroid from "@/hooks/useHikeCentroid";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import UiIcon from "../atoms/UiIcon";
import HikeCarousel from "./HikeCarousel";

const HikeDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const frontUrl = import.meta.env.VITE_FRONT_URL;

    const mapRef = useMapRef();
    const dispatch = useDispatch<AppDispatch>();

    const { copyToClipboard, selectedIcon } = useCopyToClipboard();

    const selectedLocationBoundingBox = useSelector(
        (state: RootState) => state.location.selectedLocationBoundingBox
    );

    const selectedHike = useSelector(
        (state: RootState) => state.hike.selectedHike
    );
    const selectedGeoJsonHike = useSelector(
        (state: RootState) => state.hike.selectedGeoJsonHike
    );

    const calculateAndDispatchCentroid = useHikeCentroid({
        selectedGeoJsonHike,
    });

    useEffect(
        () => handleHikeIdSelection(),

        [location.pathname]
    );

    const handleHikeIdSelection = () => {
        const selectedHikeId = +location.pathname.split("/")[2];

        dispatch(setSidebarState(true));

        dispatch(hikeAsync(selectedHikeId));
    };

    useEffect(() => {
        if (selectedHike) {
            console.log("user is logged in and selectedHike is defined");
            dispatch(gpxAsync(selectedHike.gpx_url));
        }
    }, [dispatch, selectedHike]);

    useEffect(
        () => calculateAndDispatchCentroid(),
        [calculateAndDispatchCentroid, selectedGeoJsonHike]
    );

    const handleBack = () => {
        if (selectedLocationBoundingBox)
            redirectToSeletedViewport(mapRef, selectedLocationBoundingBox);

        const searchQuery = location.state?.searchQuery;

        dispatch(setSelectedGeoJsonHike(undefined));
        dispatch(setSelectedHike(undefined));

        navigate(`/${searchQuery ?? ""}`);
    };

    return (
        <>
            <div className="flex flex-col items-start max-w-full gap-4 p-2">
                {selectedHike && (
                    <>
                        <Button
                            size="xs"
                            variant={"ghost"}
                            className="flex gap-2 items-center"
                            onClick={handleBack}
                        >
                            <FaChevronLeft className="h-3 fill-slate-400" />
                            <span className="text-slate-400 text-sm">
                                Retour
                            </span>
                        </Button>

                        <HikeCarousel hikeImages={selectedHike.images} />

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-start">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="font-bold text-lg">
                                        {selectedHike?.title}
                                    </h1>

                                    <TooltipProvider>
                                        <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            frontUrl +
                                                                location.pathname +
                                                                location.search
                                                        )
                                                    }
                                                    className="flex-shrink-0"
                                                >
                                                    <UiIcon
                                                        icon={selectedIcon}
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Copier l'url de la randonnée
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <h2 className="text-md text-slate-400">
                                    {selectedHike?.municipality}
                                </h2>
                            </div>
                            <div
                                className="leading-6 text-slate-500 max-w-full"
                                dangerouslySetInnerHTML={{
                                    __html: selectedHike?.excerpt as string,
                                }}
                            ></div>

                            <div className="grid grid-cols-3 gap-2">
                                <HikePercs
                                    icon={icons.personHiking}
                                    title={`${
                                        selectedHike?.distance / 1000
                                    } km`}
                                    content="Distance"
                                />

                                <HikePercs
                                    icon={icons.clock}
                                    title={convertSecondsToHours(
                                        selectedHike?.duration
                                    )}
                                    content="Durée moyenne"
                                />

                                <HikePercs
                                    icon={
                                        icons[
                                            `dial${selectedHike?.difficulty}` as keyof typeof icons
                                        ]
                                    }
                                    title={
                                        HikeDifficultyTitle[
                                            selectedHike.difficulty as HikeDifficulty
                                        ]
                                    }
                                    content="Difficulté"
                                />

                                <HikePercs
                                    icon={icons.mountainHigh}
                                    title={selectedHike?.highest_point + " m"}
                                    content="Point le plus haut"
                                />

                                <HikePercs
                                    icon={icons.mountainLow}
                                    title={selectedHike?.lowest_point + " m"}
                                    content="Point le plus bas"
                                />

                                <HikePercs
                                    icon={icons.arrowUpRightDots}
                                    title={
                                        selectedHike?.positive_elevation + " m"
                                    }
                                    content="Élévation positive"
                                />
                            </div>

                            <div
                                className="leading-7 max-w-full"
                                dangerouslySetInnerHTML={{
                                    __html: selectedHike?.description as string,
                                }}
                            ></div>
                        </div>
                    </>
                )}

                {(!selectedHike) && (
                    <>
                        <Button
                            size="xs"
                            variant={"ghost"}
                            className="flex gap-2 items-center"
                            onClick={handleBack}
                        >
                            <FaChevronLeft className="h-3 fill-slate-400" />
                            <span className="text-slate-400 text-sm">
                                Retour
                            </span>
                        </Button>

                        <div className="flex items-start relative flex-col w-full">
                            <div className="flex flex-col items-start w-full gap-4 p-2">
                                <Skeleton className="h-[12rem] w-full" />

                                <div className="flex flex-col gap-1 items-start">
                                    <Skeleton className="w-[14rem] h-4" />
                                    <Skeleton className="w-10 h-4" />
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-full h-4" />
                                </div>

                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {Array.from({ length: 6 }, () => (
                                        <Skeleton className="h-20 w-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

function redirectToSeletedViewport(
    mapRef: React.RefObject<MapRef>,
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

function convertSecondsToHours(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

export default HikeDetails;
