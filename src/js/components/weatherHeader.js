const WeatherHeader = (weather) => {
    let iconPath = `http://openweathermap.org/img/wn/${weather.icon}.png`;

    return `
        <div class='weather ${weather.weatherId < 800 ? "alert" : ""}'>
            <img src='${iconPath}' />
            <span>${Math.floor(weather.temperature)}&#176;</span>
            <span>&nbsp;${weather.description}</span>
        </div>
    `;
}