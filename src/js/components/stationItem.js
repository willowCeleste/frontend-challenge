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