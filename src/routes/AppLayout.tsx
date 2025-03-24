import Mapbox from "@/components/organisms/Mapbox";
import Sidebar from "@/components/organisms/Sidebar";
import { MapRefProvider } from "@/composables/useMapRef";
import React from "react";
import { MapRef } from "react-map-gl";

const AppLayout = () => {
    const mapRef = React.useRef<MapRef>(null);

    return (
        <>
            {/* <Navbar /> */}

            <div className="flex flex-col-reverse md:flex-row items-start">
                <MapRefProvider value={mapRef}>
                    <Sidebar />

                    <Mapbox />
                </MapRefProvider>
            </div>

            {/* <Modal /> */}
        </>
    );
};

export default AppLayout;
