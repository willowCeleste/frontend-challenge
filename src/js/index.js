const stationService = StationService();
const mapService = MapService();
const weatherService = WeatherService();

$(() => {
    let stations;
let mappedStations;
let map;
let weather;

let defaultMapCoordinates = {lat: 39.952583, lng: -75.165222};

$(document).ready(() => {
    
    weather = weatherService.getWeather();
    weather
        .done(currentWeather => {
            $('#weather-container').append(WeatherHeader(weatherService.Weather(currentWeather)));
        })
        .fail((error) => {
            console.log(error.responseJSON.message);
            showError("Error: Couldn't retrive weather data")
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
         .fail(error => {
            drawMap();
            console.log(error);
            showError("Error: Couldn't get station info from Indego");
         });

    $('#search-button').on('click', searchForStations);
    $('#address-input').on('keypress', e => {
        if (e.keyCode === 13) {
            searchForStations();
        }
    });
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
            center: defaultMapCoordinates,
            zoom: 13
        });
    }
    return map;
}

const searchForStations = () => {
    let address = $('#address-input').val();
    
    mapService.getLocationFromAddress(address)
        .done(result => {  
            let coordinates = result.results[0].geometry.location; 
            let closestStations = mapService.getClosestStations(new google.maps.LatLng(coordinates.lat, coordinates.lng), mappedStations, 5);
            drawMap(closestStations.map(closeStation => {
                return closeStation.coordinates;
            }));
            mapService.addMarkers(map, closestStations, result.results[0].formatted_address, coordinates);
        })
        .fail(error => {
            console.log(error);
            showError("Error getting address location");
        })
}

const showError = (message) => {
    console.log('show error');
    $('#errors-container').append(ErrorMessage(message));
    setTimeout(() => {
        $('.error').animate({opacity: "0"});
    }, 4000)
    
    
}
});

