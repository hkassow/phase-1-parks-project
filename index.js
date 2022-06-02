const parkListUrl = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${NPS_api_key}`;

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
        console.log(`I see a submit.  parkName is ${parkName}. parkCard${parkCard ? '' : ' not'} located.  Will be saving data to db.json`);
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
                    comment: '',
                    visitDate: '',
                    visited: false
                }
            })
            // More work after parks are loaded
            allParks.forEach(park => createPark(park))
            console.log(`All parks inside .then: ${allParks.length}`);
            displayParkDetails(allParks[0]);


        })

        .catch(error => alert(`Failed to load parks: ${error.message}`))
}

function displayParkDetails(card) {
    // Get the park details
    detailPark = card;

    // Get the DOM elements that will display the details
    const detailPic = document.querySelector('.detail-pic');
    const detailParkName = document.querySelector('.detail-park-name');
    const detailParkState = document.querySelector('.detail-state');
    const detailParkDesc = document.querySelector('.detail-description');
    const detailVisitDate = document.querySelector('#fdate');
    const detailVisitNotes = document.querySelector('#fnotes');

    detailPic.src = card.image;
    detailPic.alt = card.name;
    detailParkName.textContent = card.name;
    detailParkState.textContent = card.states;
    detailParkDesc.textContent = card.description;

    detailVisitDate.value = card.visitDate;
    detailVisitNotes.value = card.comment;
}

let detailPark; // this is the park currently displayed in the detail area
let parkContainer = document.querySelector('.park-cards')
function createPark(card) {

    let park = document.createElement('div')
    park.className = 'card'

    let titleButton = document.createElement('div')
    titleButton.className = 'title-button'

    let parkTitle = document.createElement('h2')
    parkTitle.className = 'park-name'
    parkTitle.textContent = card.name
    let state = document.createElement('h4')
    state.textContent = card.states
    state.className = 'state'
    let btn = document.createElement('button')
    btn.className = 'favorite-button'
    btn.textContent = card.visited ? 'Visited' : 'Not Visited';
    titleButton.appendChild(parkTitle)
    titleButton.appendChild(state)
    titleButton.appendChild(btn)
    park.appendChild(titleButton)

    let selfie = document.createElement('img')
    selfie.className = 'pic'
    selfie.src = card.image
    park.appendChild(selfie)

    let descript = document.createElement('p')
    descript.className = 'description'
    descript.textContent = card.description.length > 100 ? card.description.substring(0, 97) + '...' : card.description.substring;
    park.appendChild(descript)

    // Watch for clicks on the card so it can be displayed in detail
    park.addEventListener('click', (e) => {
        // Park clicked, so display this park's details
        displayParkDetails(card);
    })
    parkContainer.appendChild(park)
}

function grabParks() {
    //converts html collection to array using spread operator
    const x = [...document.getElementsByClassName('card')]
    return x
}

// Locate and return the park's card from the full list
function locateParkByName(parkName) {
    const parkList = grabParks()
    let foundPark;
    parkList.forEach(park => {
        if (park.querySelector('.park-name')) {
            if (park.querySelector('.park-name').textContent === parkName) {
                foundPark = park;
            }

        }
    })
    return foundPark;
}

const parkBucket = document.querySelector('.park-cards').children
function filterByState(stateCode, skip = false) {
    //prevent infinite looping from recurrsion 
    if (skip === false) {
        hideIf(filterSelect.value)
    }
    Array.from(parkBucket).forEach(park => {
        //hides all displays that don't include the state code
        //
        console.log(park.children[0].children[1].innerHTML)
        if (!park.children[0].children[1].textContent.includes(stateCode)) {
            park.style.display = "none"
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
    switch (para) {
        case 'show-all':
            Array.from(parkBucket).forEach(park => {
                park.style.display = ''
            })
            break;
        case 'filter-visited':
            Array.from(parkBucket).forEach(park => {
                if (park.children[0].children[2].innerHTML === 'Visited') {
                    park.style.display = ''
                } else {
                    park.style.display = 'none'
                }
            })
            break;
        case 'filter-not-visited':
            Array.from(parkBucket).forEach(park => {
                if (park.children[0].children[2].innerHTML === 'Not Visited') {
                    park.style.display = ""
                } else {
                    park.style.display = 'none'
                }
            })
            break;
    }
    //runs filterByState to refilter incase hideIf reverted changes.
    filterByState(document.querySelector('#statecode').value, true)
}
