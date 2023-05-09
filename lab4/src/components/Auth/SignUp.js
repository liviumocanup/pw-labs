import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading, HStack,
    Input, InputGroup, InputRightElement,
    Select, Spinner,
    VStack,
} from "@chakra-ui/react";
import * as Yup from 'yup';
import useSubmit from "../../hooks/useSubmit";
import {useAlertContext} from "../../context/alertContext";
import FullScreenSection from "../FullScreenSection";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

const SignUp = (props) => {
    const {isLoading, response, submit} = useSubmit();
    const {onOpen} = useAlertContext();

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            type: "",
        },
        onSubmit: values => {
            submit("signUp", values);
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            username: Yup.string()
                .min(4, 'Username must be at least 4 characters long')
                .matches(/^@/, 'Username must start with "@"')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/[0-9]/, 'Password requires a number')
                .matches(/[a-z]/, 'Password requires a lowercase letter')
                .matches(/[A-Z]/, 'Password requires an uppercase letter')
                .required('Required'),
            type: Yup.string().optional(),
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
                    {props.redirect ? "You need an account first:" : "Sign up"}
                </Heading>
                <Box p={6} rounded="md" w="100%">
                    <form onSubmit={formik.handleSubmit}>
                        <HStack spacing={20} mb={5}>
                            <FormControl isInvalid={formik.touched.firstName && formik.errors.firstName}>
                                <FormLabel htmlFor="firstName">First Name</FormLabel>
                                <Input id="firstName"
                                       name="firstName"
                                       {...formik.getFieldProps('firstName')}
                                />
                                <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.touched.lastName && formik.errors.lastName}>
                                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                <Input id="lastName"
                                       name="lastName"
                                       {...formik.getFieldProps('lastName')}
                                />
                                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <VStack spacing={4}>
                            <FormControl isInvalid={formik.touched.username && formik.errors.username}>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input id="username"
                                       name="username"
                                       {...formik.getFieldProps('username')}
                                />
                                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.touched.password && formik.errors.password}>
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
                            <FormControl pb={5}>
                                <FormLabel htmlFor="type">Type of quizzes</FormLabel>
                                <Select id="type" name="type">
                                    <option value="hireMe" style={{color: 'black'}}>
                                        All
                                    </option>
                                    <option value="openSource" style={{color: 'black'}}>
                                        Gaming
                                    </option>
                                    <option value="other" style={{color: 'black'}}>
                                        World
                                    </option>
                                    <option value="other" style={{color: 'black'}}>
                                        Art
                                    </option>
                                </Select>
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

export default SignUp;
