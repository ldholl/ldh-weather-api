const apiKey = "b0e9fbd81dae4a1e95ade9efa9d6dc3f"
let lat
let lon
let searches = [];
const submitBtn = document.getElementById('submit-btn');
let searchInput = document.getElementById('search-input');


submitBtn.onclick = function(event){
    event.preventDefault()


    let searchPlace = searchInput.value;
    searches.push(searchPlace);
    
    saveSearches();

    getGeos(searchPlace);

};




const saveSearches = function(){
    localStorage.setItem('searches', JSON.stringify(searches));

};

const loadSearches = function(){
    let pastList = document.getElementById('past-list');
    pastList.innerHTML = '';
    let savedSearches = localStorage.getItem('searches');
    if(!savedSearches){
        return false;
    }
    
    searches = JSON.parse(savedSearches);
    
    for(let i = 0; i < searches.length; i++){
        
        listPastSearch(searches[i]);
    }

    console.log(searches);
};

const listPastSearch = function(savedSearch){
    let pastList = document.getElementById('past-list');
    let pastPoint = document.createElement('li')
    pastList.appendChild(pastPoint);
    
    let pastButton = document.createElement('button');
    pastButton.className = 'button past-search is-primary is-light'
    pastButton.id = savedSearch
    pastButton.innerText = savedSearch;
    pastPoint.appendChild(pastButton);
}

const getGeos = function(searchPlace){
    loadSearches();

    let apiUrlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${searchPlace}&limit=1&appid=${apiKey}`

    fetch(apiUrlGeo).then(function(response){
        response.json().then(function(data){

            let {lat, lon} = data[0];
         
            getWeather(lat, lon);
        })
    })
};   

let getWeather = function(lat, lon){
    let apiUrlWeather = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(apiUrlWeather).then(function(response){
        response.json().then(function(data){

            let { list } = data;

            let thisDate = list[0];
            let {main, weather, wind} = thisDate;
            let nowTemp = Math.floor(1.8*(main.temp - 273) + 32);
            let todayLine = document.getElementById('current-search');
            todayLine.innerHTML = '';

            let todayy = document.createElement('h1');
            todayy.innerText = 'Today';
            todayLine.appendChild(todayy);

            let todayDate = document.createElement('h2');
            todayDate.innerText = thisDate.dt_txt;
            todayLine.appendChild(todayDate);

            let todayWeath = document.createElement('i');
            let todayType = weather[0].main;
            if(todayType === 'Clouds'){todayWeath.className = 'fa-solid fa-cloud'}
            if(todayType === 'Sun'){todayWeath.className = 'fa-solid fa-sun'}
            todayLine.appendChild(todayWeath)
            

            let todayTemp = document.createElement('p');
            todayTemp.innerText = 'Temp: ' + nowTemp + '° F';
            todayLine.appendChild(todayTemp);

            let todayHumidity = document.createElement('p');
            todayHumidity.innerText = 'Humidity: ' + main.humidity + '%'
            todayLine.appendChild(todayHumidity);

            let todayWind = document.createElement('p');
            todayWind.innerText = 'Wind: '+ wind.speed + 'mph';
            todayLine.appendChild(todayWind);

            let dayList = document.getElementById('day-list');

            let dayArray = [list[8], list[16], list[24], list[32]];
            for (i = 0; i < dayArray.length; i++){
                
                let today = dayArray[i];
                let {main, weather, wind } = today;

                //converting temp
                temp = Math.floor(1.8*(main.temp- 273) + 32);

                //formatting html
                let newColumn = document.createElement('div');
                newColumn.className = "column";
                dayList.appendChild(newColumn);

                let dateLine = document.createElement('h2')
                dateLine.innerText = today.dt_txt;
                newColumn.appendChild(dateLine);

                let iconLine = document.createElement('i');
                let iconType = weather[0].main;
                console.log(iconType);
                if(iconType === 'Clouds'){iconLine.className = 'fa-solid fa-cloud'}
                if(iconType === 'Clear'){iconLine.className = 'fa-solid fa-sun'};
                if(iconType === 'Rain'){iconLine.className = 'fa-solid fa-cloud-rain'};
                if(iconType === 'Snow'){iconLine.className = 'fa-solid fa-snowflake'}
                newColumn.appendChild(iconLine)

                let tempLine = document.createElement('p');
                tempLine.innerText = 'Temp: ' + temp + '° F';
                newColumn.appendChild(tempLine);

                let humidityLine = document.createElement('p');
                humidityLine.innerText = 'Humidity: ' + main.humidity + '%'
                newColumn.appendChild(humidityLine);

                let windLine = document.createElement('p');
                windLine.innerText = 'Wind: ' + wind.speed +'mph'
                newColumn.appendChild(windLine);
            }
        })
    })
}

loadSearches();

document.querySelectorAll('.past-search').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        let pastCity = event.target.id;
        getGeos(pastCity);
    })
})
