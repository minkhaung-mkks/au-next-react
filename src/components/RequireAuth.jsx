import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContextProvider";

export default function RequireAuth({ children }) {
    const { user } = useUser();
    const location = useLocation();

    if (!user?.isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
