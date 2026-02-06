import { useEffect, useState } from "react";
import { useUser } from "../../context/userContextProvider";
import { Navigate } from "react-router-dom";
import Login from "./Login";
export default function Logout() {
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useUser();
    async function onLogout() {
        await logout();
        setIsLoading(false);
    }
    useEffect(() => {
        onLogout();
    }, []);
    if (isLoading) {
        return (<><h3>Loging out...</h3></>);
    }
    else {
        return (<Navigate to={<Login />} replace />)
    }
}
