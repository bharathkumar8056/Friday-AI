const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

const WEATHER_API_KEY = 'ea820eb4568d1f534c6adfc32f2cdc26';
const NEWS_API_KEY = '93a2a877cafc4d1591423a8cc6e8aacb';

function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.rate = 1;
    textSpeak.volume = 1;
    textSpeak.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoiceNames = ['Google UK English Female', 'Google US English', 'Samantha'];
    const sweetVoice = voices.find(voice => preferredVoiceNames.includes(voice.name)) || voices.find(voice => voice.name.includes('female') || voice.gender === 'female') || voices[0];

    textSpeak.voice = sweetVoice;
    window.speechSynthesis.speak(textSpeak);
}

function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else if (hour > 20) {
        speak("Good Night Soldier");
    } else {
        speak("Good Evening Chief...");
    }
}

window.addEventListener('load', () => {
    window.speechSynthesis.onvoiceschanged = () => {
        speak("Initializing Friday...");
        wishMe();
    };
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    content.textContent = transcript;
    takeCommand(transcript);
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hello friday') || message.includes('hello')) {
        speak("Hello Sir, How Can I Help You?");
    } else if (message.includes("open google")) {
        openWebsite("https://google.com", "Opening Google...");
    } else if (message.includes("open youtube")) {
        openWebsite("https://youtube.com", "Opening YouTube...");
    } else if (message.includes("open facebook")) {
        openWebsite("https://facebook.com", "Opening Facebook...");
    } else if (message.includes("open instagram")) {
        openWebsite("https://instagram.com", "Opening Instagram...");
    } else if (message.includes('who created you') || message.includes('who is your boss') || message.includes('your boss name')) {
        speak("My Boss is Bharath Kumar. He is the one who created me.");
    } else if (message.includes('who is your favourite actor') || message.includes('friday who is your favourite actor')) {
        speak("My favourite actor is Thalapathy Vijay always.");
    } else if (message.includes('who is your friend') || message.includes('friday who is your best friend')) {
        speak("My best friend is vinoth kumar always.");
    } else if (message.includes('wish me') || message.includes('wish me friday')) {
        wishMe();
    } else if (message.includes('hey friday') || message.includes('hey')) {
        speak("Boss is this you? How's your mood now? Is everything ok?");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        searchGoogle(message);
    } else if (message.includes('wikipedia')) {
        searchWikipedia(message);
    } else if (message.includes('time') || message.includes('current time') || message.includes('what is time now')) {
        const time = new Date().toLocaleTimeString();
        speak(`The current time is ${time}`);
    } else if (message.includes('date') || message.includes('friday tell me today date') || message.includes('whats date today')) {
        const date = new Date().toLocaleDateString();
        speak(`Today's date is ${date}`);
    } else if (message.includes('calculator') || message.includes('friday open calculator') || message.includes('open calculator')) {
        openWebsite('Calculator:///', "Opening Calculator");
    } else if (message.includes('weather') ||message.includes('tell me the weather')) {
        fetchWeatherInformation(message);
    } else if (message.includes('news')) {
        fetchLatestNews();
    } else if (message.includes('friday play me a song') || message.includes('play a song')) {
        playMusic();
    } else if (message.includes('stop')) {
        window.speechSynthesis.cancel();
        speak("Stopping all activities.");
    } else {
        searchGoogle(message);
    }
}

function openWebsite(url, speakText) {
    window.open(url, "_blank");
    speak(speakText);
}

async function fetchWeatherInformation(message) {
    const location = message.split("weather in ")[1] || "Chennai"; // Default location
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    const weatherInfo = `The current weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp} degrees Celsius.`;
    speak(weatherInfo);
}

async function fetchLatestNews() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`);
    const data = await response.json();
    const articles = data.articles.slice(0, 5).map(article => article.title).join('. ');
    const news = `Here are the latest news headlines: ${articles}`;
    speak(news);
}

function playMusic() {
    const musicUrl = 'https://www.youtube.com/watch?v=3wDiqlTNlfQ'; // Thalapathy Vijay's Naa Ready song
    openWebsite(musicUrl, "Playing your favorite song.");
}

function searchGoogle(query) {
    const url = `https://www.google.com/search?q=${query.replace(" ", "+")}`;
    openWebsite(url, `I found some information for ${query} on Google`);
}

function searchWikipedia(query) {
    const url = `https://en.wikipedia.org/wiki/${query.replace("wikipedia", "").trim()}`;
    openWebsite(url, `This is what I found on Wikipedia regarding ${query}`);
}
