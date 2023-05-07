import {useState} from "react";
import {useUserContext} from "../context/UserContext";
import useApi from "./useApi";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * This is a custom hook that can be used to submit a form and simulate an API call
 */
const useSubmit = () => {
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const { setLoggedIn, setName, setUsername } = useUserContext();
    const { apiSignUp } = useApi();

    const submit = async (type, data) => {
        setLoading(true);
        try {
            await wait(2000);
            if (type === 'signUp') {
                const users = JSON.parse(localStorage.getItem('users')) || [];

                // Check if the username is already taken
                if (users.some(user => user.username === data.username)) {
                    setResponse({
                        type: 'error',
                        message: 'Username is already taken.'
                    });
                    return;
                }

                const apiResponse = await apiSignUp(data);

                // Save the new user to localStorage
                data = {...data, name:`${data.firstName} ${data.lastName}`}
                users.push(data);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem("loggedInUser", JSON.stringify(data));

                setResponse({
                    type: 'success',
                    message: 'Account created successfully!'
                });

                setName(data.name);
                setUsername(data.username);
                setLoggedIn(true);

            } else if (type === 'logIn') {
                const users = JSON.parse(localStorage.getItem('users')) || [];

                // Find the user with the given username and password
                const user = users.find(
                    user => user.username === data.username && user.password === data.password
                );

                if (user) {
                    setResponse({
                        type: 'success',
                        message: 'Logged in successfully!'
                    });
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    setName(user.name);
                    setUsername(user.username);
                    setLoggedIn(true);
                } else {
                    setResponse({
                        type: 'error',
                        message: 'Invalid username or password.'
                    });
                }
            }
        } catch (error) {
            setResponse({
                type: 'error',
                message: 'Something went wrong, please try again later!',
            })
        } finally {
            setLoading(false);
        }
    };

    return {isLoading, response, submit, setResponse};
}

export default useSubmit;
