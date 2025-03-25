import React, { useEffect, useMemo, useState } from "react";
import SearchInput from "../molecules/SearchInput";
import debounce from "lodash.debounce";
import UiResult from "../atoms/UiResult";
import { FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
    ResultLocation,
    locationsAsync,
    setLocations,
    setSearchedLocation,
    setSelectedLocation,
} from "../../state/location/locationSlice";
import { ZoomLevels } from "@/types/zoomLevels";
import { useNavigate } from "react-router";

const SearchBar = () => {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const searchedLocation = useSelector(
        (state: RootState) => state.location.searchedLocation
    );
    const locations = useSelector(
        (state: RootState) => state.location.locations
    );

    useEffect(() => {
        // reset selected index when locations change
        setSelectedIndex(-1);
    }, [locations]);

    const handleInputChange = (newSearchTerm: string) => {
        dispatch(setSearchedLocation(newSearchTerm));

        debounceSearch(newSearchTerm);
    };

    const handleKeyUp = (event: React.KeyboardEvent) => {
        if (!locations.length) return;

        const params = new URLSearchParams();

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setSelectedIndex((prevIndex) =>
                    prevIndex < locations.length - 1 ? prevIndex + 1 : prevIndex
                );
                break;
            case "ArrowUp":
                event.preventDefault();
                setSelectedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : prevIndex
                );
                break;
            case "Escape":
                dispatch(setLocations([]));
                dispatch(setSearchedLocation(""));
                setSelectedIndex(-1);
                break;
            case "Enter":
                params.set("search", searchedLocation);
                params.set(
                    "latitude",
                    locations[selectedIndex].centerCoordinates[1].toString()
                );
                params.set(
                    "longitude",
                    locations[selectedIndex].centerCoordinates[0].toString()
                );

                handleLocationSelection(locations[selectedIndex], -1);
                navigate({
                    pathname: "/",
                    search: params.toString(),
                });
                break;
            default:
                break;
        }
    };
    const handleLocationSelection = (
        location: ResultLocation,
        index: number
    ) => {
        setSelectedIndex(index);

        dispatch(
            setSearchedLocation(location.name.concat(", ", location.location))
        );
        dispatch(
            setSelectedLocation({
                coordinates: location.centerCoordinates,
                bbox: location.bbox,
                placeType: location.placeType as keyof typeof ZoomLevels,
            })
        );

        dispatch(setLocations([]));
    };

    const debounceSearch = useMemo(() => {
        return debounce(async (newSearchTerm: string) => {
            if (!newSearchTerm) return;

            dispatch(locationsAsync({ location: newSearchTerm }));
        }, 300);
    }, []);

    useEffect(() => debounceSearch.cancel(), [debounceSearch]);

    return (
        <div className="flex flex-col absolute left-1/2 -translate-x-1/2 items-start">
            <SearchInput
                handleInput={handleInputChange}
                iconRight={
                    searchedLocation ? <FaX className="text-xs" /> : <></>
                }
                searchTerm={searchedLocation}
                handleKeyUp={handleKeyUp}
            />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col max-h-[350px] overflow-y-scroll">
                {!!searchedLocation &&
                    locations.map((location, i) => {
                        return (
                            // couldn't pass rounded prop boolean to styled-components, weird behavior
                            <UiResult
                                key={i}
                                location={location}
                                handleSelectedLocation={() =>
                                    handleLocationSelection(location, i)
                                }
                                isSelected={selectedIndex === i}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default SearchBar;
