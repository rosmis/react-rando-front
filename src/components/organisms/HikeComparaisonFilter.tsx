import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { HikeComparaison, HikeComparaisonFilters } from "@/types/hikes";
import { setHikeFilterComparaison } from "@/state/hike/hikeSlice";
import icons from "@/assets/icons/icons";
import UiIcon from "../atoms/UiIcon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";

interface HikeComparaisonFilterProps {
    value: keyof HikeComparaisonFilters;
    handleReset: () => void;
    handleValidation: () => void;
    inputValue?: number;
    setInputValue: (value: number) => void;
}

const HikeComparaisonFilter = ({
    value,
    handleReset,
    handleValidation,
    inputValue,
    setInputValue,
}: HikeComparaisonFilterProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const hikeFilterComparaisons = useSelector(
        (state: RootState) => state.hike.hikeFilterComparaisons
    );

    return (
        <div className="flex flex-col items-end gap-4 py-2 px-4">
            <div className="flex items-center gap-2">
                <Button size={"xs"} onClick={handleReset}>
                    <UiIcon icon={icons.reset} size="small" />
                </Button>
                <Button variant="dark" size={"xs"} onClick={handleValidation}>
                    <UiIcon icon={icons.check} size="small" />
                </Button>
            </div>
            <div className="flex items-center gap-4 ">
                <div className="flex items-center w-full gap-2">
                    {Object.values(HikeComparaison).map(
                        (comparaison, index) => {
                            return (
                                <Button
                                    variant={
                                        hikeFilterComparaisons?.[value] ===
                                        comparaison
                                            ? "outline"
                                            : undefined
                                    }
                                    className={
                                        hikeFilterComparaisons?.[value] ===
                                        comparaison
                                            ? "border-[#003A0A]"
                                            : undefined
                                    }
                                    key={index}
                                    size={"sm"}
                                    onClick={() =>
                                        dispatch(
                                            setHikeFilterComparaison({
                                                ...hikeFilterComparaisons,
                                                [value]: comparaison,
                                            })
                                        )
                                    }
                                >
                                    <UiIcon
                                        size="small"
                                        icon={icons[comparaison]}
                                    />
                                </Button>
                            );
                        }
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        value={inputValue ? inputValue : ""}
                        onChange={(value) => setInputValue(+value.target.value)}
                        min={0}
                        type="number"
                    />
                    <span className="font-bold text-sm">
                        {value === "distance" ? "km" : "h"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HikeComparaisonFilter;
