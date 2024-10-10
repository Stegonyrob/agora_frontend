import { Outlet } from "react-router-dom";
import NavBar from "../assets/Components/NavBar/NavBar";

const PrivateLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};

export default PrivateLayout;