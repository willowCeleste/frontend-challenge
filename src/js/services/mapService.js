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