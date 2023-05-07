import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {
    faGithub,
    faLinkedin,
    faMedium,
    faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import {Box, Button, HStack, Link, Text} from "@chakra-ui/react";
import {useUserContext} from '../context/UserContext';
import {Link as RouterLink} from 'react-router-dom';

const Header = () => {
    const {isLoggedIn, name} = useUserContext();

    const handleClick = (anchor) => {
        const id = `${anchor}-section`;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const prevScroll = useRef(0)
    const boxAppear = useRef("0")
    const boxRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            prevScroll.current > window.scrollY ? boxAppear.current = "0" : boxAppear.current = "-200px"
            prevScroll.current = window.scrollY;
            boxRef.current.style.transform = `translateY(${boxAppear.current})`;
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            translateY={0}
            transitionProperty="transform"
            transitionDuration=".3s"
            transitionTimingFunction="ease-in-out"
            backgroundColor="#18181b"
            ref={boxRef}
        >
            <Box color="white" maxWidth="1280px" margin="0 auto">
                <HStack
                    px={16}
                    py={4}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <nav>
                        <HStack spacing={8}>
                            <Link as={RouterLink} to="/">Home</Link>
                            {/*{isLoggedIn ?*/}
                            {/*    <a href={"#projects"} onClick={() => handleClick("projects")}>Featured Quizzes</a> :*/}
                            {/*    null*/}
                            {/*}*/}
                        </HStack>
                    </nav>
                    <nav>
                        <HStack spacing={8}>
                            {isLoggedIn ?
                                <Link as={RouterLink} to="/account">
                                    <Button colorScheme={"blue"} variant={"outline"}>
                                        Logged as {name}
                                    </Button>
                                </Link> :
                                <>
                                    <Link as={RouterLink} to="/signUp">Sign up</Link>
                                    <Link as={RouterLink} to="/logIn">
                                        <Button colorScheme={"white"} variant='outline'>
                                            Log In
                                        </Button>
                                    </Link>
                                </>
                            }
                            {/*<FontAwesomeIcon icon={social.icon} size="2x"/>*/}
                        </HStack>
                    </nav>
                </HStack>
            </Box>
        </Box>
    );
};
export default Header;
