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
        console.log("I see a submit");
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



        })

        .catch(error => alert(`Failed to load parks: ${error.message}`))
}
let detailPark;
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
    btn.textContent = 'Not Visited'
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
    descript.textContent = card.description
    park.appendChild(descript)

    // Watch for clicks on the card so it can be displayed in detail
    park.addEventListener('click', (e) => {
        // Park clicked, so display this park's details

        // Get the park details
        detailPark = card;

        // Get the DOM elements that will display the details
        const detailPic = document.querySelector('.detail-pic');
        const detailParkName = document.querySelector('.detail-park-name');
        const detailParkState = document.querySelector('.detail-state');
        const detailParkDesc = document.querySelector('.detail-description');
        const detailVisitDate = document.querySelector('.fdate');
        const detailVisitNotes = document.querySelector('.fnotes');

        detailPic.src = card.image;
        detailPic.alt = card.name;
        detailParkName.textContent = card.name;
        detailParkState.textContent = card.states;
        detailParkDesc.textContent = card.description;
        detailVisitDate.value = card.visitDate;
        detailVisitNotes.textContent = card.comment;


    })
    parkContainer.appendChild(park)
}

function grabParks() {
    //converts html collection to array using spread operator
    const x = [...document.getElementsByClassName('card')]
    return x
}
function filterByState(stateCode) {
    const parkList = grabParks()
    parkList.forEach(park => {
        //currently using description as practice filtering 
        //will replace with states once added to htm
        //hides all displays that don't include the state code
        if (!park.children['description'].textContent.includes(stateCode)) {
            park.style.display = "none"
        }
    })
}
// filterByState('Yellowstone') remove all parks that don't have Yellowstone in their description


function hideIf(para = 'Visited') {
    //no input will hide visited parks
    //'reset' will display all parks again 
    //any other input will hide unvisited parks
    const parkList = grabParks()
    para = (para === 'Visited') ? para : 'Not Visited'
    console.log(para)
    parkList.forEach(park => {
        if (para === 'reset') {
            park.style.display = 'block'
        }
        if (park.children['title-button'].children['favorite-button'].textContent === para) {
            park.style.display = "none"
        } else {
            console.log('yes')
            park.style.display = ''
            delete park.style
        }
    })
}
