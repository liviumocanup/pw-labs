import {Box, ChakraProvider} from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {AlertProvider} from "./context/alertContext";
import Alert from "./components/Alert";
import Authenticator from "./components/Auth/Authenticator";
import React, {useEffect, useMemo} from "react";
import {Route, Routes} from "react-router-dom";
import {UserProvider} from "./context/UserContext";
import {QuizProvider} from "./context/QuizContext";
import backgroundMusic from './music/claire.mp3';
import AudioContext from "./context/AudioContext";

function App() {
    const audio = useMemo(() => new Audio(backgroundMusic), []);
    audio.loop = true;

    useEffect(() => {
        audio.play();
    }, [audio]);

    return (
        <ChakraProvider>
            <AlertProvider>
                <UserProvider>
                    <QuizProvider>
                        <AudioContext.Provider value={audio}>
                            <main>
                                <Box minHeight="100vh" display="flex" flexDirection="column">
                                    <Header/>
                                    <Box flex="1">
                                        <Routes>
                                            <Route path="/signUp" element={<Authenticator page={"sign"}/>}/>
                                            <Route path="/logIn" element={<Authenticator page={"log"}/>}/>
                                            <Route path="/account" element={<Authenticator page={"account"}/>}/>
                                            <Route path="/quiz" element={<Authenticator page={"quiz"}/>}/>
                                            <Route path="/" element={<Authenticator page={"home"}/>}/>
                                        </Routes>
                                    </Box>
                                    <Footer/>
                                </Box>
                                <Alert/>
                            </main>
                        </AudioContext.Provider>
                    </QuizProvider>
                </UserProvider>
            </AlertProvider>
        </ChakraProvider>
    );
}

export default App;
