import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HikeDifficulty, HikeDifficultyTitle } from "@/types/hikes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { hikePreviewsAsync, setHikeFilters } from "@/state/hike/hikeSlice";
import UiIcon from "../atoms/UiIcon";
import icons from "@/assets/icons/icons";
import { useNavigate } from "react-router-dom";

const HikeDifficultyFilter = ({
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

    const handleDifficultyChange = async (difficulty?: HikeDifficulty) => {
        if (!selectedLocation) return;

        if (!difficulty) {
            locationParams.delete("difficulty");
        } else {
            locationParams.set("difficulty", difficulty);
        }

        const filters = await dispatch(
            setHikeFilters({ ...hikeFilters, difficulty })
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

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none" asChild>
                    <Button
                        variant="outline"
                        className={
                            hikeFilters.difficulty
                                ? "border-[#003A0A]"
                                : undefined
                        }
                        size={"sm"}
                    >
                        {hikeFilters.difficulty ? (
                            <>
                                <UiIcon
                                    icon={
                                        icons[`dial${hikeFilters.difficulty}`]
                                    }
                                />
                                <span className="font-bold ml-2">
                                    {
                                        HikeDifficultyTitle[
                                            hikeFilters.difficulty
                                        ]
                                    }
                                </span>
                            </>
                        ) : (
                            "Difficulté"
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                        onValueChange={(value: string) =>
                            handleDifficultyChange(
                                value === "none"
                                    ? undefined
                                    : (value as HikeDifficulty)
                            )
                        }
                    >
                        <DropdownMenuRadioItem
                            className="cursor-pointer"
                            // why does the value have to be a string ?
                            value="none"
                        >
                            Toutes difficultés
                        </DropdownMenuRadioItem>

                        {Object.values(HikeDifficulty).map((difficulty) => {
                            return (
                                <DropdownMenuRadioItem
                                    className="cursor-pointer"
                                    value={difficulty}
                                    key={difficulty}
                                >
                                    {HikeDifficultyTitle[difficulty]}
                                </DropdownMenuRadioItem>
                            );
                        })}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default HikeDifficultyFilter;
