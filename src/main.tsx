import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Provider } from "react-redux";
import HikeDetails from "./components/organisms/HikeDetails.tsx";
import SignIn from "./routes/SignIn.tsx";
import Register from "./routes/Register.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "hike/:hikeId",
                element: <HikeDetails />,
            },
        ],
    },
    {
        path: "signin",
        element: <SignIn />,
    },
    {
        path: "register",
        element: <Register />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
