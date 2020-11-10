import { PositionRecord } from '../datatypes/PositionRecord';

export default class LocationService {
    private static position: globalThis.Position;

    public static startGeoTracking() {
        navigator.geolocation.watchPosition((pos) => {
            LocationService.position = pos;
        });
    }

    public static getLocation() : PositionRecord {
        const pos = LocationService.position;
        return pos ? {
            accuracy: pos.coords.accuracy,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            timestamp: pos.timestamp,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            altitude: pos.coords.altitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
        } : null;
    }
}
