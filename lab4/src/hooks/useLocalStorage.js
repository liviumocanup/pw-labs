import {useState, useEffect} from "react";

const useLocalStorage = (quizId) => {
    const [storedUserAnswers, setStoredUserAnswers] = useState({});
    const [answers, setAnswers] = useState({});
    const [answerStatus, setAnswerStatus] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("loggedInUser")).id;
        const storedUserAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
        const userAnswers = storedUserAnswers[userId] || {};
        const quizAnswers = userAnswers[quizId] || {};
        setStoredUserAnswers(quizAnswers.answers || {});
        setAnswers(quizAnswers.answers || {});
        setAnswerStatus(quizAnswers.lockedStatus || {});
        const storedQuizScores = JSON.parse(localStorage.getItem("quizScore")) || {};
        const userScores = storedQuizScores[userId] || {};
        const quizScore = userScores[quizId] ?? null;
        setScore(quizScore);
    }, [quizId]);


    const updateLocalStorageScore = (userId, quizId, score) => {
        const storedQuizScores = JSON.parse(localStorage.getItem("quizScore")) || {};
        if (!storedQuizScores[userId]) {
            storedQuizScores[userId] = {};
        }
        storedQuizScores[userId][quizId] = score;
        localStorage.setItem("quizScore", JSON.stringify(storedQuizScores));
    };


    const saveUserAnswers = (userId, quizId, answers, lockedStatus) => {
        const storedUserAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
        if (!storedUserAnswers[userId]) {
            storedUserAnswers[userId] = {};
        }
        storedUserAnswers[userId][quizId] = {answers, lockedStatus};
        localStorage.setItem("userAnswers", JSON.stringify(storedUserAnswers));
    };


    return {
        answers, setAnswers,
        answerStatus, setAnswerStatus,
        storedUserAnswers,
        score, setScore,
        updateLocalStorageScore,
        saveUserAnswers,
    };
};

export default useLocalStorage;
