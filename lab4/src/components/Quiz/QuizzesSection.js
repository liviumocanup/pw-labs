import React from "react";
import FullScreenSection from "../FullScreenSection";
import {Box, Heading} from "@chakra-ui/react";
import Card from "../Card";
import {useQuizContext} from "../../context/QuizContext";
import sunset from "../../images/sunset.png"

const QuizzesSection = () => {
    const quizArray = useQuizContext();

    return (
        <FullScreenSection
            backgroundImage={sunset}
            isDarkBackground
            p={8}
            alignItems="flex-start"
            spacing={8}
            id="projects-section"
        >
            <Heading as="h1" mt={20} mb={5} color={"#C3B1E1"}
                     style={{
                         textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                     }}>
                Featured Quizzes
            </Heading>
            <Box
                display="grid"
                gridTemplateColumns="repeat(2,minmax(0,1fr))"
                gridGap={8}
            >
                {
                    quizArray.map((quiz) => {
                        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
                        const userId = loggedUser.id || null;
                        const storedQuizScores = JSON.parse(localStorage.getItem("quizScore")) || {};
                        const userScores = storedQuizScores[userId] || {};
                        const score = userScores[quiz.id] ?? null;

                        return (
                            <Card
                                key={quiz.id}
                                title={quiz.title}
                                description={quiz.description}
                                result={score !== null ?
                                    `Score: ${score}/${quiz.questions.length}` :
                                    `${quiz.questions.length} ${quiz.questions.length > 1 ? `Questions.` : `Question.`}`
                                }
                                imageSrc={quiz.getImageSrc()}
                                id={quiz.id}
                            />
                        )
                    })
                }
            </Box>
        </FullScreenSection>
    );
};

export default QuizzesSection;
