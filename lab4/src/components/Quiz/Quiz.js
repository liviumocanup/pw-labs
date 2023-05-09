import {
    Button,
    Center,
    Heading,
    VStack,
    Text,
    Spinner, Link,
} from "@chakra-ui/react";
import React from "react";
import FullScreenSection from "../FullScreenSection";
import {Link as RouterLink, useLocation} from "react-router-dom";
import {useQuizContext} from "../../context/QuizContext";
import Question from "./Question";
import useQuizState from "../../hooks/useQuizState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const Quiz = () => {
    const location = useLocation();
    const quizId = location.state
        ? location.state.quizId
        : JSON.parse(localStorage.getItem("quizId"));
    const quizArray = useQuizContext();
    const quiz = quizArray.find((quiz) => quiz.id === quizId);

    const {
        apiQuiz,
        answers,
        error,
        answerStatus,
        score,
        storedUserAnswers,
        handleAnswerChange,
        handleSubmit,
    } = useQuizState(quizId, quiz);


    if (!quiz || !apiQuiz) {
        return (
            <FullScreenSection
                isDarkBackground
                backgroundColor='cyan.500'
                py={16}
                spacing={8}
            >
                <Center mt={300}>
                    <Spinner size='xl' color='white'/>
                </Center>
            </FullScreenSection>
        );
    }

    return (
        <FullScreenSection
            isDarkBackground
            backgroundColor="cyan.500"
            py={16}
            spacing={8}
        >
            <Center mt={75}>
                <VStack spacing={6} w="100%" maxWidth="800px">
                    <Heading as="h1" size="2xl" textAlign="center" pb={50}>
                        {quiz.title}
                    </Heading>
                    {quiz.questions.map((q) => (
                        <Question
                            key={q.question}
                            question={q.question}
                            answers={q.answers}
                            onAnswerChange={(answer) =>
                                handleAnswerChange(q.question, answer)
                            }
                            selectedAnswer={answers[q.question] || storedUserAnswers[q.question]}
                            locked={q.question in answerStatus}
                            isCorrect={answerStatus[q.question]}
                        />
                    ))}
                    {score === null ? (
                        <Button colorScheme="blue" onClick={handleSubmit} mt={4}>
                            Submit
                        </Button>
                    ) : (
                        <>
                            <Text fontSize="xl" mt={4}>
                                Your score: {score}/{quiz.questions.length}
                            </Text>
                            <Link as={RouterLink} to="/">
                                <Button>
                                    <Text color={'black'} fontSize={'sm'} pr={2}>
                                        {'Home'}
                                    </Text>
                                    <FontAwesomeIcon icon={faHome} size='1x' color={'black'}/>
                                </Button>
                            </Link>
                        </>
                    )}
                    {error && (
                        <Text color="red.500" mt={2}>
                            Please answer all questions.
                        </Text>
                    )}
                </VStack>
            </Center>
        </FullScreenSection>
    );
};

export default Quiz;