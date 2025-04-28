<?php

return [
    // Greetings
    'hello' => [
        'response' => 'Hi there! How can I assist you today? 🤖',
        'synonyms' => ['hi', 'hey', 'greetings', 'howdy', 'what\'s up'],
    ],
    'good morning' => [
        'response' => 'Good morning! I hope your day starts off great! ☀️',
        'synonyms' => ['morning', 'gm', 'rise and shine'],
    ],
    'good night' => [
        'response' => 'Good night! Sleep tight and sweet dreams. 🌙',
        'synonyms' => ['gn', 'sweet dreams', 'sleep well'],
    ],

    // Farewells
    'bye' => [
        'response' => 'Goodbye! Have a great day! 👋',
        'synonyms' => ['goodbye', 'see you', 'later', 'catch you later', 'farewell'],
    ],

    // Gratitude
    'thanks' => [
        'response' => 'You’re welcome! Let me know if there’s anything else I can do. 🙌',
        'synonyms' => ['thank you', 'appreciate it', 'thx', 'cheers'],
    ],
    'no problem' => [
        'response' => 'It’s no problem at all! I’m here to help. 😊',
        'synonyms' => ['np', 'you\'re welcome', 'glad to help'],
    ],

    // Inquiries
    'how are you' => [
        'response' => 'I’m just a bot, but I’m doing great! How about you? 🤖',
        'synonyms' => ['how\'s it going', 'what\'s up', 'how are you doing'],
    ],
    'what is your name' => [
        'response' => 'I am your friendly chatbot! What’s yours? 🧑‍💻',
        'synonyms' => ['who are you', 'your name', 'what do I call you'],
    ],
    'who created you' => [
        'response' => 'I was created by a team of talented developers! 🚀',
        'synonyms' => ['who made you', 'your creator', 'who built you'],
    ],
    'what can you do' => [
        'response' => 'I can assist with general inquiries, provide information, and chat with you! 🤓',
        'synonyms' => ['your abilities', 'what are your features', 'what do you do'],
    ],
    'help' => [
        'response' => 'Sure! Let me know what you need assistance with. 🛠️',
        'synonyms' => ['assist me', 'i need help', 'how to'],
    ],

    // Fun
    'joke' => [
        'response' => 'Why did the computer go to the doctor? It caught a virus! 😂',
        'synonyms' => ['funny', 'laugh', 'make me laugh', 'tell me a joke'],
    ],
    'quote' => [
        'response' => '“The best way to predict the future is to invent it.” – Alan Kay',
        'synonyms' => ['inspire me', 'motivation', 'quote of the day'],
    ],
    'motivation' => [
        'response' => 'Keep pushing forward! You’re doing amazing! 💪',
        'synonyms' => ['encourage me', 'keep me going', 'uplift me'],
    ],

    // Utility
    'weather' => [
        'response' => 'I’m not sure, but you can check your local weather app for details. ☀️🌧️',
        'synonyms' => ['forecast', 'temperature', 'is it sunny'],
    ],
    'news' => [
        'response' => 'Stay updated with the latest news on your favorite news platform! 📰',
        'synonyms' => ['headlines', 'current events', 'what\'s happening'],
    ],
    'time' => [
        'response' => 'I don’t have a clock, but your device does! 🕰️',
        'synonyms' => ['what time is it', 'current time', 'clock'],
    ],
    'date' => [
        'response' => 'Today’s date is ' . date('Y-m-d') . '. 📅',
        'synonyms' => ['what\'s the date', 'current date', 'today'],
    ],

    // Miscellaneous
    'where are you' => [
        'response' => 'I live in the cloud, ready to help anytime! ☁️',
        'synonyms' => ['your location', 'where do you exist', 'where are you from'],
    ],
    'tell me about yourself' => [
        'response' => 'I’m a chatbot designed to assist and chat with you! 😊',
        'synonyms' => ['about you', 'who are you', 'your purpose'],
    ],

    // Fallback
    'default' => [
        'response' => "I'm sorry, I didn't understand that. Can you try again? 🙃",
        'synonyms' => [],
    ],
];
