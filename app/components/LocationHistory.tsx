import React, { useEffect } from 'react';
import L from 'leaflet';
import PositionHistoryService from '../services/PositionHistory.service';
import CategorizationService from '../services/CategorizationService';

let myMap;
const LocationHistory: React.FC = () => {
    useEffect(() => {
        myMap = L.map('mapid').setView([47.244421, -1.534308], 19);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxNativeZoom: 19,
            maxZoom: 30,

        }).addTo(myMap);
        PositionHistoryService.getAllPositionedItems().then((items) => {
            items.forEach((item) => {
                L.marker([item.boughtLocation.lat, item.boughtLocation.lon], {
                    icon: L.icon({
                        iconUrl: item.category
                            ? CategorizationService.getCategoryImage(item.category).iconURL
                            : `${process.env.PUBLIC_URL}/category-icons/unknown-icon.svg`,
                        iconSize: [38, 95],
                    }),
                })
                    .addTo(myMap)
                    .bindPopup(item.name, { autoClose: false, closeOnClick: false });
            });
        });
    }, []);

    return (
        <div className="map_history">
            <div id="mapid" />
        </div>
    );
};
export default LocationHistory;
