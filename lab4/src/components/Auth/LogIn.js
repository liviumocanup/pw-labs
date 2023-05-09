import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input, InputGroup, InputRightElement,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import * as Yup from 'yup';
import useSubmit from "../../hooks/useSubmit";
import {useAlertContext} from "../../context/alertContext";
import FullScreenSection from "../FullScreenSection";

const LogIn = () => {
    const {isLoading, response, submit} = useSubmit();
    const {onOpen} = useAlertContext();

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: values => {
            submit("logIn", values);
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
    });

    useEffect(() => {
        if (response && response.type !== "loading") {
            onOpen(response.type, response.message);
            if (response.type === 'success') {
                formik.resetForm();
            }
        }
    }, [response]);

    return (
        <FullScreenSection
            isDarkBackground
            backgroundColor="#512DA8"
            py={16}
            spacing={8}
        >
            <VStack w="1024px" p={32} alignItems="flex-start">
                <Heading as="h1" id="signup-section">
                    Log In
                </Heading>
                <Box p={6} rounded="md" w="100%">
                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isInvalid={formik.touched.username && formik.errors.username}>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input id="username"
                                       name="username"
                                       {...formik.getFieldProps('username')}
                                />
                                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.touched.password && formik.errors.password} pb={5}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        {...formik.getFieldProps('password')}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility} variant={"none"}>
                                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                            </FormControl>
                            <Button type="submit" colorScheme="purple" width="25%">
                                {isLoading ? <Spinner/> : "Submit"}
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </FullScreenSection>
    );
};

export default LogIn;
