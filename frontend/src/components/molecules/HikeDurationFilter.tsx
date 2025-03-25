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

const HikeDurationFilter = ({
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

    const [duration, setDuration] = useState<number | undefined>(
        hikeFilters.duration ?? undefined
    );
    const [open, setOpen] = useState<boolean>(false);

    const handleDurationChange = async () => {
        if (!selectedLocation) return;
        if (!duration || !hikeFilterComparaisons?.duration) return;
        locationParams.set(
            "duration",
            `${hikeFilterComparaisons.duration}.${duration}`
        );

        setOpen(false);

        const filters = await dispatch(
            setHikeFilters({ ...hikeFilters, duration })
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
        locationParams.delete("duration");

        setDuration(undefined);

        const query = dispatch(
            setHikeFilters({ ...hikeFilters, duration: undefined })
        );
        dispatch(
            setHikeFilterComparaison({
                ...hikeFilterComparaisons,
                distance: undefined,
            })
        );
        setOpen(false);

        dispatch(
            hikePreviewsAsync({
                location: selectedLocation,
                query: query.payload,
                filterComparaisons: hikeFilterComparaisons,
            })
        );

        navigate({
            pathname: "/",
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
                            hikeFilters.duration &&
                            hikeFilterComparaisons?.duration
                                ? "border-[#003A0A]"
                                : undefined
                        }
                        size={"sm"}
                    >
                        {hikeFilters.duration &&
                        hikeFilterComparaisons?.duration ? (
                            <>
                                <UiIcon icon={icons.clock} />
                                <div className="flex items-center gap-1 ml-2">
                                    <UiIcon
                                        icon={
                                            icons[
                                                hikeFilterComparaisons.duration
                                            ]
                                        }
                                        size="small"
                                    />
                                    <span className="font-bold">
                                        {hikeFilters.duration / 3600} h
                                    </span>
                                </div>
                            </>
                        ) : (
                            "Durée"
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <HikeComparaisonFilter
                        value="duration"
                        handleReset={handleReset}
                        handleValidation={handleDurationChange}
                        inputValue={duration ? duration / 3600 : undefined}
                        setInputValue={(value: number) =>
                            setDuration(value * 3600)
                        }
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default HikeDurationFilter;
