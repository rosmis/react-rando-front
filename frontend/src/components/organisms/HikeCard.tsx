import { HikePreview } from "@/types/hikes";
import HikeImageCarousel from "../molecules/HikeImageCarousel";
import HikeIcons from "./HikeIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { setHoveredPreviewHikeId } from "@/state/hike/hikeSlice";
import { Link, useLocation } from "react-router-dom";

const HikeCard = ({
    hike,
    isLoading,
}: {
    hike?: HikePreview;
    isLoading?: boolean;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    return (
        <Link
            to={`/hike/${hike?.id}`}
            state={{ searchQuery: location.search }}
            className="flex flex-col gap-2 h-full rounded-md bg-white
             w-full border cursor-pointer hover:bg-slate-50 transition-all border-slate-200"
            onMouseEnter={() => dispatch(setHoveredPreviewHikeId(hike?.id))}
            onMouseLeave={() => dispatch(setHoveredPreviewHikeId(undefined))}
        >
            {hike && !isLoading && (
                <>
                    <div className="flex flex-col gap-2 px-2 pt-2">
                        {hike.images.length && (
                            <HikeImageCarousel
                                backgroundImage={hike.images[0].image_url}
                            />
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-start">
                                <h2 className="max-w-[16.5rem] truncate font-bold">
                                    {hike.title}
                                </h2>
                                <h3 className="text-sm text-slate-500">
                                    {hike.municipality}
                                </h3>
                            </div>

                            <span className="font-bold whitespace-nowrap p-1 rounded-md">
                                {hike.distance / 1000} Km
                            </span>
                        </div>
                    </div>

                    <HikeIcons hike={hike} />
                </>
            )}

            {isLoading && (
                <div className="flex flex-col gap-4 p-2">
                    <Skeleton className="h-32 w-full" />

                    <div className="flex flex-col gap-1 items-start">
                        <Skeleton className="w-[14rem] h-4" />
                        <Skeleton className="w-10 h-4" />
                    </div>
                </div>
            )}
        </Link>
    );
};

export default HikeCard;
