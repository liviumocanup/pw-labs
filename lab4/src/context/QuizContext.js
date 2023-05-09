import {createContext, useContext, useState, useEffect} from 'react';
import useQuizzesApi from '../hooks/useQuizzesApi';
import quizData from "../data/quizData";

const QuizContext = createContext(undefined);

export const useQuizContext = () => {
    return useContext(QuizContext);
};

export const QuizProvider = ({children}) => {
    const {getQuizId, isLoading} = useQuizzesApi();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizIds = async () => {
            if (!isLoading) {
                const newQuizArray = [];

                for (const quiz of quizData) {
                    const quizId = await getQuizId(quiz);
                    newQuizArray.push({...quiz, id: quizId});
                }

                setQuizzes(newQuizArray);
            }
        };

        fetchQuizIds();
    }, [isLoading]);

    return <QuizContext.Provider value={quizzes}>{children}</QuizContext.Provider>;
};
