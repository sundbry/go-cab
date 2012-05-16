/* GoCab
 * Copyright 2012 by Ryan Sundberg
 */

var gocab = {

	defaultZoom: 17,
	
	error: function(msg) {
		alert(msg);
	},

	go1: {
		
		placeError: {},


		init: function() {
			gocab.go1.initMaps();
			gocab.go1.initDateTimePickup();
			gocab.go1.initFormSubmit();
		},

		initMaps: function() {
			var defaultOptions = {
				//center: new google.maps.LatLng(-34.397, 150.644),
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var mapDest = new google.maps.Map(document.getElementById("map-canvas-dest"), defaultOptions);
			var mapPickup = new google.maps.Map(document.getElementById("map-canvas-pickup"), defaultOptions);
			var inputDest = $("#go-search-dest");
			var inputPickup = $("#go-search-pickup");

			var placeCB = function(map, place, inputGC) {
				if(place != null) {
					if(place.geometry == undefined) {
						gocab.go1.placeError[inputGC.attr('name')] = 'Unknown location: '+place.name;
					}
					else {
						gocab.go1.placeError[inputGC.attr('name')] = null;

						if(place.geometry.viewport) {
							map.fitBounds(place.geometry.viewport);
						}
						else {
							map.setCenter(place.geometry.location);
							map.setZoom(gocab.defaultZoom);
						}
						var marker = new google.maps.Marker({
							'map': map,
							'position': place.geometry.location
						});

						var infowindow = new google.maps.InfoWindow();
						var marker = new google.maps.Marker({
							map: map
						});
						/*
						var image = new google.maps.MarkerImage(
							place.icon,
							new google.maps.Size(71, 71),
							new google.maps.Point(0, 0),
							new google.maps.Point(17, 34),
							new google.maps.Size(35, 35));
							marker.setIcon(image);
							marker.setPosition(place.geometry.location);
						*/

						var address = '';
						if (place.address_components) {
							address = [
								(place.address_components[0] &&
								place.address_components[0].short_name || ''),
								(place.address_components[1] &&
								place.address_components[1].short_name || ''),
								(place.address_components[2] &&
								place.address_components[2].short_name || '')
							].join(' ');
						}

						infowindow.close();
						infowindow.setContent('<div><strong>' + place.name + '</strong><br />' + address);
						infowindow.open(map, marker);
					}
				}
				inputGC.val(place == null ? 'loading' : (place.geometry == null ? 'error' : place.geometry.location));
			} 

			var destCB = function(map, place) {
				return placeCB(map, place, $("#go-search-dest-gc"));
			}
			var pickupCB = function(map, place) {
				return placeCB(map, place, $("#go-search-pickup-gc"));
			} 

			gocab.go1.loadAddress(mapDest, inputDest.val(), destCB);
			gocab.go1.loadAddress(mapPickup, inputPickup.val(), pickupCB);
			gocab.go1.initMapsAutoComplete(mapDest, inputDest, destCB);
			gocab.go1.initMapsAutoComplete(mapPickup, inputPickup, pickupCB);
		},

		initMapsAutoComplete: function(map, input, placeCallback) {
			// code adapted from https://google-developers.appspot.com/maps/documentation/javascript/examples/places-autocomplete
			input = input.get(0); // get native DOM object
			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', map);

			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				var place = autocomplete.getPlace();

				placeCallback(map, place);
			});
		},

		loadAddress: function(map, address, placeCallback) {
			placeCallback(null);
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{'address': address},
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						placeCallback(map, results[0]);
					}
					else {
						gocab.error("Geocode was not successful for the following reason: " + status);
					}
				}
			);
		},

		initDateTimePickup: function() {
			var now = new Date();
			var minDate = new Date(now);
			minDate.setDate(0);
			minDate.setHours(0);
			minDate.setMinutes(0);
			
			var maxDate = new Date(now.getTime() + (86400000 * 30));
			maxDate.setHours(23);
			maxDate.setMinutes(59);

			$("#go-datetime-pickup").scroller($.extend({
					preset: 'datetime',
					'minDate': minDate,
					'maxDate': maxDate,
					stepMinute: 5
				}, {
					theme: 'jqm',
					mode: 'mixed'
				})).scroller('setDate', now, true);
		},

		initFormSubmit: function() {
			$("#go-1").bind('submit', function() {
				$.mobile.showPageLoadingMsg();
				var inputDestGC = $("#go-search-dest-gc");
				var inputPickupGC = $("#go-search-pickup-gc");

				while(inputDestGC.val() == 'loading');
				while(inputPickupGC.val() == 'loading');

				if(inputDestGC.val() == 'error' || inputPickupGC.val() == 'error') {
					$.mobile.hidePageLoadingMsg();
					var error = gocab.go1.placeError[inputDestGC.attr('name')];
					if(error == null) {
						error = gocab.go1.placeError[inputPickupGC.attr('name')];
					}
					gocab.error(error);
					return false;
				}

				var values = $("#go-1").serialize();
				$.post("go-process.php", values, function(re, textStatus) {
					if(re.mode == 'ok') {
						/*
						re = {
							mode: 'ok',
							continuePost: string
						}
						*/
						$.mobile.changePage("go-2.php", {
							type: 'post',
							data: re.continuePost});
						
					}	
					else {
						/*
						re = {
							mode: 'error',
							errorLabels: [string],
							errorMessage: string
						}
						*/
						$.mobile.hidePageLoadingMsg();

						var firstSection = null;
						$.each(re.errorLabels, function(idx, name) {
							var lbl = $('label[for='+name+']');
							var input = $('#'+name);
							lbl.addClass('error');
							input.addClass('error');
							firstSection = lbl.closest('div[data-role=collapsible]');
						});

						if(firstSection != null) {
							firstSection.trigger('expand');
						}

						if(re.errorMessage != '') {
							gocab.error(re.errorMessage);
						}
					}
				}, 'json').error(function() {
					$.mobile.hidePageLoadingMsg();
					gocab.error('Server error, please try again.');
				});

				return false;
			});
		}


	} // go1

}

$('#go-1').live('pageinit', gocab.go1.init);

