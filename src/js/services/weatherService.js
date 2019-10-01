const WeatherService = () => {
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    const cityId = '4560349'
    const apiUrl = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=imperial`;
    
    const Weather = (data) => {
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            shortDescription: data.weather[0].main,
            icon: data.weather[0].icon,
            weatherId: data.weather[0].id
        }
    }

    const getWeather = () => {
        return $.getJSON(apiUrl);
    }
    
    return {
        Weather, 
        getWeather
    }
}