const apiKeyWeather = 'de57c56c30e148d4a4d60037242909'; // WeatherAPI key
const baseUrlWeather = 'https://api.weatherapi.com/v1/current.json';
const apiKeyNews = '99fbb8705c564ff8b9b9266bd65e72ae'; // NewsAPI key
const baseUrlNews = 'https://newsapi.org/v2/everything';

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
});

document.getElementById('fetch-weather-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city for the weather.');
    }
});

document.getElementById('fetch-news-btn').addEventListener('click', () => {
    const topic = document.getElementById('topic-input').value.trim();
    if (topic) {
        fetchNews(topic);
    } else {
        alert('Please enter a topic for the news.');
    }
});

async function fetchWeather(city) {
    const weatherContainer = document.getElementById('weather-container');
    const url = `${baseUrlWeather}?key=${apiKeyWeather}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherContainer.innerHTML = `<p>Error fetching weather: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');

    if (!data || !data.location || !data.current) {
        weatherContainer.innerHTML = `<p>Error: Invalid data received from the API.</p>`;
        return;
    }

    const temperature = data.current.temp_c;
    const weatherDescription = data.current.condition.text;
    const city = data.location.name;

    weatherContainer.innerHTML = `
        <h2>Current Weather in ${city}</h2>
        <p class="temperature">${temperature} °C</p>
        <p class="condition">${weatherDescription}</p>
    `;
}

async function fetchNews(topic) {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = '';

    const url = `${baseUrlNews}?q=${encodeURIComponent(topic)}&apiKey=${apiKeyNews}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const articles = data.articles || [];
        displayNews(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `<p>Error fetching news: ${error.message}</p>`;
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-articles');

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p>No news available for this topic.</p>';
        return;
    }

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        const articleLink = article.url || '#';
        const imageUrl = article.urlToImage;
        const sourceIcon = article.source.name ? `https://logo.clearbit.com/${article.source.name.toLowerCase()}.com` : '[no image]';

        newsItem.innerHTML = `
            <img src="${imageUrl || sourceIcon || '[no image]'}" alt="Article Image" class="news-image">
            <div class="text-content">
                <h2 class="title">${article.title}</h2>
                <p>${article.description || 'No description available.'}</p>
                <p><strong>Published:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
                <a href="${articleLink}" class="read-more-button" target="_blank">Read more</a>
            </div>
        `;

        newsContainer.appendChild(newsItem);
    });
}
