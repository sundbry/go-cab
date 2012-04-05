/* GoCab
 * Copyright 2012 by Ryan Sundberg
 */

var gocab = {
	
	error: function(msg) {
		alert(msg);
	},

	go1:  {

		init: function() {
			var defaultOptions = {
				//center: new google.maps.LatLng(-34.397, 150.644),
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var mapDest = new google.maps.Map(document.getElementById("map-canvas-dest"), defaultOptions);
			var mapPickup = new google.maps.Map(document.getElementById("map-canvas-pickup"), defaultOptions);
			var inputDest = $("#go-search-dest");
			var inputPickup = $("#go-search-pickup");
			gocab.go1.loadAddress(mapDest, inputDest.val());
			gocab.go1.loadAddress(mapPickup, inputPickup.val());
			$("input[name=go-message-mode]").bind('change', gocab.go1.changeMessageMode);
		},

		loadAddress: function(map, address) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{'address': address},
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
							'map': map,
							'position': results[0].geometry.location
						});
					}
					else {
						gocab.error("Geocode was not successful for the following reason: " + status);
					}
				}
			);
		},

		changeMessageMode: function(evt) {
			var tgt = $(evt.target);
			//alert(tgt.attr('checked'));
			if(tgt.is(':checked')) {
				var val = tgt.val();
				alert(val);
			}
		}

	} // go1



}

