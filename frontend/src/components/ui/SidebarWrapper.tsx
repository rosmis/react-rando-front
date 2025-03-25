const SidebarWrapper = ({ ...props }) => {
    return (
        <div
            className="flex relative flex-col w-full gap-6 px-3 
            h-full rounded-md max-h-screen overflow-y-scroll"
        >
            {props.children}
        </div>
    );
};

export default SidebarWrapper;
