'use strict';

const StationService = () => {
    const apiUrl = 'https://dkw6qugbfeznv.cloudfront.net';
    return {
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
    return {
        initMap: bounds => this.drawMap(bounds),
        drawMap: (coordinates) => {
            if (coordinates) {
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
        },
        addMarkers: (map, stations, address, addressCoordinates) => {
            for (var i = 0; i < stations.length; i++) {
                let infoWindowContent = StationItem(stations[i]);
                
                let infowindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });
                
                let marker = new google.maps.Marker({
                    position: stations[i].coordinates,
                    map: map,
                    title: stations[i].name
                }); 

                marker.addListener('click', () => {
                    infowindow.open(map, marker)
                });
            }
            let addressMarker = new google.maps.Marker({
                position: addressCoordinates,
                map: map,
                title: address,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                }
            });
        },
        getClosestStations: (latLng, stations, count) => {
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
            return stationsWithDistance.slice(0, count);
        },
        getLocationFromAddress: (address) => {
            return $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
           
        }   
    };
}

const WeatherService = () => {
    const apiKey = 'fc5fec7999f7c9bba87c200421b27230';
    const cityId = '4560349'
    const apiUrl = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=imperial`;
    
    const Weather = (data) => {
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            shortDescription: data.weather[0].main,
            icon: data.weather[0].icon,
            weatherId: data.weather[0].id
        }
    }

    const getWeather = () => {
        return $.getJSON(apiUrl);
    }
    
    return {
        Weather, 
        getWeather
    }
}

const WeatherHeader = (weather) => {
    let iconPath = `http://openweathermap.org/img/wn/${weather.icon}.png`;

    return `
        <div class='weather ${weather.weatherId < 800 ? "alert" : ""}'>
            <img src='${iconPath}' />
            <span>${Math.floor(weather.temperature)}&#176;</span>
            <span>&nbsp;${weather.description}</span>
        </div>
    `;
}

const StationItem = (station) => {
    let openDocksPercentage = Math.floor((station.docksAvailable / station.totalDocks) * 100);
    let availableBikesPercentage = Math.floor((station.bikesAvailable / station.totalDocks) * 100);
    const determineScarcityColor = percentage => {
        if (percentage <= 25) {
            return 'red';
        }
        if (percentage > 25 && percentage < 50) {
            return 'orange';
        }
        return 'green';
    }
    
    return `
        <div class='item-station'>
            <div class='station-name'>${station.name}</div>
            <p class=${determineScarcityColor(availableBikesPercentage)}>${station.bikesAvailable} bikes available</p>
            <p class=${determineScarcityColor(openDocksPercentage)}>${station.docksAvailable} out of ${station.totalDocks} docks available</p>                 
        <div>
    `
}

const stationService = StationService();
const mapService = MapService();
const weatherService = WeatherService();

let stations;
let mappedStations;
let map;
let weather;

$(document).ready(function() {
    weather = weatherService.getWeather();
    weather
        .done(currentWeather => {
            $('#weather-container').append(WeatherHeader(weatherService.Weather(currentWeather)));
        })
        .fail((error) => {
            console.log(error.responseJSON.message);
            $('#weather-container').append('<div class="weather-error">Failed to load weather info. Ride carefully!</div>');
        });

    stations = stationService.getStations();
    stations
        .done(stations => {
            mappedStations = stationService.mapStations(stations.features)
            
            initMap(mappedStations.map(station => {
                return station.coordinates;
            }));
            mapService.addMarkers(map, mappedStations);
         })
         .fail((error) => {
            console.log(error);
            drawMap();
            $('.map-error').removeClass('hidden');
         });

    $('#map-button').click(() => {
        let address = $('#address-input').val();
        mapService.getLocationFromAddress(address)
            .done(result => {  
                console.log(result);
                let coordinates = result.results[0].geometry.location; 
                let closestStations = mapService.getClosestStations(new google.maps.LatLng(coordinates.lat, coordinates.lng), mappedStations, 5);
                drawMap(closestStations.map(closeStation => {
                    return closeStation.coordinates;
                }));
                mapService.addMarkers(map, closestStations, result.results[0].formatted_address, coordinates);
            })
    })
});

const initMap = (bounds) => drawMap(bounds);

const drawMap = (coordinates) => {
    if (coordinates) {
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
