import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { hikePreviewsAsync, setHikeFilters } from "@/state/hike/hikeSlice";
import UiIcon from "../atoms/UiIcon";
import icons from "@/assets/icons/icons";
import { Slider } from "../ui/slider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HikeRadiusFilter = ({
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

    const [radius, setRadius] = useState<number>(50000);
    const [open, setOpen] = useState<boolean>(false);

    const handleRadiusChange = async () => {
        if (!selectedLocation) return;

        if (radius === 50000) {
            locationParams.delete("radius");
        } else {
            locationParams.set("radius", radius.toString());
        }

        setOpen(false);

        const filters = await dispatch(
            setHikeFilters({ ...hikeFilters, radius })
        );

        navigate({
            search: locationParams.toString(),
        });

        await dispatch(
            hikePreviewsAsync({
                location: selectedLocation,
                query: filters.payload,
                filterComparaisons: hikeFilterComparaisons,
            })
        );
    };

    return (
        <>
            <DropdownMenu open={open} onOpenChange={() => setOpen(!open)}>
                <DropdownMenuTrigger className="outline-none" asChild>
                    <Button
                        variant="outline"
                        className="border-[#003A0A]"
                        size={"sm"}
                    >
                        <UiIcon icon={icons.ruler} />
                        <span className="font-bold ml-2">
                            {hikeFilters.radius / 1000} km
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <div className="flex flex-col items-start p-4 gap-4">
                        <div className="flex w-full justify-end">
                            <p className="w-full text-left">
                                Rayon:{" "}
                                <span className="font-bold">
                                    {radius / 1000} km
                                </span>
                            </p>
                            <Button
                                variant="dark"
                                size={"xs"}
                                onClick={handleRadiusChange}
                            >
                                <UiIcon icon={icons.check} size="small" />
                            </Button>
                        </div>

                        <Slider
                            defaultValue={[50]}
                            max={200}
                            step={1}
                            onValueChange={(value: number[]) =>
                                setRadius(value[0] * 1000)
                            }
                            className="cursor-pointer"
                        />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default HikeRadiusFilter;
