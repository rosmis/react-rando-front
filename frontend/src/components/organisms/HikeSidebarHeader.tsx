import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import HikeDurationFilter from "../molecules/HikeDurationFilter";
import HikeDifficultyFilter from "../molecules/HikeDifficultyFilter";
import HikeDistanceFilter from "../molecules/HikeDistanceFilter";
import HikeRadiusFilter from "../molecules/HikeRadiusFilter";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import UiIcon from "../atoms/UiIcon";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

const HikesSidebarHeader = () => {
    const location = useLocation();
    const locationParams = new URLSearchParams(location.search);
    const frontUrl = import.meta.env.VITE_FRONT_URL;

    const searchedLocation = useSelector(
        (state: RootState) => state.location.searchedLocation
    );
    const hikesPreview = useSelector(
        (state: RootState) => state.hike.hikesPreview
    );
    const { copyToClipboard, selectedIcon } = useCopyToClipboard();

    return (
        <div className="flex flex-col gap-4 mt-4 items-start w-full">
            <div className="flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full">
                    <h1 className="max-w-[20rem] truncate text-xl font-bold">
                        {searchedLocation}
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
                                >
                                    <UiIcon icon={selectedIcon} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copier l'url de recherche</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-slate-500">
                    {hikesPreview?.total} randonnées trouvées
                </p>
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-sm text-slate-500">Filtrer par</p>

                <div className="flex items-center gap-2 w-full">
                    <HikeDurationFilter locationParams={locationParams} />
                    <HikeDifficultyFilter locationParams={locationParams} />
                    <HikeDistanceFilter locationParams={locationParams} />
                    <HikeRadiusFilter locationParams={locationParams} />
                </div>
            </div>
        </div>
    );
};

export default HikesSidebarHeader;
