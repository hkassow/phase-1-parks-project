# phase-1-parks-project

## Requirements to run the site

Run `json-server --watch db.json` to start the JSON server.

API key for the National Parks API must be present in appkey.js.  See below for details

## API Key
Data for this site is retrieved from the National Parks Service API. An API key is free, but must be requested (https://www.nps.gov/subjects/developer/get-started.htm). 

Once the API key has been received, enter it in appkey.js on this line:
`const NPS_api_key = "<your key here>";`

The appkey.js file is stored locally, but not uploaded to GitHub (see .gitignore).  This makes your API key available to the running site but prevents it from being accessed by others via GitHub.

## Site data
Park vist data (date, comment) logged by the user is stored in the `db.json` file, along with the name of the park visited