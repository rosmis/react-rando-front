import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import UiIcon from "./UiIcon";
import icons from "@/assets/icons/icons";
import { ResultLocation } from "@/state/location/locationSlice";

const StyledResult = styled.div<BorderProps>`
    width: 350px;
    background-color: #f3f4f6;
    cursor: pointer;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: #e5e7eb;
    }
`;

interface BorderProps {
    roundedbottom?: string;
}

interface UiResultProps extends BorderProps {
    location: ResultLocation;
    handleSelectedLocation: (location: ResultLocation) => void;
    isSelected?: boolean;
}

const UiResult = ({
    location,
    handleSelectedLocation,
    isSelected = false,
    ...props
}: UiResultProps) => {
    const handleSelection = () => {
        handleSelectedLocation(location);
    };

    const params = new URLSearchParams();
    params.set("search", location.name);
    params.set("latitude", location.centerCoordinates[1].toString());
    params.set("longitude", location.centerCoordinates[0].toString());

    return (
        <StyledResult {...props}>
            <Link
                to={{
                    pathname: "/",
                    search: params.toString(),
                }}
                className={`flex items-center justify-start gap-2 px-4 py-2 ${
                    isSelected ? "bg-[#e5e7eb]" : ""
                }`}
                onClick={handleSelection}
            >
                <FaChevronRight className="text-[#4b5563] w-fit shrink-0" />
                <div className="flex flex-col items-start flex-1 max-w-[16.5rem]">
                    <p className="font-bold text-[#4b5563] max-w-[16.5rem] truncate">
                        {location.name}
                    </p>
                    <p className="text-sm text-[#4b5563] max-w-[16.5rem] truncate">
                        {location.location}
                    </p>
                </div>
                {isSelected && (
                    <UiIcon icon={icons.arrowTurnDownLeft} size="small" />
                )}
            </Link>
        </StyledResult>
    );
};

export default UiResult;
