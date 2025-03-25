import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import {
    hikePreviewsAsync,
    setHikeFilterComparaison,
    setHikeFilters,
} from "@/state/hike/hikeSlice";
import icons from "@/assets/icons/icons";
import UiIcon from "../atoms/UiIcon";
import { useState } from "react";
import HikeComparaisonFilter from "../organisms/HikeComparaisonFilter";
import { useNavigate } from "react-router-dom";

const HikeDistanceFilter = ({
    locationParams,
}: {
    locationParams: URLSearchParams;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const selectedLocation = useSelector(
        (state: RootState) => state.location.selectedLocation
    );
    const hikeFilters = useSelector(
        (state: RootState) => state.hike.hikeFilters
    );
    const hikeFilterComparaisons = useSelector(
        (state: RootState) => state.hike.hikeFilterComparaisons
    );

    const [distance, setDistance] = useState<number | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);

    const handleDistanceChange = async () => {
        if (!selectedLocation) return;
        if (!distance || !hikeFilterComparaisons?.distance) return;
        locationParams.set(
            "distance",
            `${hikeFilterComparaisons.distance}.${distance}`
        );

        setOpen(false);

        const filters = await dispatch(
            setHikeFilters({ ...hikeFilters, distance })
        );

        await dispatch(
            hikePreviewsAsync({
                location: selectedLocation,
                query: filters.payload,
                filterComparaisons: hikeFilterComparaisons,
            })
        );

        navigate({
            search: locationParams.toString(),
        });
    };

    const handleReset = async () => {
        if (!selectedLocation) return;

        locationParams.delete("distance");

        setDistance(undefined);
        setOpen(false);

        const query = dispatch(
            setHikeFilters({ ...hikeFilters, distance: undefined })
        );
        dispatch(
            setHikeFilterComparaison({
                ...hikeFilterComparaisons,
                distance: undefined,
            })
        );

        await dispatch(
            hikePreviewsAsync({
                location: selectedLocation,
                query: query.payload,
                filterComparaisons: hikeFilterComparaisons,
            })
        );

        navigate({
            search: locationParams.toString(),
        });
    };

    return (
        <>
            <DropdownMenu open={open} onOpenChange={() => setOpen(!open)}>
                <DropdownMenuTrigger className="outline-none" asChild>
                    <Button
                        variant="outline"
                        className={
                            hikeFilters.distance &&
                            hikeFilterComparaisons?.distance
                                ? "border-[#003A0A]"
                                : undefined
                        }
                        size={"sm"}
                    >
                        {hikeFilters.distance &&
                        hikeFilterComparaisons?.distance ? (
                            <>
                                <UiIcon icon={icons.personHiking} />
                                <div className="flex items-center gap-1 ml-2">
                                    <UiIcon
                                        icon={
                                            icons[
                                                hikeFilterComparaisons.distance
                                            ]
                                        }
                                        size="small"
                                    />
                                    <span className="font-bold">
                                        {hikeFilters.distance / 1000} km
                                    </span>
                                </div>
                            </>
                        ) : (
                            "Distance"
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <HikeComparaisonFilter
                        value="distance"
                        handleReset={handleReset}
                        handleValidation={handleDistanceChange}
                        inputValue={distance ? distance / 1000 : undefined}
                        setInputValue={(value: number) =>
                            setDistance(value * 1000)
                        }
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default HikeDistanceFilter;
