import { setLocationObject, getHomeLocation, cleanText } from "./dataFunctions.js";
import { addSpinner, displayError, updateScreenReaderConfirmation } from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";

const currentLoc = new CurrentLocation;

const initApp = () => {
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    const saveButton = document.getElementById("saveLocation");
    saveButton.addEventListener("click", saveLocation);
    const unitButton = document.getElementById("unit");
    unitButton.addEventListener("click", setUnitPref);
    const refreshButton = document.getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);
    const locationEntry = document.getElementById("searchBar__form");
    locationEntry.addEventListener("submit", submitNewLocation);
    // loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
    if (event) {
        if (event.type === "click") {
            const mapIcon = document.querySelector(".fa-location-dot");
            addSpinner(mapIcon);
        } 
    }
    if (!navigator.geolocation) geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
};

const geoError = (errObj) => {
    const errMsg = errObj ? errObj : "Geolocation not supported";
    displayError(errMsg, errMsg);
}

const geoSuccess = (position) => {
    const myCoordsobj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    setLocationObject(currentLoc, myCoordsobj)
    updatedataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
    const savedLocation = getHomeLocation();
    if (!savedLocation && !event) return getGeoWeather();
    if (!savedLocation && event.type === "click") {
        displayError(
            "No Home Location Saved.",
            "Sorry. Please save your home location first."
        )
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation)
    } else {
        const homeIcon = document.querySelector(".fa-house");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
};

const displayHomeLocationWeather = (home) => {
    if (typeof home === 'string') {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat:locationJson.lat,
            lon:locationJson.lon,
            name:locationJson.name,
            unit:locationJson.unit
        };
        setLocationObject(currentLoc, myCoordsObj);
        updatedataAndDisplay(currentLoc)
    }
};

const saveLocation = () => {
    if (currentLoc.getLat() && currentLoc.getLon()) {
        const saveIcon = document.querySelector('.fa-bookmark');
        addSpinner(saveIcon);
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        }
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`); 
    }
};

const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-toggle-on");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updatedataAndDisplay(currentLoc);
};

const refreshWeather = () => {
    const refreshIcon = document.querySelector('.fa-rotate-right');
    addSpinner(refreshIcon);
    updatedataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
    event.preventDefault();
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    if (!entryText.length) return;
    const locationIcon = document.querySelector(".fa-cloud");
    addSpinner(locationIcon)
    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
    if (coordsData.cod === 200) {
        //success
        const myCorrdsObj = {};
        setLocationObject(currentLoc, myCoordsObj);
        updatedataAndDisplay(currentLoc);
    } else {
        displayApiError(coordsData);
    }
};

const updatedataAndDisplay = async (locationObj) => {
    console.log(locationObj);
    // const weatherJson = await getWeatherFromCoords(locationObj);
    // if (weatherJson) updateDisplay(weatherJson, locationObj);
};