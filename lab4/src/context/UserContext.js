// UserContext.js

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(undefined);

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState();
    const [username, setUsername] = useState();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (loggedInUser) {
            setName(loggedInUser.name);
            setUsername(loggedInUser.username);
            setLoggedIn(true);
        }
    }, []);

    return (
        <UserContext.Provider
            value={{ isLoggedIn, setLoggedIn, name, setName, username, setUsername }}
        >
            {children}
        </UserContext.Provider>
    );
};
