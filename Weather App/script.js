const cityinput = document.querySelector(".searchinput");
const citybutton = document.querySelector(".search-btn");

const weatherinfo = document.querySelector(".weather-info");
const notfound = document.querySelector(".not-found");
const searchsection = document.querySelector(".search-city");

const countrytxt = document.querySelector(".country-txt");
const temptxt = document.querySelector(".temp-txt");
const conditiontxt = document.querySelector(".condition-txt");

const humidityvalue = document.querySelector('.humidity-value');
const windvalue = document.querySelector('.wind-value');

const weathersummaryimg = document.querySelector('.weather-summary-img');

const currentdate = document.querySelector('.date-txt');
const currenttime = document.querySelector('.time-txt');

const forecastitemscontainer = document.querySelector('.forecast-items-container');


const apikey = "214ead099dd01570c89e6590add6eb97";

citybutton.addEventListener('click', () => {
    if (cityinput.value.trim() != "") {
        updateweatherinfo(cityinput.value);
        cityinput.value = "";
        cityinput.blur();
    }
    console.log(cityinput.value);
})

cityinput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && cityinput.value.trim() != "") {
        updateweatherinfo(cityinput.value);
        cityinput.value = "";
        cityinput.blur();
    }
})

//fetching data in this function
async function getfetchdata(endpoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`
    const response = await fetch(apiurl);

    return response.json();
}

function getweathericon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    else if (id <= 321) return 'drizzle.svg'
    else if (id <= 531) return 'rain.svg'
    else if (id <= 622) return 'snow.svg'
    else if (id <= 781) return 'atmosphere.svg'
    else if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getcurrentdate(){
    const date=new Date();
    const options= {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return date.toLocaleDateString('en-GB', options);
    // console.log(currentdate.toLocaleDateString('en-GB', options));
}

function getcurrenttime(){
    const time = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return time.toLocaleTimeString('en-GB', options);
}

async function updateweatherinfo(city) {
    const weatherdata = await getfetchdata('weather', city);

    if (weatherdata.cod != 200) {
        showdisplaysection(notfound);
        return;
    }
    // console.log(weatherdata);
    values(weatherdata);

    await updateforecastinfo(city);
    showdisplaysection(weatherinfo);
}

function values(data) {
    //object destruction taken from api gathered data
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = data;

    countrytxt.textContent = country;
    temptxt.textContent = Math.round(temp) + ' °C';
    conditiontxt.textContent = main;
    humidityvalue.textContent = humidity + '%';
    windvalue.textContent = speed + ' M/S';

    currentdate.textContent=getcurrentdate();
    currenttime.textContent=getcurrenttime();

    weathersummaryimg.src = `assets/weather/${getweathericon(id)}`;
}

async function updateforecastinfo(city){
    const forecastdata= await getfetchdata('forecast', city);
    
    const timetaken = '12:00:00';
    const todaydate=new Date().toISOString().split('T')[0];

    forecastitemscontainer.innerHTML ='';
    forecastdata.list.forEach(forecastweather =>{
        if(forecastweather.dt_txt.includes(timetaken) &&
            !forecastweather.dt_txt.includes(todaydate)){
            updateforecastitems(forecastweather);
        }
    })
    // console.log(todaydate);
}

function updateforecastitems(weatherdata){
    console.log(weatherdata);
    const {
        dt_txt: date,
        main: {temp},
        weather: [{id}]
    } = weatherdata;

    const datetaken = new Date(date);
    const dateoptions={
        day: '2-digit',
        month: 'short',
    }
    const dateresult = datetaken.toLocaleDateString('en-GB',dateoptions);

    const forecastitem =`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
            <img src="assets/weather/${getweathericon(id)}" alt="img" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastitemscontainer.insertAdjacentHTML('beforeend', forecastitem);
}

function showdisplaysection(section) {
    [weatherinfo, searchsection, notfound]
        .forEach(section => section.style.display = "none")

    section.style.display = 'flex';
}

