import UiIcon from "../atoms/UiIcon";

const HikePercs = ({
    icon,
    title,
    content,
}: {
    icon: string;
    title: string;
    content?: string;
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-md gap-2 bg-slate-100">
            <div className="flex items-center gap-2">
                <UiIcon icon={icon} />
                <h3 className="font-bold whitespace-nowrap">{title}</h3>
            </div>

            {content && <p className="text-center whitespace-nowrap text-sm text-slate-400">{content}</p>}
        </div>
    );
};

export default HikePercs;
