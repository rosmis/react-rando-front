import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import { hikePreviewsAsync } from "@/state/hike/hikeSlice";
import { Location } from "@/state/location/locationSlice";
import { AppDispatch, RootState } from "@/state/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const HikePagination = ({
    total,
    selectedLocation,
}: {
    total?: number;
    selectedLocation?: Location;
}) => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const hikeFilters = useSelector(
        (state: RootState) => state.hike.hikeFilters
    );

    const searchParams = new URLSearchParams(location.search);
    const currentPage = searchParams.get("page");

    const searchedParamsWithoutPage = useMemo(() => {
        const searchedParams = new URLSearchParams(location.search);
        searchedParams.delete("page");

        return searchedParams.toString();
    }, [location.search]);

    const totalPages = useMemo(() => {
        if (!total) return 1;

        return Math.ceil(total / 10);
    }, [total]);

    return total && total > 10 ? (
        <Pagination className="sticky p-2 bottom-0 bg-white left-0 right-0">
            <PaginationContent>
                <PaginationItem>
                    <Link
                        to={{
                            pathname: "/",
                            search:
                                searchedParamsWithoutPage +
                                `&page=${+currentPage! - 1}`,
                        }}
                        className={`
                                text-sm rounded-md gap-1 font-medium py-2 px-4 hover:bg-zinc-100 
                                transition-colors flex items-center hover:text-zinc-900 justify-center
                                ${
                                    +currentPage! === 1 || !currentPage
                                        ? "pointer-events-none text-slate-400"
                                        : ""
                                }
                            `}
                        onClick={() =>
                            dispatch(
                                hikePreviewsAsync({
                                    location: selectedLocation!,
                                    page: +currentPage! - 1,
                                    query: hikeFilters,
                                })
                            )
                        }
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Précédent</span>
                    </Link>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                    return (
                        <PaginationItem key={i}>
                            <Link
                                to={{
                                    pathname: "/",
                                    search:
                                        searchedParamsWithoutPage +
                                        `&page=${i + 1}`,
                                }}
                                className={`text-sm rounded-md w-10 h-10 hover:bg-zinc-100 transition-colors flex 
                                            items-center hover:text-zinc-900 justify-center 
                                            ${
                                                +currentPage! === i + 1
                                                    ? "border border-zinc-200"
                                                    : ""
                                            }`}
                                onClick={() =>
                                    dispatch(
                                        hikePreviewsAsync({
                                            location: selectedLocation!,
                                            page: i + 1,
                                            query: hikeFilters,
                                        })
                                    )
                                }
                            >
                                {i + 1}
                            </Link>
                        </PaginationItem>
                    );
                })}

                {/* TODO to the ellipsis component */}
                {/* <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem> */}

                <PaginationItem>
                    <Link
                        to={{
                            pathname: "/",
                            search:
                                searchedParamsWithoutPage +
                                `&page=${(currentPage ? +currentPage : 1) + 1}`,
                        }}
                        className={`
                                text-sm rounded-md gap-1 font-medium py-2 px-4 hover:bg-zinc-100 
                                transition-colors flex items-center hover:text-zinc-900 justify-center
                                ${
                                    +currentPage! === totalPages
                                        ? "pointer-events-none text-slate-400"
                                        : ""
                                }
                            `}
                        onClick={() =>
                            dispatch(
                                hikePreviewsAsync({
                                    location: selectedLocation!,
                                    page: (currentPage ? +currentPage : 1) + 1,
                                    query: hikeFilters,
                                })
                            )
                        }
                    >
                        <span>Suivant</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ) : null;
};

export default HikePagination;
