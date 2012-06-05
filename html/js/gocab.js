/* GoCab
 * Copyright 2012 by Ryan Sundberg
 */

var gocab = {

	defaultZoom: 15,
	
	error: function(msg) {
		alert(msg);
	},

	location: {
		isSpecificLocation: function(place) {
			return place.geometry != undefined && 
				// known address
				(place.geometry.location_type == 'ROOFTOP'
				// known establishment
				|| place.types.indexOf('establishment') >= 0
				// precise address
				|| (place.types.indexOf('street_address') >= 0 && place.geometry.bounds == undefined));
		},

		makeFullAddress: function(place) {
			return place.formatted_address;
			/*
			var address = '';
			if(place.address_components) {
				address = [(place.address_components[0] &&
					place.address_components[0].short_name || ''),
					(place.address_components[1] &&
					place.address_components[1].short_name || ''),
					(place.address_components[2] &&
					place.address_components[2].short_name || '')
					].join(' ');
			}
			return address;
			*/
		}
	},

	go1: {
		
		placeError: {},
		kCurrentPosTimeout: 10000,

		init: function() {
			gocab.go1.initMaps();
			gocab.go1.initDateTimePickup();
			gocab.go1.initFormSubmit();
		},

		initMaps: function() {
			var defaultOptions = {
				//center: new google.maps.LatLng(-34.397, 150.644),
				zoom: gocab.defaultZoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var mapDest = new google.maps.Map(document.getElementById("map-canvas-dest"), defaultOptions);
			var mapPickup = new google.maps.Map(document.getElementById("map-canvas-pickup"), defaultOptions);
			mapDest.posMarker = null;
			mapPickup.posMarker = null;
			var inputDest = $("#go-search-dest");
			var inputPickup = $("#go-search-pickup");

			var placeCB = function(map, place, inputGC, requireSpecificLocation) {
				var error = null;
				if(place != null) {
					if(inputGC.attr('rel') == 'use-current-gc') {
						return;
					}
					console.log(place);
					if(place.geometry == undefined) {
						error = 'Unknown location: '+place.name;
					}
					else {
						if(requireSpecificLocation && !gocab.location.isSpecificLocation(place)) {
							error = 'Please choose a more specific location: '+gocab.location.makeFullAddress(place);
						}

						if(place.geometry.viewport) {
							map.fitBounds(place.geometry.viewport);
						}
						else {
							map.setCenter(place.geometry.location);
							map.setZoom(gocab.defaultZoom);
						}

						var image = new google.maps.MarkerImage(
							place.icon,
							new google.maps.Size(71, 71),
							new google.maps.Point(0, 0),
							new google.maps.Point(17, 34),
							new google.maps.Size(35, 35));

						if(map.posMarker != null) {
							map.posMarker.setMap(null);
						}

						map.posMarker = new google.maps.Marker({
							'map': map,
							'position': place.geometry.location,
							'icon': image
						});
					}
				}
				gocab.go1.placeError[inputGC.attr('name')] = error;
				inputGC.val(place == null ? 'loading' : (error == null ? place.geometry.location : 'error'));
			} 

			var destCB = function(map, place) {
				return placeCB(map, place, $("#go-search-dest-gc"), false);
			}
			var pickupCB = function(map, place) {
				return placeCB(map, place, $("#go-search-pickup-gc"), true);
			} 

			gocab.go1.initMapsAutoComplete(mapDest, inputDest, destCB);
			gocab.go1.initMapsAutoComplete(mapPickup, inputPickup, pickupCB);

			inputPickup.attr('placeholder', 'Loading...');

			var currentPosError = function() {
				inputPickup.attr('placeholder', '');
				gocab.error('Unable to determine your current location.');
			};

			navigator.geolocation.getCurrentPosition(function(position) {
					// success
					console.log('done');
					var latLng = new google.maps.LatLng(position.coords.latitude,
						position.coords.longitude);
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode(
						{'latLng': latLng},
						function(results, statusCode) {
							if(statusCode == google.maps.GeocoderStatus.OK) {
								inputPickup.attr('placeholder', '');
								var place = results[0];

								mapDest.setCenter(place.geometry.location);
								mapDest.setZoom(gocab.defaultZoom);

								inputPickup.val(gocab.location.makeFullAddress(place));
								pickupCB(mapPickup, place);

								var inputPickupGC = $("#go-search-pickup-gc");
								inputPickupGC.attr('rel', 'use-current-gc');
								inputPickup.change(function() {
									inputPickupGC.attr('rel', '');
								});
							}
							else {
								currentPosError();
							}
						});
				}, currentPosError, {enableHighAccuracy: true, timeout: gocab.go1.kCurrentPosTimeout});
		},

		initMapsAutoComplete: function(map, input, placeCallback) {
			// code adapted from https://google-developers.appspot.com/maps/documentation/javascript/examples/places-autocomplete
			var domInput = input.get(0); // get native DOM object

			input.keypress(function(evt) {
				if(evt.which == 13) {
					evt.preventDefault();
				}
			});

			var autocomplete = new google.maps.places.Autocomplete(domInput, { });
			autocomplete.bindTo('bounds', map); // bias results towards the current map area

			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				console.log('place_changed');
				var place = autocomplete.getPlace();
				placeCallback(map, place);
			});
		},

		loadAddress: function(map, address, placeCallback) {
			placeCallback(null);
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{'address': address},
				function(results, statusCode) {
					if (statusCode == google.maps.GeocoderStatus.OK) {
						placeCallback(map, results[0]);
					}
					else {
						gocab.error("Geocode was not successful for the following reason: " + statusCode);
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

			var next5Min = 5 - (now.getMinutes() % 5);
			if(next5Min > 0) {
				now = new Date(now.getTime() + (60000 * next5Min));
			}

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
				var errorSection = null;
				var inputDestGC = $("#go-search-dest-gc");
				var inputPickupGC = $("#go-search-pickup-gc");

				while(inputDestGC.val() == 'loading');
				while(inputPickupGC.val() == 'loading');

				if(inputDestGC.val() == 'error' || inputPickupGC.val() == 'error') {
					$.mobile.hidePageLoadingMsg();
					var error = gocab.go1.placeError[inputDestGC.attr('name')];
					if(error == null) {
						error = gocab.go1.placeError[inputPickupGC.attr('name')];
						errorSection = inputPickupGC;
					}
					else {
						errorSection = inputDestGC;
					}
					errorSection = errorSection.closest('div[data-role=collapsible]');
					errorSection.trigger('expand');
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
							type: 'get',
							data: {
								'continue': re.continuePost
							}
						});
						
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

						$("label.error, input.error").each(function(idx, node) {
							$(node).removeClass('error');	
						});

						$.each(re.errorLabels, function(idx, name) {
							var lbl = $('label[for='+name+']');
							var input = $('#'+name);
							if(lbl.length > 0)
								lbl.addClass('error');
							if(input.length > 0) 
								input.addClass('error');
							if(errorSection == null) {
								errorSection = (lbl.length > 0 ? lbl : input).closest('div[data-role=collapsible]');
							}
						});

						if(errorSection != null) {
							$(errorSection).trigger('expand');
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


	}, // go1

	go2: {
		init: function() {
		}
	},

	go3confirm: {
		init: function() {
			$('#go-3-confirm.ui-dialog').on('pagehide', gocab.go3confirm.abort);
			$('#go-3-confirm .go-3-abort button').click(function() {
				$('#go-3-confirm').dialog('close');
			});
		},

		abort: function() {
		}

	},

	go3: {

		timeStart: 0,
		waitTimer: null,
		maxWait: 600, // time out after 10 minutes 
		orderNumber: null,

		init: function() {
			gocab.go3.orderNumber = $("#order-number").val();
			$('#go-3.ui-dialog').on('pagehide', gocab.go3.abort);
			$('#go-3 .go-3-abort button').click(function() {
				$('#go-3').dialog('close');
			});
			gocab.go3.timeStart = (new Date).getTime();
			gocab.go3.runTimer();
			gocab.go3.waitDispatchResponse();
		},

		abort: function() {
			if(gocab.go3.waitTimer != null) {
				window.clearTimeout(gocab.go3.waitTimer);
			}
		},

		runTimer: function() {
			var diff = Math.round(((new Date).getTime() - gocab.go3.timeStart) / 1000);

			gocab.go3.waitTimer = null;

			if(diff > gocab.go3.maxWait) {
				gocab.error('Gave up after no dispatch response in ' + Math.round(gocab.go3.maxWait / 60) + ' minutes.');
				gocab.go3.abort();
				return;
			}

			var secs = diff % 60;
			$("#waiting-time").html(Math.floor(diff / 60) + ':' + (secs < 10 ? '0' : '') + secs);
			gocab.go3.waitTimer = window.setTimeout(gocab.go3.runTimer, 1000);
		},

		waitDispatchResponse: function() {
			$.ajax({
				url: 'go-3-wait.php',
				type: 'POST',
				data: { 'order': gocab.go3.orderNumber },
				success: gocab.go3.dispatchResponse,
				dataType: 'json',
				timeout: 30000
			});
		},

		dispatchResponse: function(re) {
			switch(re.mode) {
				case 'accept':
				case 'reject':
					$.mobile.changePage("go-4.php", {
						type: 'get',
						data: {
							'order': gocab.go3.orderNumber
						}
					});
					break;

				case 'wait':
					gocab.go3.waitDispatchResponse();
					break;

				case 'error':
					gocab.go3.abort();
					gocab.error(re.errorMessage);
					break;

				default:
					gocab.go3.abort();
					gocab.error(re);
					break;
			}
		}
	}

}

$('#go-1').live('pageinit', gocab.go1.init);
$('#go-2').live('pageinit', gocab.go2.init);
$('#go-3-confirm').live('pageinit', gocab.go3confirm.init);
$('#go-3').live('pageinit', gocab.go3.init);

