const parkListUrl = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${NPS_api_key}`;

loadParkData();


// Add slashes to quotes within strings to avoid trouble
// source: https://stackoverflow.com/questions/770523/escaping-strings-in-javascript
function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

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
            console.log(`All parks inside .then: ${allParks.length}`);
            
        })
        .catch(error => alert(`Failed to load parks: ${error.message}`))
}








function grabParks(){
    //converts html collection to array using spread operator
    const x = [...document.getElementsByClassName('card')]
    return x
}
function filterByState(stateCode){
    const parkList = grabParks()
    parkList.forEach(park => {
        //currently using description as practice filtering 
        //will replace with states once added to htm
        //hides all displays that don't include the state code
        if (!park.children['description'].textContent.includes(stateCode)){
            park.style.display = "none"   
        }
    })
}
// filterByState('Yellowstone') remove all parks that don't have Yellowstone in their description


function hideIf(para = 'Visited'){
    //no input will hide visited parks
    //'reset' will display all parks again 
    //any other input will hide unvisited parks
    const parkList = grabParks()
    para = (para === 'Visited')? para: 'Not Visited'
    console.log(para)
    parkList.forEach(park => {
        if (para === 'reset') {
            park.style.display = 'block'
        }
        if (park.children['title-button'].children['favorite-button'].textContent === para) {
            park.style.display = "none"
        } else {
            console.log('yes')
            park.style.display = 'block'
        }
    })
}





//insert comment for test run