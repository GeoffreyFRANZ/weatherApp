import React from "react";
import { useGeolocated } from "react-geolocated";

const Geolocalisation = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        coords
        // [coords.longitude, coords.latitude, coords]
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Geolocalisation;