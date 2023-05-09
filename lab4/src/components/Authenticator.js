import React from "react";
import FullScreenSection from "./FullScreenSection";
import SignUp from "./SignUp";
import LoggedIn from "./LoggedIn";
import LogIn from "./LogIn";
import {useUserContext} from "../context/UserContext";
import Home from "./Home";
import ProjectsSection from "./ProjectsSection";

const Authenticator = (props) => {
    const {isLoggedIn} = useUserContext();

    const notLoggedInPage = () => {
        switch (props.page) {
            case 'sign':
                return <SignUp/>;
            case 'log':
                return <LogIn/>;
            default:
                return <ProjectsSection />;
        }
    };

    const loggedInPage = () => {
        switch (props.page) {
            case 'account':
                return <LoggedIn />;
            default:
                return <ProjectsSection />;
        }
    };

    return isLoggedIn ? loggedInPage() : notLoggedInPage();
};

export default Authenticator;
