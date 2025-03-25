type IconSize = "small" | "medium" | "large";

const sizeClasses: Record<IconSize, string> = {
    small: "h-3",
    medium: "h-5",
    large: "h-8",
};

interface UiIconProps {
    icon: string;
    size?: IconSize;
    spin?: boolean;
}

const UiIcon = ({ icon, size = "medium", spin }: UiIconProps) => {
    const sizeClass = sizeClasses[size];
    return (
        <>
            <img
                className={`${sizeClass}${spin ? " animate-spin" : ""}`}
                src={icon}
            />
        </>
    );
};

export default UiIcon;
