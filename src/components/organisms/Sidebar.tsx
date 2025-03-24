import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const isSidebarOpened = useSelector(
        (state: RootState) => state.sidebar.isOpen
    );
    // const hikesPreview = useSelector(
    //     (state: RootState) => state.hike.hikesPreview
    // );
    // const isHikesPreviewFetching = useSelector(
    //     (state: RootState) => state.hike.isHikesPreviewLoading
    // );
    // const selectedLocation = useSelector(
    //     (state: RootState) => state.location.selectedLocation
    // );

    // const match = useMatch("/");

    // const searchedHikesPreview = useMemo(() => {
    //     if (isHikesPreviewFetching) {
    //         return Array.from({ length: 3 }, (_, i) => {
    //             return <HikeCard key={i} isLoading />;
    //         });
    //     }

    //     if (!hikesPreview) return;
    //     if (hikesPreview.data.length === 0)
    //         return (
    //             <p className="text-center text-slate-500">
    //                 Aucune randonnée trouvée
    //             </p>
    //         );

    //     return (
    //         <>
    //             {...hikesPreview.data.map((hike) => {
    //                 return <HikeCard key={hike.id} hike={hike} />;
    //             })}
    //         </>
    //     );
    // }, [hikesPreview, isHikesPreviewFetching]);

    return (
        <>
            <aside
                className={`pt-14 min-w-[27rem] w-[27rem] bg-white transition-all duration-300 h-screen ${
                    isSidebarOpened ? "mr-0" : "-mr-[27rem]"
                }`}
            >
                {/* <SidebarWrapper>
                    {match &&
                        (selectedLocation ? (
                            <>
                                <HikesSidebarHeader />

                                {searchedHikesPreview}

                                <HikePagination
                                    total={hikesPreview?.total}
                                    selectedLocation={selectedLocation}
                                />
                            </>
                        ) : (
                            <HikeSidebarFallback />
                        ))}

                    <Outlet />
                </SidebarWrapper> */}
            </aside>
        </>
    );
};

export default Sidebar;
