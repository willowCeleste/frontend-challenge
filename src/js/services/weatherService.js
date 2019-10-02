const WeatherService = () => {
    const apiKey = 'fc5fec7999f7c9bba87c200421b27230';
    const cityId = '4560349'
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=imperial`;
    
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