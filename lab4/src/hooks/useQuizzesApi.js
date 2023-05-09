import {useState, useEffect} from 'react';

const useQuizzesApi = () => {
    const AccessToken = 'ae1c3820976c4c31beb8f2dc8951d73dc46292787d9a2940502958dc44c07fed';
    const quizzesApiUrl = 'https://late-glitter-4431.fly.dev/api/v54/quizzes';

    const [quizIds, setQuizIds] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuizIds = async () => {
        setIsLoading(true);
        const response = await fetch(quizzesApiUrl, {
            headers: {
                'X-Access-Token': AccessToken,
            },
        });

        const quizzes = await response.json();
        const ids = quizzes.reduce((acc, quiz) => {
            acc[quiz.title] = quiz.id;
            return acc;
        }, {});

        setQuizIds(ids);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQuizIds();
    }, []);

    const createQuiz = async (quiz) => {
        const response = await fetch(quizzesApiUrl, {
            method: 'POST',
            headers: {
                'X-Access-Token': AccessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    title: quiz.title,
                    questions: quiz.questions.map((question) => ({
                        question: question.question,
                        answers: question.answers,
                        correct_answer: question.correct_answer,
                    })),
                },
            }),
        });

        const newQuiz = await response.json();
        return newQuiz.id;
    };

    const getQuizId = async (quiz) => {
        const id = quizIds[quiz.title];
        if (id === undefined && quiz) {
            return await createQuiz(quiz);
        }
        return id;
    };

    return {getQuizId, isLoading};
};

export default useQuizzesApi;
