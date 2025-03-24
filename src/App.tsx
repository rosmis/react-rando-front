import { useDispatch } from "react-redux";
import AppLayout from "./routes/AppLayout";
import { AppDispatch } from "./state/store";
import { useEffect } from "react";
import { Location, useLocation } from "react-router-dom";
import { setLocationsAsyncWithUrlParams } from "./state/location/locationSlice";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const location: Location = useLocation();

    // useEffect(() => {
    //     dispatch(setLocationsAsyncWithUrlParams(location));

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <>
            <AppLayout />
        </>
    );
}

export default App;
