import {useCallback} from 'react';

const useApi = () => {
    const AccessToken = "753188dfa478870eea509375a8921ef7e8a226c0e4d94789e93f3fc77b2bd703";
    const userRequestsURL = "https://late-glitter-4431.fly.dev/api/v54/users";

    const getUsers = async () => {
        const response = await fetch(userRequestsURL, {
            headers: {
                "X-Access-Token": AccessToken,
            },
        });

        return await response.json();
    };

    const createUser = async (data) => {
        const response = await fetch(userRequestsURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Access-Token": AccessToken,
            },
            body: JSON.stringify({data}),
        });

        return await response.json();
    };

    const deleteUser = async (userId) => {
        await fetch(`${userRequestsURL}/${userId}`, {
            method: "DELETE",
            headers: {
                "X-Access-Token": AccessToken,
            },
        });
    };

    const handleApiError = async (data, error) => {
        if (error.message.includes("Name has already been taken")) {
            await apiDeleteUser(data)
        }
    };

    const apiSignUp = useCallback(async (data) => {
        const postRequestBody = {
            name: data.firstName,
            surname: data.lastName,
        }
        const apiResponse = await createUser(postRequestBody);

        if (apiResponse.message && apiResponse.message.includes('Name has already been taken')) {
            await handleApiError(data, apiResponse);
            return await createUser(postRequestBody)
        } else {
            return apiResponse;
        }
    }, []);

    const apiDeleteUser = useCallback(async (data) => {
        const users = await getUsers();
        const user = users.find((user) => user.name === data.firstName && user.surname === data.lastName);

        if (user) {
            return await deleteUser(user.id);
        } else {
            return undefined
        }
    }, []);

    return {apiSignUp, apiDeleteUser};
};

export default useApi;
