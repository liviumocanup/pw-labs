import React from "react";
import FullScreenSection from "./FullScreenSection";
import SignUp from "./SignUp";
import LoggedIn from "./LoggedIn";
import LogIn from "./LogIn";
import {useUserContext} from "../context/UserContext";
import ProjectsSection from "./ProjectsSection";

const Authenticator = (props) => {
    const {isLoggedIn} = useUserContext();

    return (
        <>
           <FullScreenSection>
               "Yes"
           </FullScreenSection>
        </>
    );
};

export default Authenticator;
