import {useState} from 'react';

const useSubmitQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const AccessToken = '753188dfa478870eea509375a8921ef7e8a226c0e4d94789e93f3fc77b2bd703';
    const quizzesApiUrl = 'https://late-glitter-4431.fly.dev/api/v54/quizzes';

    const fetchQuiz = async (quizId, userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${quizzesApiUrl}/${quizId}`, {
                method: 'GET',
                headers: {
                    'X-Access-Token': AccessToken,
                    'Content-Type': 'application/json',
                },
                params: {
                    user_id: userId,
                },
            });

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            setError(err);
            setLoading(false);
            return null;
        }
    };

    const submitAnswers = async (quizId, answer) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${quizzesApiUrl}/${quizId}/submit`, {
                method: 'POST',
                headers: {
                    'X-Access-Token': AccessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: answer,
                }),
            });

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            setError(err);
            setLoading(false);
            return null;
        }
    };

    return {fetchQuiz, submitAnswers, loading, error};
};

export default useSubmitQuiz;
