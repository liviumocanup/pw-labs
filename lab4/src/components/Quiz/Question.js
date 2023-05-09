import React from 'react';
import {Box, Heading, VStack, Radio, RadioGroup, FormControl, FormLabel, Text} from '@chakra-ui/react';

const Question = ({question, answers, onAnswerChange, selectedAnswer, locked, isCorrect}) => {
    const correct = isCorrect ? isCorrect.correct : undefined;
    const correctAnswer = isCorrect ? isCorrect.correct_answer : undefined;
    const handleAnswerChange = (value) => {
        if (!locked) {
            onAnswerChange(value);
        }
    };

    const getTextColor = (answer) => {
        if (locked) {
            if (answer === selectedAnswer) {
                return correct ? "green.500" : "red.500";
            }
            if (answer === correctAnswer) {
                return "green.500";
            }
        }
        return "black";
    };


    return (
        <Box w='100%' borderWidth={1} borderRadius='lg' p={4} boxShadow='md' background={"white"}>
            <Heading as='h2' size='md' mb={4} color={"black"}>
                {question}
            </Heading>
            <FormControl as='fieldset'>
                <FormLabel as='legend' srOnly>
                    {question}
                </FormLabel>
                <RadioGroup onChange={handleAnswerChange} value={selectedAnswer}>
                    <VStack alignItems='start' spacing={2}>
                        {answers.map((answer) => (
                            <Radio key={answer} value={answer} size='lg'>
                                <Text color={getTextColor(answer)}>
                                    {answer}
                                </Text>
                            </Radio>
                        ))}
                    </VStack>
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default Question;
