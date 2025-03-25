import { useState } from "react";
import icons from "@/assets/icons/icons";

const useCopyToClipboard = () => {
    const [selectedIcon, setSelectedIcon] = useState(icons.copy);

    const copyToClipboard = (text: string) => {
        if (!navigator.clipboard) {
            console.error("Clipboard API not available");
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            console.log("Text copied to clipboard");
            setSelectedIcon(icons.checkSuccess);

            setTimeout(() => {
                setSelectedIcon(icons.copy);
            }, 500);
        });
    };

    return {
        selectedIcon,
        copyToClipboard,
    };
};

export default useCopyToClipboard;
