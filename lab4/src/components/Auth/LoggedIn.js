import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Heading, HStack, Icon, VStack} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {useUserContext} from "../../context/UserContext";
import FullScreenSection from "../FullScreenSection";
import useApi from "../../hooks/useApi";

const imageUrl = "https://ui-avatars.com/api/?name=";

const LoggedIn = () => {
    const {setLoggedIn, name, setName, username, setUsername} = useUserContext();
    const greeting = `Welcome, ${username}!`;
    const bio = "Enjoy your quizzes today.";
    const [img, setImg] = useState(null);
    const {apiSignUp, apiDeleteUser} = useApi();

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

    const resetQuizScores = (userId) => {
        const storedQuizScores = JSON.parse(localStorage.getItem("quizScore")) || {};
        delete storedQuizScores[userId];
        localStorage.setItem("quizScore", JSON.stringify(storedQuizScores));
    }

    const resetUserAnswers = (userId) => {
        const storedUserAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
        delete storedUserAnswers[userId];
        localStorage.setItem("userAnswers", JSON.stringify(storedUserAnswers));
    }

    const resetAccount = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const userId = loggedInUser.id;
        const apiResponse = await apiSignUp(loggedInUser)

        // Reset quiz scores for the user
        resetQuizScores(userId)

        // Reset user answers for the user
        resetUserAnswers(userId)

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.username !== loggedInUser.username);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        const data = {...loggedInUser, id: apiResponse.id}
        updatedUsers.push(data);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem("loggedInUser", JSON.stringify(data));
    }

    const localLogOut = () => {
        localStorage.removeItem("loggedInUser");
        setName(undefined);
        setUsername(undefined);
        setLoggedIn(false);
    }

    const deleteAccount = async () => {
        // Clear the loggedInUser in localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const userId = loggedInUser.id;
        localLogOut();

        // Remove quiz scores for the user
        resetQuizScores(userId)

        // Remove user answers for the user
        resetUserAnswers(userId)

        // Delete user from localStorage 'users'
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.filter(user => user.username !== loggedInUser.username);
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Delete user from the API
        const apiResponse = await apiDeleteUser(loggedInUser);
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
                <VStack textColor={"white"} mt={50}>
                    <Button onClick={localLogOut} colorScheme="purple" width={"63%"} mb={3}>
                        Log Out
                    </Button>
                    <HStack>
                        <Button onClick={resetAccount} colorScheme="red">
                            Reset Quizzes
                        </Button>
                        <Button onClick={deleteAccount} variant={"none"}>
                            <Icon as={DeleteIcon} boxSize={8} color="red"/>
                        </Button>
                    </HStack>

                </VStack>
            </Box>
        </FullScreenSection>
    );
};

export default LoggedIn;
