import React from "react";
import { MapRef } from "react-map-gl";

const MapRefContext = React.createContext<React.RefObject<MapRef> | null>(null);

export const MapRefProvider = MapRefContext.Provider;

export function useMapRef() {
    const context = React.useContext(MapRefContext);
    if (!context) {
        throw new Error("useMapRef must be used within a MapRefProvider");
    }
    return context;
}
