$(function() {
    $('#slider').slider({
	value:1000,
	min: 50,
	max: 5000,
	slide: function(event, ui) {
	    searchArea.setRadius(ui.value);
	}
    });
});

$(document).ready(function() {
    $('form#radius').submit(function(event) {
	event.preventDefault();

	for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(null);
	}
	
	markers = [];
	$('#results').empty();
	
	var data = {};

	data['lat'] = $('#formLat').val();
	data['lng'] = $('#formLng').val();
	data['radius'] = $('#formRadius').val();

	$.ajax({
	    'type': 'POST',
	    'data': JSON.stringify(data),
	    'url': '/',
	    'dataType': 'JSON',
	    'contentType': 'application/json',
	    'success': function(data, textStatus, jqXHR) {
		handleData(data);
	    },
	    'error': function(jqXHR, textStatus, errorThrown) {
		alert(errorThrown);
	    }
	});
    });
});
