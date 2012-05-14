/* GoCab
 * Copyright 2012 by Ryan Sundberg
 */

var gocab = {
	
	error: function(msg) {
		alert(msg);
	},

	go1: {

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
			gocab.go1.loadAddress(mapDest, inputDest.val());
			gocab.go1.loadAddress(mapPickup, inputPickup.val());
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
					gocab.error('Server error, please try again.');
				});

				return false;
			});
		}


	} // go1

}

$('#go-1').live('pageinit', gocab.go1.init);

