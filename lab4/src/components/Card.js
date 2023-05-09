import {
    Button,
    Heading,
    HStack,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {useNavigate} from 'react-router-dom';

const Card = ({title, description, imageSrc, id, result}) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        localStorage.setItem('quizId', id);
        navigate('/quiz', {state: {quizId: id}});
    };

    return (
        <VStack borderRadius={'xl'} background={'white'} align={'left'}>
            <Image src={imageSrc} borderRadius={'xl'} pb={2}/>
            <Heading color={'black'} fontSize={'lg'} px={4} py={1}>
                {title}
            </Heading>
            <Text color={'gray'} fontSize={'md'} px={4} pb={1}>
                {description}
            </Text>
            <HStack px={4} pb={3}>
                <Button onClick={handleButtonClick}>
                    <Text color={'black'} fontSize={'sm'} pr={3} pb={1}>
                        {'Try it out'}
                    </Text>
                    <FontAwesomeIcon icon={faArrowRight} size='1x' color={'black'}/>
                </Button>
                <Text color={'red'} fontSize={'sm'}>
                    {result}
                </Text>
            </HStack>
        </VStack>
    );
};

export default Card;
