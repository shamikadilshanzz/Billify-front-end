import { Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

const ProtecedLayout = () => {
    const {isLoaded, isSignedIn, user} = useUser();
    if(!isLoaded){
        return null;
    }
    if(isLoaded && !isSignedIn){
        return <Navigate to='/sign-in'/>
    }
    console.log(user)
    return <Outlet/>
}

export default ProtecedLayout;