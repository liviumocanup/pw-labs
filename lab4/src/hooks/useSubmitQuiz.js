import {useState} from 'react';

const useSubmitQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuiz = async (quizId, userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://late-glitter-4431.fly.dev/api/v54/quizzes/${quizId}`, {
                method: 'GET',
                headers: {
                    'X-Access-Token': 'ae1c3820976c4c31beb8f2dc8951d73dc46292787d9a2940502958dc44c07fed',
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
            const response = await fetch(`https://late-glitter-4431.fly.dev/api/v54/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: {
                    'X-Access-Token': 'ae1c3820976c4c31beb8f2dc8951d73dc46292787d9a2940502958dc44c07fed',
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
