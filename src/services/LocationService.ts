import { PositionRecord } from '../datatypes/PositionRecord';

let position : globalThis.Position;
navigator.geolocation.watchPosition((pos) => {
    position = pos;
});

export default class LocationService {
    public static getLocation() : PositionRecord {
        return position ? {
            accuracy: position.coords.accuracy,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            timestamp: position.timestamp,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
        } : null;
    }
}
