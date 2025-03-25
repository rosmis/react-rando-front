import UiIcon from "../atoms/UiIcon";

interface HikeIconProps {
    icon: string;
    children?: React.ReactNode;
}

const HikeIcon = ({ icon, ...props }: HikeIconProps) => {
    return (
        <div className="flex items-center gap-1 p-1 rounded-md">
            <UiIcon icon={icon} />

            {props.children && (
                <span className="text-xs text-slate-500">{props.children}</span>
            )}
        </div>
    );
};

export default HikeIcon;
