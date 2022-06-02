const parkListUrl = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${NPS_api_key}`;
const parkVistUrl = 'http://localhost:3000/parks';

loadParkData();
setupVisitForm();

// Add slashes to quotes within strings to avoid trouble
// source: https://stackoverflow.com/questions/770523/escaping-strings-in-javascript
function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function setupVisitForm() {
    // take action when [submit] selected on form
    const visitForm = document.querySelector('#form');
    visitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Save the date and note entered by the user in the park card
        detailPark.visitDate = e.target.fdate.value;
        detailPark.comment = e.target.fnotes.value;
        detailPark.visited = !!detailPark.visitDate; // will be true/false depending if date was set

        const parkName = e.target.parentElement.querySelector('#detailParkName').textContent
        const parkCard = locateParkByName(parkName);
        const button = parkCard.querySelector('.favorite-button');
        button.textContent = detailPark.visited ? 'Visited' : 'Not Visited';
        console.log(`I see a submit.  parkName is ${parkName}. Visited on ${detailPark.visitDate}. parkCard${parkCard ? '' : ' not'} located.  Will be saving data to db.json`);
    })
}

// Retrieve parks data from National Park Service API
// Map data to retain only the fields we care about, and add the following:
// - comment    => user entered comment about the park
// - visitDate  => user entered date of visit
// - visited    => flag to indicate whether user has visited this park
function loadParkData() {
    fetch(parkListUrl)
        .then(response => response.json())
        .then(parks => {

            const allParks = parks.data.map((park) => {

                return {
                    name: park.fullName,
                    description: park.description, // if needed addslashes(park.description),
                    states: park.states,
                    image: park.images.length > 0 ? park.images[0].url : '',
                    image2: park.images.length > 1 ? park.images[1].url : '',
                    weather: park.weatherInfo,
                    comment: '',
                    visitDate: '',
                    visited: false,
                    id: ''
                }
            })
            // More work after parks are loaded

            allParks.forEach(park => createCard(park))
            displayParkDetails(allParks[0]);


            // retrieve any visit details from our local server
            fetch(parkVistUrl)
                .then(response => response.json())
                .then(data => {
                    // for each visit logged in our database
                    // locate the park and update with the visit info
                    data.forEach(visit => {        
                        // filter by park name
                        const foundPark = allParks.filter(park => park.name === visit.name);                        
                        if (foundPark.length > 0) {                            
                            foundPark[0].visitDate = visit.dateVisited;
                            foundPark[0].visited = !!visit.dateVisited; // will be true/false depending if date was set   
                            foundPark[0].comment = visit.comment;
                            foundPark[0].id = visit.id;                            
                        }
                    })
                    allParks.forEach(park => createCard(park))
                    displayParkDetails(allParks[0]);
                })
                .catch(error => {
                    alert(`Error occurred: ${error}.\nMake sure you are running json-server --watch db.json`)
                })


        })

        .catch(error => alert(`Failed to load parks: ${error.message}`))
}

function displayParkDetails(park) {
    // Get the park details
    detailPark = park;

    ///////////////////////////////////////////////////////////
    // This is the addtional data that could be added to the detail card
    //console.log(`Park weather is ${park.weather}`);
    //console.log(`Park additional image is ${park.image2}`);
    ///////////////////////////////////////////////////////////

    // Get the DOM elements that will display the details
    const detailPic = document.querySelector('.detail-pic');
    const detailPic2 = document.querySelector('#detail-pic2');
    const detailParkName = document.querySelector('.detail-park-name');
    const detailParkState = document.querySelector('.detail-state');
    const detailParkDesc = document.querySelector('.detail-description');
    const detailVisitDate = document.querySelector('#fdate');
    const detailVisitNotes = document.querySelector('#fnotes');

    detailPic.src = park.image;
    detailPic.alt = park.name;
    detailPic2.src = park.image2;
    detailPic2.alt = park.name;
    detailParkName.textContent = park.name;
    detailParkState.textContent = park.states;
    detailParkDesc.textContent = park.description;

    detailVisitDate.value = park.visitDate;
    detailVisitNotes.value = park.comment;
}

let slideIndex = 1; //slideshow functionality for detailPark
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("detail-pic-div");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

let detailPark; // this is the park currently displayed in the detail area

function createCard(park) {
    const cardContainer = document.querySelector('.park-cards')
    let parkCard = document.createElement('div')
    parkCard.className = 'card'

    let titleButton = document.createElement('div')
    titleButton.className = 'title-button'

    let parkTitle = document.createElement('h2')
    parkTitle.className = 'park-name'
    parkTitle.textContent = park.name
    let state = document.createElement('h4')
    state.textContent = park.states
    state.className = 'state'
    let btn = document.createElement('button')
    btn.className = 'favorite-button'
    btn.textContent = park.visited ? 'Visited' : 'Not Visited';
    titleButton.appendChild(parkTitle)
    titleButton.appendChild(state)
    titleButton.appendChild(btn)
    parkCard.appendChild(titleButton)

    let selfie = document.createElement('img')
    selfie.className = 'pic'
    selfie.src = park.image
    parkCard.appendChild(selfie)

    let descript = document.createElement('p')
    descript.className = 'description'
    descript.textContent = park.description.length > 100 ? park.description.substring(0, 97) + '...' : park.description.substring;
    parkCard.appendChild(descript)

    // Watch for clicks on the card so it can be displayed in detail
    parkCard.addEventListener('click', (e) => {
        // Park clicked, so display this park's details
        displayParkDetails(park);
    })
    cardContainer.appendChild(parkCard)
}



// Locate and return the park's card from the full list
function locateParkByName(parkName) {

    let foundCard;
    // filter LKF
    //const searchBucket = Array.from(document.querySelector('.park-cards').children)
    const searchBucket = Array.from(cardBucket2)
    searchBucket.forEach(card => {
        if (card.querySelector('.park-name').textContent === parkName) {
            foundCard = card;

        }
    })
    return foundCard;
}


const cardBucket2 = document.querySelector('.park-cards').children
function filterByState(stateCode, skip = false) {
    const cardBucket = Array.from(cardBucket2)
    //prevent infinite looping from recurrsion 
    if (skip === false) {
        hideIf(filterSelect.value)
    }
    cardBucket.forEach(card => {
        //hides all displays that don't include the state code
        //
        if (!card.children[0].children[1].textContent.includes(stateCode)) {
            card.style.display = "none"
        }
    })
}
const stateFilter = document.querySelector('#state-filter-form')
stateFilter.addEventListener('submit', e => {
    e.preventDefault()
    const statecode = document.querySelector('#statecode').value
    filterByState(statecode)
})
const filterSelect = document.querySelector('select')
filterSelect.addEventListener('change', e => {
    e.preventDefault()
    hideIf(filterSelect.value)
})
function hideIf(para) {
    //filter-visited will show visited parks
    //filter-not-visited will show unvisited parks
    //show-all will display all parks again
    const cardBucket = Array.from(cardBucket2)
    switch (para) {
        case 'show-all':
            cardBucket.forEach(card => {
                card.style.display = ''
            })
            break;
        case 'filter-visited':
            cardBucket.forEach(card => {
                if (card.children[0].children[2].innerHTML === 'Visited') {
                    card.style.display = ''
                } else {
                    card.style.display = 'none'
                }
            })
            break;
        case 'filter-not-visited':
            cardBucket.forEach(card => {
                if (card.children[0].children[2].innerHTML === 'Not Visited') {
                    card.style.display = ""
                } else {
                    card.style.display = 'none'
                }
            })
            break;
    }
    //runs filterByState to refilter incase hideIf reverted changes.
    filterByState(document.querySelector('#statecode').value, true)
}

// Fetch (GET) park visit entries

