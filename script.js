const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const cityEl = document.getElementById('city');
const stateEl = document.getElementById('state');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 

const API_KEY= 'd4e93987cc437b20e208c4f64ebf0e21';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + (minutes < 10? '0' +minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]
    
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let { latitude,longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {temp,humidity, wind_speed, uv_index} = data.current;

    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Temperature</div>
        <div>${temp}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>

    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>UV Index</div>
        <div>${uv_index}</div>
    </div>`

    ;

    let fiveDayForecast= ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
                <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div><div class="temp">${day.temp.day}&#176; F</div>
            </div>
            `

        }else{
            fiveDayForecast += `
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">${day.temp.day}&#176; F</div>
            </div>
            `


        }
        
    })

    weatherForecastEl.innerHTML = fiveDayForecast;
}