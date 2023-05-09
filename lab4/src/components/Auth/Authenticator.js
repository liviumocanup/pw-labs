import React from "react";
import SignUp from "./SignUp";
import LoggedIn from "./LoggedIn";
import LogIn from "./LogIn";
import {useUserContext} from "../../context/UserContext";
import QuizzesSection from "../Quiz/QuizzesSection";
import Quiz from "../Quiz/Quiz";

const Authenticator = (props) => {
    const {isLoggedIn} = useUserContext();

    const notLoggedInPage = () => {
        switch (props.page) {
            case 'sign':
                return <SignUp/>;
            case 'log':
                return <LogIn/>;
            case 'quiz':
                return <SignUp redirect={true}/>;
            default:
                return <QuizzesSection/>;
        }
    };

    const loggedInPage = () => {
        switch (props.page) {
            case 'account':
                return <LoggedIn/>;
            case 'quiz':
                return localStorage.getItem("quizId") ? <Quiz/> : <QuizzesSection/>;
            default:
                return <QuizzesSection/>;
        }
    };

    return isLoggedIn ? loggedInPage() : notLoggedInPage();
};

export default Authenticator;
