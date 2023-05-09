import React, {useContext, useEffect, useRef, useState} from "react";
import {Box, Button, HStack, Link} from "@chakra-ui/react";
import {useUserContext} from '../context/UserContext';
import {Link as RouterLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faVolumeUp, faVolumeDown} from '@fortawesome/free-solid-svg-icons';
import AudioContext from "../context/AudioContext";

const Header = () => {
    const audio = useContext(AudioContext);
    const {isLoggedIn, name} = useUserContext();
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
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
            zIndex={1000}
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
                        </HStack>
                    </nav>
                    <Box pl={40} pr={8}>
                        <nav>
                            <Button onClick={togglePlay} variant="ghost" colorScheme="white">
                                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay}/>
                            </Button>
                            <Button
                                onClick={() => {
                                    audio.volume = Math.max(audio.volume - 0.1, 0);
                                }}
                                variant="ghost"
                                colorScheme="white"
                            >
                                <FontAwesomeIcon icon={faVolumeDown}/>
                            </Button>
                            <Button
                                onClick={() => {
                                    audio.volume = Math.min(audio.volume + 0.1, 1);
                                }}
                                variant="ghost"
                                colorScheme="white"
                            >
                                <FontAwesomeIcon icon={faVolumeUp}/>
                            </Button>
                        </nav>
                    </Box>
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
                        </HStack>
                    </nav>
                </HStack>
            </Box>
        </Box>
    );
};
export default Header;
