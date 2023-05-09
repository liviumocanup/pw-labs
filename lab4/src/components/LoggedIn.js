import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Heading, VStack} from "@chakra-ui/react";
import {useUserContext} from "../context/UserContext";
import FullScreenSection from "./FullScreenSection";
const imageUrl = "https://ui-avatars.com/api/?name=";

const LoggedIn = () => {
    const {setLoggedIn, name, setName, username, setUsername} = useUserContext();
    const greeting = `Welcome, ${username}!`;
    const bio = "Enjoy your quizzes today.";
    const [img, setImg] = useState(null);

    const fetchImage = async () => {
        const userAvatarUrl = `${imageUrl}${name.replace(/ /g, "+")}`
        const res = await fetch(userAvatarUrl);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImg(imageObjectURL);
    };

    useEffect(() => {
        fetchImage();
    }, []);

    const logout = () => {
        // Clear the loggedInUser in localStorage
        localStorage.removeItem("loggedInUser");
        setName(undefined);
        setUsername(undefined);
        setLoggedIn(false);
    };

    return (
        <FullScreenSection
            isDarkBackground
            backgroundColor="#512DA8"
            py={16}
            spacing={8}
        >
            <Box mt={150}>
                <VStack textColor={"white"}>
                    <Avatar src={img} alt="Avatar" size={"2xl"}/>
                    <Heading>{greeting}</Heading>
                    <p>{bio}</p>
                </VStack>
                <VStack textColor={"white"} mt={100}>
                    <Button onClick={logout} colorScheme="purple" width="65%">
                        Log Out
                    </Button>
                </VStack>
            </Box>
        </FullScreenSection>
    );
};

export default LoggedIn;
