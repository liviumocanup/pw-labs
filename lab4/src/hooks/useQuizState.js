import {useState, useEffect} from "react";
import useSubmitQuiz from "./useSubmitQuiz";
import useLocalStorage from "./useLocalStorage";

const useQuizState = (quizId, quiz) => {
    const [apiQuiz, setApiQuiz] = useState();
    const {fetchQuiz} = useSubmitQuiz();
    const [error, setError] = useState(false);
    const {submitAnswers} = useSubmitQuiz();

    const {
        answers, setAnswers,
        answerStatus, setAnswerStatus,
        storedUserAnswers,
        score, setScore,
        updateLocalStorageScore,
        saveUserAnswers,
    } = useLocalStorage(quizId);

    useEffect(() => {
        const fetchQuizData = async () => {
            const userId = JSON.parse(localStorage.getItem("loggedInUser"));
            const quizData = await fetchQuiz(quizId, userId);
            setApiQuiz(quizData);
        };

        fetchQuizData();
    }, [quizId]);

    const handleSubmit = async () => {
        if (Object.keys(answers).length === quiz.questions.length) {
            quiz.questions.map(
                (question) =>
                    (question.id = apiQuiz.questions.find(
                        (apiQ) => apiQ.question === question.question
                    ).id)
            );

            const formattedAnswers = quiz.questions.map((q) => ({
                question_id: q.id,
                answer: answers[q.question],
                user_id: JSON.parse(localStorage.getItem("loggedInUser")).id,
            }));

            const answerPromises = formattedAnswers.map((formattedAnswer) =>
                submitAnswers(quizId, formattedAnswer)
            );
            const answerResponses = await Promise.all(answerPromises);

            const newAnswerStatus = {};
            answerResponses.forEach((response, index) => {
                newAnswerStatus[quiz.questions[index].question] = response;
            });
            setAnswerStatus(newAnswerStatus);

            const correctAnswers = answerResponses.filter((response) => response.correct).length;
            setScore(correctAnswers);
            const userId = JSON.parse(localStorage.getItem("loggedInUser")).id;
            updateLocalStorageScore(userId, quizId, correctAnswers);
            saveUserAnswers(userId, quizId, answers, newAnswerStatus);
        } else {
            setError(true);
        }
    };

    const handleAnswerChange = (question, answer) => {
        setAnswers((prevAnswers) => ({...prevAnswers, [question]: answer}));
        setError(false);
    };

    return {
        apiQuiz,
        answers,
        error,
        answerStatus,
        score,
        storedUserAnswers,
        handleAnswerChange,
        handleSubmit,
    };
};

export default useQuizState;
