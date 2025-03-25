import { FaSearch } from "react-icons/fa";
import UiInput from "../atoms/UiInput";
import { JSX } from "react";

interface SearchInputProps {
    handleInput: (e: string) => void;
    iconRight?: JSX.Element;
    searchTerm?: string;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = ({
    handleInput,
    iconRight = <></>,
    searchTerm = "",
    handleKeyUp,
}: SearchInputProps) => {
    return (
        <UiInput
            icon={<FaSearch className="text-[#4b5563]" />}
            handleInput={handleInput}
            iconRight={iconRight}
            searchTerm={searchTerm}
            handleKeyUp={handleKeyUp}
        />
    );
};

export default SearchInput;
