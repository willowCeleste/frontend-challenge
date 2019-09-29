const init = () => {
    $.get( "https://dkw6qugbfeznv.cloudfront.net", function( data ) {
        populateStationsList(data.features);
  });
}



// get closest stations by coordinates
const getStations = () => {
    console.log('get closest stations');
    $('#stations-list').append('<li>station</li>');
}


const populateStationsList = (stationsArray) => {
    $(document).ready(() => {
        for (var i = 0; i < stationsArray.length; i++) {
            $('#stations-list').append(`<li>${stationsArray[i].properties.name}</li>`);
        }
        
    });
}


populateStationsList();

init();