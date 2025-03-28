import { Link } from "react-router-dom";
import SearchBar from "./Searchbar";

import logo from "@/assets/logo_green.png";

const Navbar = () => {
    return (
        <>
            <div className="bg-white z-10 px-10 flex justify-between items-center py-2 absolute top-0 left-0 right-0">
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-10" />
                </Link>
                <SearchBar />

            </div>
        </>
    );
};

export default Navbar;
