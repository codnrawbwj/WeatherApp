import {
    addSpinner
} from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";

const currentLoc = new CurrentLocation;

const initApp = () => {
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather)
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