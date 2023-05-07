import {Heading, HStack, Image, Text, VStack} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({title, description, imageSrc}) => {
    // Implement the UI for the Card component according to the instructions.
    // You should be able to implement the component with the elements imported above.
    // Feel free to import other UI components from Chakra UI if you wish to.
    return (
        <VStack borderRadius={"xl"} background={"white"} align={"left"}>
            <Image src={imageSrc} borderRadius={"xl"} pb={2}/>
            <Heading color={"black"} fontSize={"lg"} px={4} py={1}>{title}</Heading>
            <Text color={"gray"} fontSize={"md"} px={4} pb={1}>{description}</Text>
            <HStack px={4} pb={3}>
                <Text color={"black"} fontSize={"sm"}>{"See more"}</Text>
                <FontAwesomeIcon icon={faArrowRight} size="1x" color={"black"}/>
            </HStack>
        </VStack>
    );
};

export default Card;
