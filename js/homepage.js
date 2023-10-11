const moviePlayingDropdown = document.getElementById('moviePlayingDropdown');

function fillDropdown(dropdownId, array, defaultText) {
    const firstElement = document.createElement('option');
    firstElement.textContent = `Select ${defaultText}`;
    firstElement.disabled = true;
    firstElement.selected = true;
    dropdownId.appendChild(firstElement);

    array.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.textContent = element;
        optionElement.value = element;
        dropdownId.appendChild(optionElement);
    });
}

/*------------------------DROPDOWN----------------------*/

const showDatesURL = 'http://localhost:8080/showings/week';

actionFetchMovieDates(showDatesURL);

async function actionFetchMovieDates(url) {
    const showDates = await fetchAnyData(url);
    const showDatesText = await JSON.parse(showDates);
    fillDropdown(moviePlayingDropdown,showDatesText,'date');
}

async function fetchAnyData(url) {
    let jsonFormat;
    try {
        const response = await fetch(url);
        jsonFormat = await response.text();
    } catch(err) {
        alert('Network issue - data not recieved.')
    }
    return jsonFormat;
}


/*------------------------SHOWING CARDS----------------------*/

let showCardsUrlByDate = 'http://localhost:8080/showings/';

moviePlayingDropdown.addEventListener('change', function (event){
    const date = event.target.value;
    showCardsUrlByDate = showCardsUrlByDate + date;
})


const mainContainer = document.getElementById('main-container');

async function actionFetchShowings(url) {
    const showings = await fetchAnyData(url);
    showings.forEach(createShowingCard);
}

function createShowingCard(object) {
    //Create showinigContainer
    const showContainer = createElement('div');
    showContainer.classList.add('showingContainer');

    //Create img and append it to showingContainer
    const showImg = createElement('img');
    showImg.classList.add('showingPic');
    showImg.setAttribute('src', '');
    showImg.setAttribute('alt', '');
    showContainer.appendChild(showImg);

    //Create showingInfo
    const showInfo = createElement('div');
    showInfo.classList.add('showinigInfo');

    //Movie title
    const h3 = createElement('h3');
    h3.textContent = '';
    showInfo.appendChild(h3)

    //Movie playing time in minuts
    const h4 = createElement('h4');
    h4.textContent = `Playing time: ${''} minuts`;
    showInfo.appendChild(h4);

    const showTime = createElement('div');
    showTime.classList.add('showingTime');

    //Use this if its just an array of times
    const times = []
    times.forEach(time => {
        const timeItem = createElement('div');
        timeItem.classList.add('timeItem');
        timeItem.textContent = time;
        showTime.appendChild(timeItem);
    });

    //Use this if its an array of times objects may add one more loop.
    for(let key in times) {
        const timeItem = createElement('div');
        timeItem.classList.add('timeItem');
        timeItem.text = times[key];
        showTime.appendChild(timeItem);
    }

    showInfo.appendChild(showTime);

    const showButton = createElement('a');
    showButton.classList.add('showingButton');
    showButton.textContent = 'ORDER NOW';
    //showButton.href = `http://example.com/target-page?data=${JSON.stringify(object)}`;
    showButton.addEventListener('click', function() {

    });

    showInfo.appendChild(showButton);

}