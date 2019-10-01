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

export default StationService;