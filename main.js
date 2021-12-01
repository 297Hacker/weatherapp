const input = document.querySelector('.search-input');
const submit = document.querySelector('.search-weather');
const loading = document.querySelector('.load');
const weatherCity = document.querySelector('.weatherCity');
const weatherDesc = document.querySelector('.weatherDescription');
const weatherTemp = document.querySelector('.weatherTemp');

submit.addEventListener('click', searchWeather);

const APP_ID = '89a1062777a8c237665d0c93060e4ac3';

class Http {
    static fetchData(url) {
        return new Promise((resolve, reject) => {
            const HTTP = new XMLHttpRequest();
            HTTP.open('GET', url);
            HTTP.onreadystatechange = function () {
                if (HTTP.readyState == XMLHttpRequest.DONE && HTTP.status == 200) {
                    const response_data = JSON.parse(HTTP.responseText);
                    resolve(response_data);
                } else if (HTTP.readyState == XMLHttpRequest.DONE) {
                    console.log('failed');
                    reject('something went wrong');
                }
            };
            HTTP.send();
        });
    }
}

class weatherData {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.temperature = ''
    }
}

const weatherProxyHandler = {
    get: function (target, property) {
        return Reflect.get(target, property);
    },
    set: function (target, property, value) {
        const newValue = (value * 1.8 + 32).toFixed(2) + 'F.';
        return Reflect.set(target, property, newValue);
    }
};

function searchWeather() {
    const searchedCity = input.value.trim();
    if (searchedCity.length === 0) {
        alert("enter a city name");
    }
    const URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + APP_ID;
    Http.fetchData(URL).then(response => {
        const WEATHER_DATA = new weatherData(searchedCity, response.weather[0].description);
        const WEATHER_PROXY = new Proxy(WEATHER_DATA, weatherProxyHandler);
        WEATHER_PROXY.temperature = response.main.temp;
        updateWeather(WEATHER_PROXY);
    }).catch(err => console.log(err));
}

function updateWeather(weatherData) {
    weatherCity.textContent = weatherData.name;
    weatherDesc.textContent = weatherData.description;
    weatherTemp.textContent = weatherData.temperature;
}