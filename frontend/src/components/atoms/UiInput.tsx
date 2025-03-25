import React from "react";
import { styled } from "styled-components";

const StyledInput = styled.div`
    padding: 0.3em 1em;
    border-radius: 6px;
    min-width: 350px;
    background-color: #f3f4f6;
    color: #4b5563;
`;

interface UiInputProps {
    icon?: React.ReactNode;
    placeholder?: string;
    handleInput: (value: string) => void;
    iconRight?: React.ReactNode;
    searchTerm?: string;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const UiInput = ({
    icon = <></>,
    placeholder = "Recherchez un lieu...",
    handleInput,
    iconRight = <></>,
    searchTerm = "",
    handleKeyUp,
}: UiInputProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInput(e.target.value);
    };

    const handleResetInput = () => {
        handleInput("");
    };

    const isMac = window.navigator.userAgent.includes("Mac");
    const shortcut = isMac ? "⌘K" : "Ctrl+K";

    // Toggle the searchbar when ⌘/ctrk + K is pressed
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey) && inputRef.current) {
                e.preventDefault();
                inputRef.current.focus();
            }

            if (e.key === "Escape" && inputRef.current) {
                inputRef.current.blur();

                return handleKeyUp(
                    e as unknown as React.KeyboardEvent<HTMLInputElement>
                );
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <StyledInput className="flex items-center bg-slate-200 gap-4">
                {icon}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className="outline-none w-full h-5 bg-transparent placeholder-slate-400 leading-4"
                    onChange={handleInputChange}
                    value={searchTerm}
                    onKeyUpCapture={handleKeyUp}
                />

                <span
                    className="transition-all cursor-pointer"
                    onClick={handleResetInput}
                >
                    {iconRight}
                </span>

                {!searchTerm && (
                    <span className="items-center hidden md:flex gap-[2px] text-sm font-normal text-[#4b5563]">
                        {shortcut}
                    </span>
                )}
            </StyledInput>
        </>
    );
};

export default UiInput;
