import {Box, Button, ChakraProvider, Link, Switch} from "@chakra-ui/react";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";
import {AlertProvider} from "./context/alertContext";
import Alert from "./components/Alert";
import Authenticator from "./components/Authenticator";
import React, {useState} from "react";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import LoggedIn from "./components/LoggedIn";
import LogIn from "./components/LogIn";
import {UserProvider} from "./context/UserContext";

function App() {

    return (
        <ChakraProvider>
            <AlertProvider>
                <UserProvider>
                    <main>
                        <Box minHeight="100vh" display="flex" flexDirection="column">
                            <Header />
                            <Box flex="1">
                                <Routes>
                                    <Route path="/signUp" element={<Authenticator page={"sign"} />} />
                                    <Route path="/logIn" element={<Authenticator page={"log"} />} />
                                    <Route path="/account" element={<Authenticator page={"account"}/>} />
                                    <Route path="/" element={<Authenticator page={"home"}/>} />
                                </Routes>
                            </Box>
                            <Footer />
                        </Box>
                        <Alert/>
                    </main>
                </UserProvider>
            </AlertProvider>
        </ChakraProvider>
    );
}

export default App;
