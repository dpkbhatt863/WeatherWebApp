//get weather data from geolocation
document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            const apiKey = "fd71a799ef6a73ef5857f699acef6f2b";
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            
            //fetch weather data
            fetchWeatherData(apiUrl)
                .then(data =>updateWeatherUI(data))
                .catch(error => {
                    document.getElementById("error-message").innerText = error;
                    document.getElementById("weather-info").style.display = "none";
                });
        }, error => {
            document.getElementById("error-message").innerText = "Unable to retrieve your location.";
        });
    } else {
        document.getElementById("error-message").innerText = "Geolocation is not supported by this browser.";
    }

    document.getElementById("weather-form").addEventListener("submit", function (event) {
        event.preventDefault();
        
        let cityInput = document.getElementById("city");
        let city = cityInput.value;
        let apiKey = "fd71a799ef6a73ef5857f699acef6f2b";  
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        fetchWeatherData(apiUrl)
            .then(data => {
                updateWeatherUI(data);
                cityInput.value = '';
            })
            .catch(error => {
                document.getElementById("error-message").innerText = error;
                document.getElementById("weather-info").style.display = "none";
            });
    });

    //Temperature unit toggle button
    const unitToggle = document.getElementById("unit-toggle");

    unitToggle.onclick = function () {
        const temperatureElement = document.getElementById("temperature");
        const currentTemp = temperatureElement.innerText;
        const isCelsius = currentTemp.includes("°C");


        if (isCelsius) {
            const temperatureCelsius = parseFloat(currentTemp);
            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
            temperatureElement.innerText = `${temperatureFahrenheit.toFixed(1)}°F`;
            unitToggle.innerText = "Switch to °C";
        } else {
            const temperatureFahrenheit = parseFloat(currentTemp);
            const temperatureCelsius = (temperatureFahrenheit - 32) * 5/9;
            temperatureElement.innerText = ` ${temperatureCelsius.toFixed(1)}°C`;
            unitToggle.innerText = "Switch to °F";
        }
    };
});

//fetch weather data from openweathermap api
function fetchWeatherData(url) {
    return new Promise((resolve, reject) => {
        let xmlReq = new XMLHttpRequest();
        xmlReq.open("GET", url, true);
        xmlReq.onload = function () {
            if (xmlReq.status === 200) {
                let data = JSON.parse(xmlReq.responseText);
                resolve(data);
            } else {
                reject("City not found. Please try again.");
            }
        };
        xmlReq.onerror = function () {
            reject("Error fetching data. Please check your connection.");
        };
        xmlReq.send();
    });
}

//update weather ui
function updateWeatherUI(data) {
    const temperatureCelsius = data.main.temp;
    const temperatureElement = document.getElementById("temperature");


    document.getElementById("location").innerText = `${data.name}, ${data.sys.country}`;
    temperatureElement.innerText = `${temperatureCelsius.toFixed(1)}°C`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("condition").innerText = `${data.weather[0].description}`;
    

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById("weather-icon-left").src = iconUrl;
    document.getElementById("weather-icon-right").src = iconUrl;
    
    document.getElementById("weather-info").style.display = "block";
    document.getElementById("error-message").innerText = "";

    //to change background color based on weather condition
    const condition = data.weather[0].main.toLowerCase();
    const body = document.body;
    body.className = ''; 

    if (condition.includes('thunderstorm')) {
        body.classList.add('thunderstorm');
    } else if (condition.includes('drizzle')) {
        body.classList.add('drizzle');
    } else if (condition.includes('rain')) {
        body.classList.add('rainy');
    } else if (condition.includes('snow')) {
        body.classList.add('snowy');
    } else if (condition.includes('mist') || condition.includes('smoke') || condition.includes('haze') || condition.includes('fog') || condition.includes('dust') || condition.includes('ash') || condition.includes('squall') || condition.includes('tornado')) {
        body.classList.add('atmosphere');
    } else if (condition.includes('clear')) {
        body.classList.add('sunny');
    } else if (condition.includes('cloud')) {
        body.classList.add('cloudy');
    } else {
        body.classList.add('default-weather');
    }
}
