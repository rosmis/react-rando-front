import { HikeDifficultyTitle, HikePreview } from "@/types/hikes";
import HikeIcon from "../molecules/HikeIcon";
import icons from "@/assets/icons/icons";

const HikeIcons = ({ hike }: { hike: HikePreview }) => {
    return (
        <div className="flex gap-4 w-full justify-between p-2 border-t border-t-slate-200">
            <HikeIcon icon={icons[`dial${hike.difficulty}`]}>
                {HikeDifficultyTitle[hike.difficulty]}
            </HikeIcon>

            <HikeIcon icon={icons.clock}>
                {convertSecondsToHours(hike.duration)}
            </HikeIcon>

            <HikeIcon icon={icons.mountainHigh}>
                {hike.highest_point} m
            </HikeIcon>
            <HikeIcon icon={icons.mountainLow}>{hike.lowest_point} m</HikeIcon>
        </div>
    );
};

function convertSecondsToHours(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

export default HikeIcons;
