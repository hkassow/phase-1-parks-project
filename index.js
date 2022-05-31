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
                    image: park.images.length > 0 ? park.images[0].url : ''
                }
            })

            // More work after parks are loaded
            console.log(`All parks inside .then: ${allParks.length}`);
            
        })
        .catch(error => alert(`Failed to load parks: ${error.message}`))
}