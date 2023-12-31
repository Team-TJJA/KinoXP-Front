import {fillDropdown} from "./module.js";
const dateDropdown = document.getElementById('dateDropdown');
const reservationURL = "https://mango-cliff-0e58c8803.3.azurestaticapps.net/reservation"
const showingUrlByDate = 'https://kinoxp-back.azurewebsites.net/showings/';

function fillDateDropdown(dropdownID, array, defaultText) {
    fillDropdown(dropdownID, array, defaultText);
    dropdownID.removeChild(dateDropdown.options[0]);
    loadShowingsToday();
}

/*------------------------DROPDOWN----------------------*/
actionFetchMovieDates(showingUrlByDate + "week");

async function actionFetchMovieDates(url) {
    const showingDates = await fetchAnyData(url);
    const showingDatesText = await JSON.parse(showingDates);
    fillDateDropdown(dateDropdown, showingDatesText, 'date');
}

async function fetchAnyData(url) {
    let jsonFormat;
    try {
        const response = await fetch(url);
        jsonFormat = await response.text();
    } catch (err) {
        alert('Network issue - data not recieved.')
    }
    return jsonFormat;
}


/*------------------------SHOWING CARDS----------------------*/

dateDropdown.addEventListener('change', function (event) {
    const date = event.target.value;
    const showingCardsUrlByDate = showingUrlByDate + date;
    actionFetchShowings(showingCardsUrlByDate);
})

function loadShowingsToday() {
    dateDropdown.selectedIndex = 0;
    const date = dateDropdown.options[dateDropdown.selectedIndex].value;
    const showCardsUrlByDate = showingUrlByDate + date;
    actionFetchShowings(showCardsUrlByDate);
}

function separateShowingsByMovieTitleAndTheater(arrayOfShowings) {
    const showingsByTitleAndTheater= {};
    arrayOfShowings.forEach(showing => {
        const title = showing.movie.movieID;
        const theater = showing.theater.theaterID;
        const key = `${title}-${theater}`;
        if (showingsByTitleAndTheater[key]) {
            showingsByTitleAndTheater[key].push(showing);
        } else {
            showingsByTitleAndTheater[key] = [showing];
        }
    });
    const arrayOfArraysOfShowings = Object.values(showingsByTitleAndTheater)
    createShowingCards(arrayOfArraysOfShowings);
}

async function actionFetchShowings(url) {
    const showings = await fetchAnyData(url);
    const showingsArray = await JSON.parse(showings)
    separateShowingsByMovieTitleAndTheater(showingsArray);
}

function createShowingCards(arrayOfarraysOfShowings) {
    const mainContainer = document.getElementById('main-container1');
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    arrayOfarraysOfShowings.forEach(showingArray => {
        const showing = showingArray[0];

        //Create showingContainer
        const showingContainer = document.createElement('div');
        showingContainer.classList.add('showingContainer');

        //Create img and append it to showingContainer
        const showingImage = document.createElement('img');
        showingImage.classList.add('showingPic');
        showingImage.setAttribute('src', showing.movie.photo);
        showingImage.setAttribute('alt', 'movie photo');
        showingContainer.appendChild(showingImage);

        //Create showingInfo
        const showInfo = document.createElement('div');
        showInfo.classList.add('showingInfo');

        //Movie title
        const h3 = document.createElement('h3');
        h3.textContent = showing.movie.title;
        showInfo.appendChild(h3)

        //Movie playing time in minuts
        const h4 = document.createElement('h4');
        h4.textContent = `Playing time: ${showing.movie.duration} minuts`;
        showInfo.appendChild(h4);

        const showTime = document.createElement('div');
        showTime.classList.add('showingTime');
        showingArray.forEach(showing => {
            const timeItem = document.createElement('a');
            timeItem.classList.add('timeItem');
            timeItem.textContent = showing.showTime;
            const localStorageKey = `showing${showing.showingID}`;
            localStorage.setItem(localStorageKey, JSON.stringify(showing));
            timeItem.href = reservationURL;
            showTime.appendChild(timeItem);
        });

        showInfo.appendChild(showTime);

        const reservationInfo = document.createElement('div');
        reservationInfo.classList.add('reservationInfo');
        reservationInfo.textContent = 'Click the time wanted to go to reservations';
        showInfo.appendChild(reservationInfo);
        showingContainer.appendChild(showInfo);
        mainContainer.appendChild(showingContainer);
    });
}
