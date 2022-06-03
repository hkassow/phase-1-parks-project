const parkListUrl = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${NPS_api_key}`;
const parkVisitUrl = 'http://localhost:3000/parks';
let detailPark; // this is the park currently displayed in the detail area

loadParkData();
setupVisitForm();




/*
 * Park Detail Display
 */
function displayParkDetails(park) {
    // Get the park details
    detailPark = park;

    // Get the DOM elements that will display the details
    const detailPic = document.querySelector('.detail-pic');
    const detailPic2 = document.querySelector('#detail-pic2');
    const detailParkName = document.querySelector('.detail-park-name');
    const detailParkState = document.querySelector('.detail-state');
    const detailParkDesc = document.querySelector('.detail-description');
    const detailVisitDate = document.querySelector('.visited-on');
    const detailVisitNotes = document.querySelector('.visit-notes');
    const visitInfoDisplay = document.querySelector('.visit-info')

    detailPic.src = park.image;
    detailPic.alt = park.name;
    detailPic2.src = park.image2;
    detailPic2.alt = park.name;
    detailParkName.textContent = park.name;
    detailParkState.textContent = park.states;
    detailParkDesc.textContent = park.description;

    detailVisitDate.textContent = park.visitDate === "" ? 'Not visited yet!' : `Visited on ${park.visitDate}`;
    detailVisitNotes.textContent = park.comment;
}

// Configure form on detail display used to enter visit date/comment
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
        const button = parkCard.querySelector('.visit-button');
        button.textContent = detailPark.visited ? 'Visited' : 'Not Visited';

        //sending data to server and updating the current display
        storeParkComments(parkName, detailPark.visitDate, detailPark.comment)
        const detailVisitNotes = document.querySelector('.visit-notes');
        detailVisitNotes.textContent = detailPark.comment
        const detailVisitedDate = document.querySelector('.visited-on');
        detailVisitedDate.textContent = detailPark.visitDate === "" ? 'Not visited yet!' : `Visited on ${detailPark.visitDate}`;
        e.target.fnotes.value = ''

    })
}

//slideshow functionality for detailPark
let slideIndex = 1; 
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('detail-pic-div');
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}



/*
 * Park Display Setup
 */
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
    btn.className = 'visit-button'
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
    const searchBucket = Array.from(cardBucket2)
    const foundCard = searchBucket.filter(card => card.querySelector('.park-name').textContent === parkName);

    if (foundCard.length === 1) {
        return foundCard[0];
    } else {
        return foundCard;
    }
}

/*
 * Filter Management
 */

// cardBucket2 contains all cards 
const cardBucket2 = document.querySelector('.park-cards').children
function filterByState(stateCode, skip = false) {
    const cardBucket = Array.from(cardBucket2)
    //if statement prevents infinite looping from callbacks 
    //run the visited/not visited filter to reset any cards previously hidden
    if (skip === false) {
        hideIf(filterSelect.value)
    }
    cardBucket.forEach(card => {
        //hides all displays that don't include the state code
        //note that it doesnt change display if the state is included
        //thats what the previous if statement and callback function are for 
        if (!card.children[0].children[1].textContent.includes(stateCode)) {
            card.style.display = "none"
        }
    })
}
const stateFilter = document.querySelector('#state-filter-form')
stateFilter.addEventListener('submit', e => {
    e.preventDefault()
    const statecode = document.querySelector('#statecode').value
    //running filterByState with default no-skip 
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
    //important that we pass any value thats not false into the 2nd parameter to prevent looping
    filterByState(document.querySelector('#statecode').value, true)
}


/*
 * Park Data Management
 */
// Retrieve parks data from National Park Service API
// Map data to retain only the fields we care about, and add the following:
// - comment    => user entered comment about the park
// - visitDate  => user entered date of visit
// - visited    => flag to indicate whether user has visited this park
// - id         => id used by json-server
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
            // retrieve any visit details from our local server
            fetch(parkVisitUrl)
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


// Fetch (GET) park visit entries
//grab all park data in LOCAL SERVER; waits till promise is complete to send it 
async function getJSONPark() {
    return await (fetch(parkVisitUrl)
        .then(data => data.json())
        .then(parks => { return parks }))
}

//will return id if park exists in server already
//will return false otherwise
//use function to check if patch request or post request is needed
async function checkParks(parkName) {
    const jsonPark = await getJSONPark()
    let x
    x = Array.from(jsonPark).find(park => park.name === parkName)

    if (x === undefined) {
        return false
    }
    return x.id
}
//sends patch or post request 
async function storeParkComments(parkName, visitDate, parkComment) {
    //use callback to get park id inside our local server
    const parkID = await checkParks(parkName)
    //post
    if (parkID === false) {
        const parkData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: parkName,
                dateVisited: visitDate,
                comment: parkComment
            }),
        }
        // parkVisitUrl = 'http://localhost:3000/parks'
        fetch(parkVisitUrl, parkData)
    } else {
        //patch
        fetch(`http://localhost:3000/parks/${parkID}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                comment: parkComment,
                dateVisited: visitDate
            })
        })
    }
}