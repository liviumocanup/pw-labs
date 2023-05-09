const quizData = [
    {
        title: "AI and Robotics",
        description:
            "AI paired with Robots 🤖 can now revolutionize industries," +
            " as well as raise concerns about their impact on employment and privacy. " +
            "Pass this quiz and see whether you know your future neighbour 👀 well enough.",
        getImageSrc: () => require("../images/ai.jpg"),
        questions: [
            {
                question: "What is the name of the humanoid robot that competed in the 2020 Olympic torch relay in Tokyo?",
                answers: ["Miraitowa", "Pepper", "Senshi", "T-HR3"],
                correct_answer: "Miraitowa"
            },
            {
                question: "What is the name of the AI algorithm used to train self-driving cars?",
                answers: ["Deep Blue", "AlphaGo", "Waymo", "TensorFlow"],
                correct_answer: "TensorFlow"
            },
            {
                question: "What is the name of the computer program that defeated the world chess champion in 1997?",
                answers: ["Deep Blue", "Watson", "AlphaGo", "Siri"],
                correct_answer: "Deep Blue"
            },
            {
                question: "Which of the following programming languages is commonly used for programming robots?",
                answers: ["Python", "JavaScript", "C++", "Assembly"],
                correct_answer: "C++"
            }
        ]
    },
    {
        title: "Gaming",
        description:
            "Get your thumbs ready and immerse yourself in a world of adventure," +
            " challenge and excitement with the ultimate 🎮 entertainment. " +
            "Can you level up and conquer the competition or will you be left in the digital dust?🔥️",
        getImageSrc: () => require("../images/gaming.png"),
        questions: [
            {
                question: "In the game 'Minecraft', which of the following materials cannot be used to create a pickaxe?",
                answers: ["Iron", "Gold", "Diamond", "Obsidian"],
                correct_answer: "Obsidian"
            },
            {
                question: "Which of the following characters is not a playable character in the original 'Super Smash Bros.' game for Nintendo 64?",
                answers: ["Kirby", "Pikachu", "Captain Falcon", "Bowser"],
                correct_answer: "Bowser"
            },
            {
                question: "Which of the following games was not developed by the studio 'Naughty Dog'?",
                answers: ["Uncharted 2: Among Thieves", "The Last of Us", "Hellblade: Senua's Sacrifice", "Jak and Daxter: The Precursor Legacy"],
                correct_answer: "Hellblade: Senua's Sacrifice"
            },
            {
                question: "What is the name of the town where the player character lives in 'Animal Crossing: New Horizons'?",
                answers: ["Pelican Bay", "Sunshine Island", "Stardew Valley", "New Horizons Island"],
                correct_answer: "New Horizons Island"
            },
            {
                question: "What is the name of the sign that allows Geralt of Rivia to absorb incoming energy in 'The Witcher 3: Wild Hunt'?",
                answers: ["Aard", "Igni", "Quen", "Axii", "Yrden"],
                correct_answer: "Quen"
            },
            {
                question: "In 'Red Dead Redemption 2', what was Dutch's recurring desire that he frequently mentioned throughout the game?",
                answers: ["To retire in a peaceful village in the mountains", "To start a new life in Australia", "To escape to a tropical paradise in Tahiti", "To become a wealthy landowner in the American West"],
                correct_answer: "To escape to a tropical paradise in Tahiti"
            }
        ]
    },
    {
        title: "World",
        description:
            "Strap in and get ready to test your knowledge 🧠 on everything " +
            "from famous landmarks to global cultures and maybe even " +
            "learn a thing or two about our fascinating 🌍 along the way.",
        getImageSrc: () => require("../images/world.jpg"),
        questions: [
            {
                question: "Where is the most perfect heart-shaped island located?",
                answers: ["Croatia", "Italy", "Japan", "Thailand"],
                correct_answer: "Croatia"
            },
            {
                question: "Which bird is the only one that can fly backwards?",
                answers: ["Sparrow", "Pigeon", "Hummingbird", "Seagull"],
                correct_answer: "Hummingbird"
            },
            {
                question: "What is the color of polar bear skin?",
                answers: ["White", "Black", "Pink"],
                correct_answer: "Black"
            },
            {
                question: "Which of the following are man-made structures NOT visible from space with the naked eye?",
                answers: ["The Great Pyramids of Giza", "The Great Wall of China", "The Kennedy Space Centre", "The city of Las Vegas"],
                correct_answer: "The city of Las Vegas"
            },
            {
                question: "Which country has the highest life expectancy in the world?",
                answers: ["Japan", "Switzerland", "Australia", "Norway"],
                correct_answer: "Japan"
            }
        ]
    },
    {
        title: "Art",
        description:
            "Get ready to flex your creative 🎨 muscles and put your art knowledge to the test with our epic quiz. " +
            "From Renaissance masters to modern-day street artists, " +
            "we've got all the inspo you need to unleash your inner Picasso. 🖌️",
        getImageSrc: () => require("../images/art.jpg"),
        questions: [
            {
                question: "Who painted Mona Lisa?",
                answers: ["DaVinki", "NotDaVinki"],
                correct_answer: "DaVinki"
            }
        ]
    },
];

export default quizData;