'use strict';

const StationService = () => {
    const apiUrl = 'https://dkw6qugbfeznv.cloudfront.net';
    return {
        test: () => {
            console.log('test');
        },
        getStations: () => {
            return $.getJSON(apiUrl);
        },
        mapStations: stations => {
            let mappedStations = stations.map(station => {
                return {
                    coordinates: {
                        lat: station.geometry.coordinates[1],
                        lng: station.geometry.coordinates[0]
                    },
                    name: station.properties.name,
                    bikesAvailable: station.properties.bikesAvailable,
                    docksAvailable: station.properties.docksAvailable,
                    totalDocks: station.properties.totalDocks
                }
            });
            return mappedStations;
        }
    }
}

const MapService = () => {
    let apiKey = 'AIzaSyBPO4DQhcrJfG7sDC9b760dvH4KsoJpSJY';
    return {};
}

const stationService = StationService();
const mapService = MapService();

let stations;
let mappedStations;
let map;

$(document).ready(function() {
    stations = stationService.getStations();
    stations.done(stations => {
        mappedStations = stationService.mapStations(stations.features)
        populateStationsList(mappedStations);
        initMap(mappedStations.map(station => {
            return station.coordinates;
        }));
        addMarkers(map, mappedStations);
    });

    $('#map-button').click(() => {
        // TODO: search for address here
        console.log($('#address-input').val());
        let closestStations = getClosestStations(new google.maps.LatLng(39.922384, -75.170847), mappedStations, 5);
        console.log(closestStations);
        $('#stations-list').empty();
        populateStationsList(closestStations);
        drawMap(closestStations.map(closeStation => {
            return closeStation.coordinates;
        }));
        addMarkers(map, closestStations);
    })

   
    
});

const populateStationsList = (stationsArray) => {
    $(document).ready(() => {
        for (var i = 0; i < stationsArray.length; i++) {
            let station = stationsArray[i];
            let item = `
                <li>
                    <p>${station.name}</p>
                    <p>${station.bikesAvailable} bikes available</p>
                    <p>${station.docksAvailable} out of ${station.totalDocks} docks available</p>
                    
                </li>
            `
            $('#stations-list').append(item);
        }
    });
}

const initMap = (bounds) => drawMap(bounds);

const drawMap = (coordinates) => {
    if (coordinates) {
        console.log('coords', coordinates);
        map = new google.maps.Map(document.getElementById('map'));
        let mapBounds = new google.maps.LatLngBounds();
        for (var i = 0; i < coordinates.length; i++) {
            mapBounds.extend(coordinates[i]);
        }
        map.fitBounds(mapBounds);

    } else {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 39.952583, lng: -75.165222},
            zoom: 13
        });
    }
    return map;
}

const addMarkers = (map, stations) => {
    for (var i = 0; i < stations.length; i++) {
        let marker = new google.maps.Marker({
            position: stations[i].coordinates,
            map: map,
            title: stations[i].name
        });
        
    }
}

const getClosestStations = (latLng, stations, count) => {
    let stationsWithDistance = [];
 
    for (var i = 0; i < stations.length; i++) {
        var currentStation = stations[i];
        var dist = google.maps.geometry.spherical.computeDistanceBetween(
            latLng, 
            new google.maps.LatLng(currentStation.coordinates.lat, currentStation.coordinates.lng)
        );
        currentStation.distance = dist;
        stationsWithDistance.push(currentStation);

    }
    stationsWithDistance.sort((a, b) => {
        return a.distance - b.distance;
    });
    console.log(stationsWithDistance);

    return stationsWithDistance.slice(0, count);
}

