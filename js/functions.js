/*
Date creation: 19/06/2017
Author: University of Reading (E. Mathieu, A. Prata)
Purpose: This file contains all the functions to display the ash concentration, dosage, risk matrix, flight information, etc.

Last edit: 5/3/2018

*/
//****************************************************
//TEST IF USER DISPLAY CAN CORRECTLY DISPLAY THE TOOL (SCREEN SIZE, NAVIGATOR VERSION...)
//****************************************************
function testdisplay(){
	console.log("screen width: " + screen.width);
	if (screen.width < 950){
		window.alert("Your screen is too small to correctly display this tool. Please find another PC to use it.");
		return false;
	}
	var isHtml5Compatible = document.createElement('canvas').getContext != undefined;
	console.log("isHtml5Compatible: " + isHtml5Compatible);
	if (!isHtml5Compatible){
		window.alert("Your web browser is too old and cannot correctly display html5 elements. Please choose another browser.");
		return false;
	}
	return true;
}


//****************************************************
//READ PARAMETERS PASSED IN URL
//****************************************************
function getParameter(theParameter) {
  var params = window.location.search.substr(1).split('&');

  for (var i = 0; i < params.length; i++) {
    var p=params[i].split('=');
	if (p[0] == theParameter) {
	  return decodeURIComponent(p[1]);
	}
  }
  return false;
}

//****************************************************
//OPEN AND CLOSE THE SURVEY
//****************************************************
function openCloseSurvey(){
	if ($('#survey').css('right') == '0px'){
		$('#survey').animate({right: '-500px'});
		$('#openCloseSurvey').text('<');
	}
	else{
		$('#survey').animate({right: '0px'});
		$('#openCloseSurvey').text('X');
	}
}

//****************************************************
// DISPLAY MAP
//****************************************************
function displaymap(selecttime){
	if (typeof mymap !== 'undefined'){
		mymap.remove();
	}

	overlays = {};//map layers
	assetLayerGroup = new L.LayerGroup();
	//****************************************************
	//DEFINE THE MAP
	/* var MapLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 7,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	});*/

	/*var MapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		maxZoom: 16
	});
	*/
	MapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXByYXRhIiwiYSI6ImNqMzhvMnE4ODAwNDYycW85c3I0bXJpcmgifQ.MDzb_S0tvdQWHwG-FCggwQ', {
	//MapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/aprata/cjd1hmzy82h4z2rpn4tlv1gbm/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXByYXRhIiwiYSI6ImNqMzhvMnE4ODAwNDYycW85c3I0bXJpcmgifQ.MDzb_S0tvdQWHwG-FCggwQ', {

		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		  maxZoom: 18,
			detectRetina: true,
	});
	/*
	var MapLayer2 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXByYXRhIiwiYSI6ImNqMzhvMnE4ODAwNDYycW85c3I0bXJpcmgifQ.MDzb_S0tvdQWHwG-FCggwQ', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a> | University of Reading',
		  maxZoom: 18,
			detectRetina: true,
	});

	var MapLayer3 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXByYXRhIiwiYSI6ImNqMzhvMnE4ODAwNDYycW85c3I0bXJpcmgifQ.MDzb_S0tvdQWHwG-FCggwQ', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a> | University of Reading',
		  maxZoom: 18,
			detectRetina: true,
	});

	var MapLayer4 = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXByYXRhIiwiYSI6ImNqMzhvMnE4ODAwNDYycW85c3I0bXJpcmgifQ.MDzb_S0tvdQWHwG-FCggwQ', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a> | University of Reading',
		  maxZoom: 18,
			detectRetina: true,
	}); */


	//CREATE THE MAP
	mymap = L.map('mapid', {  //mymap becomes a global variable
		//center map on center of north atlantic location
		center: [53, -31],
		zoom: 4,
			detectRetina: true,
		layers: [MapLayer],
		highlight: true
	});



	//Add volcano details
	addVolcano();


	//ADD LAYERS
	addflights(selecttime);
	//addash(selecttime,displayash);
	addwind(selecttime,displaywind);
	if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
		addrisk(selecttime,displayrisk);
		$('#divriskmatrix').show();
	}
	else {
		addagreement(selecttime,displayagree);
		$('#divriskmatrix').hide();
	}
	// add control run contour layer
	addcontrol(selecttime,displaycontrol);
	addcontrollers();
	//center map on flights:
	//mymap.fitBounds(flightlayers[displayedflight].getBounds(),{paddingTopLeft:[50,50],paddingBottomRight:[50,50]});


	// ADD MAP COORDINATES ON MOUSE OVER
	L.control.coordinates({
		position:"topright",
		//useDMS:true,
		decimals:2,
		labelTemplateLat:"{y}°N, ",
		labelTemplateLng:"{x}°E",
		useLatLngOrder:true
	}).addTo(mymap);

	//ADD INFO BOX ON THE MAP (to display ash concentration, or agreement, or risk level)
	info = L.control(); //global variable. This field can be modified from other functions...
	info.onAdd = function (mymap) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};
	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = props;
	};
	info.addTo(mymap);


	//************************************************
	//ADD LEGEND
	/* Used when displaying the ash concentration:
	function getColor(d) {
		return d > 1000 ? '#800026' :
			   d > 500  ? '#BD0026' :
			   d > 200  ? '#E31A1C' :
			   d > 100  ? '#FC4E2A' :
			   d > 50   ? '#FD8D3C' :
			   d > 20   ? '#FEB24C' :
			   d > 10   ? '#FED976' :
						  '#FFEDA0';
	}
	legendAshDosageContent += "<table><tr><td colspan='2' class='small'>FL350</td></tr><tr><td rowspan='2'><img src='./img/greyscale.jpg'></td><td valign='top'>"+ash[0].legendmax+" mg m<sup>-3</sup></td></tr><tr><td valign='bottom'>0 mg m<sup>-3</sup></td></tr>";
	// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			legendAshDosageContent +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}*/
	L.Legend = L.Control.extend({
		'onAdd': function (map) {
			// add reference to mapinstance
			map.legend = this;

			// create container
			var container = L.DomUtil.create('div', 'info legend');

			if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
				//container.innerHTML = legendRiskContent;
				$('.risk').css("font-weight", 'bold');
				$('.agreement').css("font-weight", 'normal');
			}
			else {
				// make agreement legend click on and off when selecting agreement map from layer selector.
				$('.leaflet-control-layers-selector').click(function(){
					if(mymap.hasLayer(agreement_layer)) {
						$('#divragreementlegend').show();
					} else {
						$('#divragreementlegend').hide();
					}
				});
				$('.risk').css("font-weight", 'normal');
				$('.agreement').css("font-weight", 'bold');
			}
			return container;
		},
		// new method for updating innerHTML. Not used as of 03/03/2018
		'updateContent': function(str) {
			if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
				//this.getContainer().innerHTML = legendRiskContent;
				$('.risk').css("font-weight", 'bold');
				$('.agreement').css("font-weight", 'normal');
			}
			else {
				this.getContainer().innerHTML = legendAgreementContent;
				$('.risk').css("font-weight", 'normal');
				$('.agreement').css("font-weight", 'bold');
			}
			return container;
		},
	});
	var legend = L.control({position: 'bottomright'});
	/*legend.onAdd = function (map) {
		div = L.DomUtil.create('div', 'info legend');
		if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
			div.innerHTML = legendRiskContent;
		}
		else {
			div.innerHTML = legendAgreementContent;
		}

		return div;
	};*/
	//legend.addTo(mymap);
	mymap.addControl(new L.Legend({
    'position': 'bottomright',
    'content': new Date
	}));


	// add Reading logo to map
	logo = L.control({position: 'bottomleft'});
	logo.onAdd = function (map) {
		div = L.DomUtil.create('div', 'info logo');
		div.innerHTML = '<img src="./img/logo-Reading.png">';
		return div;
	};
	logo.addTo(mymap);


	//Listener on mouse above: display agreement percentage or risk level
	mymap.on('mousemove', function(e){
		if ($('#riskOnMap').prop('checked')){
			var riskindex = getclosestpoint(risk[timeid].y,risk[timeid].x,e.latlng.lat,e.latlng.lng,risk[0].gridres);
			var riskdisp = risk[timeid].z[riskindex];
		}
		else{
			//TO BE DONE: Create table with x and table with y
			var pathx = [];
			var pathy = [];
			for ( var i=0; i<=flights[displayedflight].risk.length; i++ ){
				pathx[i] = flights[displayedflight].path[i][1];
				pathy[i] = flights[displayedflight].path[i][0];
			}

			var riskindex = getclosestpoint(pathy,pathx,e.latlng.lat,e.latlng.lng,1);
			var riskdisp = flights[displayedflight].risk[riskindex];
		}
		var agreementindex = getclosestpoint(agreement[agreementid].y,agreement[agreementid].x,e.latlng.lat,e.latlng.lng,agreement[0].gridres);
		if (agreementindex == -1) {
			agreementdisp = '-';
		} else {
			var agreementdisp = agreement[agreementid].z[agreementindex];
			// round the concentration to a precision of 2
			agreementdisp = agreementdisp.toFixed(1);
		}

		if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
			info.update('Risk level = ' + riskdisp);
			moveriskmatrixpointer(risklegendcoordx[riskdisp-1],risklegendcoordy[riskdisp-1]);
		}
		else {
			info.update('Agreement = ' +  agreementdisp + '%');
		}
	});
}


//*******************************************************
//Listener on map click: load different flight path data
//****************************************************
function clicklistener(){
	mymap.eachLayer(function(layer) {
	  layer.on('click', function(){
		/*mymap.eachLayer(function(layer){
			layer.setStyle(lowlight);
		});*/
		this._map._layers[activlayer].setStyle(lowlight);

		//console.log('dataId: '+this.dataId);
		//this._map._layers.setStyle(lowlight);
		mymap.eachLayer(function(lay){
			//lay.setStyle(lowlight);
		});
		this.setStyle(highlight);
		activlayer=this._leaflet_id;
		displayedflight = mymap._layers[activlayer].dataId;
		//console.log(this);
		console.log('displayedflight: '+displayedflight);

		displayflightparam(displayedflight); //update flight info
		updatedevac(displayedflight);

		updatecrosssection(displayedflight);

		updatedosagegraph(displayedflight);


	  })
	});
}


//****************************************************
//ADD LAYERS CONTROLLERS (TOP-LEFT)
//****************************************************
// If we want to switch between different maps, or different layers
function addcontrollers(){
	var baseMaps = {
		"Mapbox Light": MapLayer,
			//"Mapbox Dark": MapLayer2,
			//"Mapbox Streets": MapLayer3,
			//"Mapbox Satellite": MapLayer4,
	};

	controllers = L.control.layers(baseMaps, overlays, {position: 'topleft'}).addTo(mymap);

}


//*******************************************************
//ADD VOLCANO DETAILS
//****************************************************
function addVolcano(){
	//**************************************
	// MAKE VOLCANO ICON + ASSOCIATED INFO
	var volcanoIcon = L.icon({
	  iconUrl: 'http://maps.google.com/mapfiles/kml/shapes/volcano.png',
	  iconSize: [22, 24]
	});
	// create popup contents
	/*var customPopup = "<b>My office</b><br/><img src='http://netdna.webdesignerdepot.com/uploads/2014/05/workspace_06_previo.jpg' alt='maptime logo gif' width='150px'/>";
	// specify popup options
	var customOptions =
	    {
	    'maxWidth': '400',
	    'width': '200',
	    'className' : 'popupCustom'
	    }
	*/
	var espPopup = "<b>Eruption Source Parameters (Control Run)</b><hr>Volcano: Katla (63.63°N, 19.08°W)<br>Source timing: 2017-01-01 03:00 UTC<br>Plume height: 15 km (a.s.l.)<br>Source duration: 16 h<br>Mass eruption rate factor: 1<br>Distal fine ash fraction: 5%";
	var espOptions =
	    {
	    'maxWidth': '400',
	    'width': '200',
	    'className' : 'popupESPs'
			};

	var vlat = 63.633;
	var vlon = -19.083;
	var volcanoMarker = L.marker([vlat, vlon], {icon: volcanoIcon});
	volcanoMarker.addTo(mymap).bindPopup(espPopup,espOptions);
	/*
	// add a triangle
	var vlat = 63.633333;
	var vlon = -19.05;
	var dx=0.5;
	var dy=0.25;
	var triangle = L.polygon([
		[vlat-dy, vlon-dx],
		[vlat+dy, vlon],
		[vlat-dy, vlon+dx]
	]).addTo(mymap, {'weight': 1});
	triangle.bindPopup("<b>Eruption Source Paremeters</b><br>Volcano: Katla<br>Plume height: 15 km<br>Source duration: 24 h<br>Source timing: 2017-01-01 03:00 UTC");
	*/
}

//****************************************************
// FLIGHT PATHS DISPLAY
//****************************************************
function addflights(selecttime){
	var flightpath = [];
	flightlayers = [];
	flightlayers_dec = [];
	var firstflighttodisplay = -1;
	for(var i= 0; i < flights.length; i++)
	{
		if (flights[i].timeid == selecttime){ //display only the flights that are at the correct time
			var pathcolor = 'grey';
			if (firstflighttodisplay == -1) { //take the id of the first flight at this time step. So we highlight it.
				firstflighttodisplay = i;
				displayedflight = i;
				pathcolor = 'red';
			}
			flightpath = flights[i].path;
			for (k = 0; k < flightpath.length; ++k) { //Add the risk level to the flightpath variable
				flightpath[k].risk = flights[i].risk[k];
			}
			//flightlayers[i] = L.polyline(flightpath, {color: pathcolor}).addTo(mymap);

			if (( $('#riskselected').prop('checked') ) && ( $('#riskOnRoute').prop('checked') ) ){
				var polyline = L.multiOptionsPolyline(flightpath, {
				multiOptions: {
					optionIdxFn: function (flightpath) {
								//console.log("flightrisk: "+flightrisk);
						var j,
							riskThresholds = [0.5, 5, 7];

						for (j = 0; j < riskThresholds.length; ++j) {
							if (flightpath.risk <= riskThresholds[j]) {
								return j;
							}
						}
						return riskThresholds.length;
					},
					options: [
						{color: '#727682'}, {color: '#fffa8b'}, {color: '#feb24c'}, {color: '#e56b5d'}
					]
				},
				weight: 5,
				lineCap: 'butt',
				opacity: 0.75,
				smoothFactor: 1} ).addTo(mymap);
			}
			else {
				var polyline = L.polyline(flightpath, {color: pathcolor}).addTo(mymap);
			}
			var decorator = L.polylineDecorator(
				flightpath,
				{
					patterns: [
						//{ offset: 0, repeat: 10, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {color: pathcolor, weight: 2, opacity: 0.6}}) },
						{ offset: '16%', repeat: '50%', symbol: L.Symbol.marker({rotate: true, markerOptions: {
							icon: L.icon({
								iconUrl: "./img/plane.png",
								iconAnchor: [11, 11],
								iconSize: [22, 24]
							})
						}})}
					]
				}
			).addTo(mymap);

			flightlayers[i] = polyline;
			flightlayers_dec[i] = decorator;

			overlays[flights[i].name] = flightlayers[i];
			assetLayerGroup.addLayer(flightlayers[i]);
			assetLayerGroup.addLayer(flightlayers_dec[i]);
			if (i==displayedflight) {
				activlayer=flightlayers[i]._leaflet_id;
			}
			mymap._layers[flightlayers[i]._leaflet_id].dataId = i; //set the id of the data (starting from 0). Used for graph displays
		}
	}
}


//****************************************************
// LOAD ASH DATA
//****************************************************
/*
function addash(selecttime,displayash){
	var ashim = [];
	for (i = 0; i < ash.length; i++) {
		if (ash[i].timeid == selecttime){
			var imageUrl = './data/ash_layers/'+ash[i].image,
				//imageBounds = [[70, -80], [35, 10]];
				imageBounds = [[80, -70], [20, 40]];
				ashim[0] = L.imageOverlay(imageUrl, imageBounds,{
					opacity: 0.8,
					interactive: false,
					//time: ash[i].altitude
				});
				if (displayash == true) {ashim[0].addTo(mymap);}
			ashid=i;
			break;
		}
	}
	ashlayers = L.layerGroup(ashim);
	if (displayash == true) {ashlayers.addTo(mymap);}
	overlays['Ash Concentration (Ensemble Median)'] = ashlayers;//add images in overlay
	assetLayerGroup.addLayer(ashlayers);
}
*/


//****************************************************
//LOAD WIND VECTORS
//****************************************************
function addwind(selecttime,displaywind){
	var windim = [];
	for (i = 0; i < wind.length; i++) { //loop on wind array
		if (wind[i].timeid == selecttime){
			var imageUrl = './data/wind_vector_layers/'+wind[i].image, imageBounds = wind[i].bounds;
			windim[0] = L.imageOverlay(imageUrl, imageBounds,{opacity: 0.85, interactive: false, time: wind[i].time});
			if (displaywind == true) windim[0].addTo(mymap);
			break;
		}
	}
	windlayer = L.layerGroup(windim);
	if (displaywind == true) windlayer.addTo(mymap);
	overlays['Wind Speed (FL350)'] = windlayer;//add images in overlay
	assetLayerGroup.addLayer(windlayer);
}

//****************************************************
//LOAD AGREEMENT LAYERS
//****************************************************
function addagreement(selecttime,displayagree){
	//console.log('Test')
	var agreement_layer_id = 0; //init id of the displayed layer
	agreement_layer = []; //layers for each  map (one layer per time step)
	agreement_layers = {};
	var agreement_im = [];
	for (i = 0; i < agreement.length; i++) { //loop on  array
		// load related picture:
		if (agreement[i].timeid == selecttime){
			var imageUrl = './data/agreement_layers/'+agreement[i].image, imageBounds = agreement[i].bounds;
			agreement_im[0] = L.imageOverlay(imageUrl, imageBounds,{opacity: 0.85,interactive: false,time: agreement[i].time});
			if (displayagree == true) agreement_im[0].addTo(mymap);
			agreementid=i; // this is for the mouse over values display in top left of map.
			break;
		}
	}
	agreement_layer = L.layerGroup(agreement_im);
	if (displayagree == true) agreement_layer.addTo(mymap);
	overlays['Model Agreement (C<sub>ash</sub> > 0.2 mg m<sup>-3</sup>)'] = agreement_layer;//add images in overlay
	assetLayerGroup.addLayer(agreement_layer);
}


//****************************************************
//LOAD RISK MATRIX LAYER
//****************************************************
function addrisk(selecttime,displayrisk){
	var riskdim = [];
	for (i = 0; i < risk.length; i++) {
		if (risk[i].timeid == selecttime){
			var imageUrl = './data/risk_layers/'+risk[i].image,
			   imageBounds = risk[i].bounds;
			riskdim[0] = L.imageOverlay(imageUrl, imageBounds,{
					opacity: 0.85,
					interactive: false,
					time: risk[i].time
				});
				if (displayrisk == true) riskdim[0].addTo(mymap);
			break;
		}
	}
	risklayer = L.layerGroup(riskdim);
	risklayer.addTo(mymap);
	//overlays['Risk Level Map'] = risklayer; //add images in overlay
	assetLayerGroup.addLayer(risklayer);
}

//****************************************************
//LOAD CONTROL RUN LAYER
//****************************************************
function addcontrol(selecttime,displaycontrol){
	var controlim = [];
	for (i = 0; i < control.length; i++) { //loop on control array
		if (control[i].timeid == selecttime){
			var imageUrl = './data/control_layers/'+control[i].image,
			   imageBounds = control[i].bounds;
				 controlim[0] = L.imageOverlay(imageUrl, imageBounds,{
					opacity: 1,
					interactive: false,
					time: control[i].time
				});
				if (displaycontrol == true) {
					controlim[0].addTo(mymap);
					controlim[0].bringToFront();
				}
			break;
		}
	}
	controllayer = L.layerGroup(controlim);
	if (displaycontrol == true) controllayer.addTo(mymap);
	overlays['Control Run (0.2 mg m<sup>-3</sup>)'] = controllayer;//add images in overlay
	assetLayerGroup.addLayer(controllayer);
}

//****************************************************
// MOVE RISK MATRIX POINTER
//****************************************************
function moveriskmatrixpointer(x,y){
	// Clear the canvas so we can draw on it again.
	ctx.clearRect(0, 0, 250, 250);
	drawCross(x-4,y+3);
}
function drawCross(x,y){
	ctx.font="20px Georgia";
	ctx.strokeText("+",x,y);
}


//****************************************************
//DISPLAY THE FLIGHT SUMMARY PARAMETERS
//****************************************************
function displayflightparam(displayedflight){
	$("#flighttitle").val(flights[displayedflight].name);
	//Note: using the .toPrecision() method to display these values
	$("#ftimebox").val(flights[displayedflight].flightduration.toFixed(2));
	$("#timepenaltybox").val(flights[displayedflight].timepenalty.toFixed(2));
  //var dsgeLoMax = Math.max(flights[displayedflight].dsgeLo);
  //var dsgeHiMax = Math.max(flights[displayedflight].dsgeHi);
	//$("#dsgeMaxbox").val(flights[displayedflight].dsgeMax.toFixed(1)+" ["+dsgeLoMax.toFixed(1)+", "+dsgeHiMax.toFixed(1)+"]");
	//$("#dsgeMaxbox").val(dsgeLoMax.toFixed(2)+"–"+dsgeHiMax.toFixed(2));

	var dsgeMin = flights[displayedflight].dsgeLower;
	var dsgeMax = flights[displayedflight].dsgeUpper;
	var dsgeMedian = Math.max(flights[displayedflight].dosage);
	//$("#dsgeMaxbox").val(dsgeMin.toFixed(2)+"–"+dsgeMax.toFixed(2));
	$("#dsgeMaxbox").val(dsgeMedian.toFixed(0)+" ["+dsgeMin.toFixed(0)+", "+dsgeMax.toFixed(0)+"]");


	$("#expoDurbox").val(flights[displayedflight].expoDur.toFixed(2)+" ["+flights[displayedflight].expoLower.toFixed(2)+", "+flights[displayedflight].expoUpper.toFixed(2)+"]");
	//$("#expoDurbox").val(flights[displayedflight].expoLower.toFixed(2)+"–"+flights[displayedflight].expoUpper.toFixed(2));

	//Note this is different to the concMax value: concMax = dsgeMax / expoDur
	//Here we want to return the maximum (peak) value of the concentraiton array.
	//Let's call it peakCon:
	//var peakCon = Math.max(flights[displayedflight].conc);
  //var concLoMax = Math.max(flights[displayedflight].concLo);
  //var concHiMax = Math.max(flights[displayedflight].concHi);
	//$("#concMaxbox").val(peakCon.toFixed(1)+" ["+concLoMax.toFixed(1)+", "+concHiMax.toFixed(1)+"]");
	//$("#concMaxbox").val(concLoMax.toFixed(2)+"–"+concHiMax.toFixed(2));
	var peakMin = flights[displayedflight].peakLower; // 'the peak of the minimum'
	var peakMax = flights[displayedflight].peakUpper; // 'the peak of the maximum'
	var peakMedian = Math.max(flights[displayedflight].conc); // 'the peak of the Median'
	//$("#concMaxbox").val(peakMin.toFixed(2)+"–"+peakMax.toFixed(2));
	$("#concMaxbox").val(peakMedian.toFixed(0)+" ["+peakMin.toFixed(0)+", "+peakMax.toFixed(0)+"]");
}


//****************************************************
//DISPLAY OF DEvAC CHART
//****************************************************
function displayconclimits(flightid){

	var devacPoints = {
	  x: [flights[flightid].concMax],
	  y: [flights[flightid].expoDur],
		hoverinfo: 'text',
		hovertext: 'x: ' + flights[flightid].concMax.toFixed(2)
								+ ' [' + (flights[flightid].concLower).toFixed(2)
								+ ', ' + (flights[flightid].concUpper).toFixed(2)
								+ ']<br>y: ' + flights[flightid].expoDur.toFixed(2)
								+' [' + (flights[flightid].expoLower).toFixed(2)
								+ ', ' + (flights[flightid].expoUpper).toFixed(2)+']',
		error_x: {
			type: 'data',
			symmetric: false,
			array: [flights[flightid].concUpper - flights[flightid].concMax],
			arrayminus: [flights[flightid].concMax - flights[flightid].concLower]
		},
		error_y: {
			type: 'data',
			symmetric: false,
			array: [flights[flightid].expoUpper - flights[flightid].expoDur],
			arrayminus: [flights[flightid].expoDur - flights[flightid].expoLower]
		},
		showlegend: false,
	  mode: 'markers',
	  type: 'scatter',
	  marker: {
			color: plotly_blue,
			size: 10 },
	};

	var devacLine1 = {
		name: '0.72 g m<sup>-3</sup> s',
		mode: 'lines',
		hoverinfo: 'none',
		marker: {
			color: python_green
		},
		x: [1/(60*60), 10/(60*60), 100/(60*60), 1000/(60*60), 10000/(60*60), 100000/(60*60), 1000000/(60*60), 10000000/(60*60), 100000000/(60*60)],
		y: [0.72*1000, 0.072*1000, 0.0072*1000, 0.00072*1000, 0.000072*1000, 0.0000072*1000, 0.00000072*1000, 0.000000072*1000, 0.0000000072*1000],
	};

	var devacLine2 = {
		name: '7.2 g m<sup>-3</sup> s',
		mode: 'lines',
		hoverinfo: 'none',
		marker: {
			color: 'black'
		},
		x: [1/(60*60), 10/(60*60), 100/(60*60), 1000/(60*60), 10000/(60*60), 100000/(60*60), 1000000/(60*60), 10000000/(60*60), 100000000/(60*60)],
		y: [7.2*1000, 0.72*1000, 0.072*1000, 0.0072*1000, 0.00072*1000, 0.000072*1000, 0.0000072*1000, 0.00000072*1000, 0.000000072*1000],
	};

	var devacLine3 = {
		name: '14.4 g m<sup>-3</sup> s',
		mode: 'lines',
		hoverinfo: 'none',
		marker: {
			color: pale_red
		},
		x: [1/(60*60), 10/(60*60), 100/(60*60), 1000/(60*60), 10000/(60*60), 100000/(60*60), 1000000/(60*60), 10000000/(60*60), 100000000/(60*60)],
		y: [14.4*1000, 1.44*1000, 0.144*1000, 0.0144*1000, 0.00144*1000, 0.000144*1000, 0.0000144*1000, 0.00000144*1000, 0.000000144*1000],
	};

	var devacData = [devacPoints, devacLine1, devacLine2, devacLine3];

	var devacLayout = {
		title:'<b>DEvAC Chart</b>',
		titlefont: {
			size: 18,
			color: 'black'
		},
		font: {
			family: plotly_ff
		},
		autosize: false,
		width: 480,
		height: 220,
		margin: {
			l: 60,
			r: 20,
			b: 40,
			t: 30,
			pad: 1},
		xaxis: {
			title: 'Ash concentration [mg m<sup>-3</sup>]',
			type: 'log',
			range: [-3, 3],
			linecolor: '#dedede',
			linewidth: 1,
			mirror: true,
			hoverformat: '.1f'
		},
		yaxis: {
			title: 'Duration of exposure [h]',
			type: 'log',
			range: [-3, 3],
			linecolor: '#dedede',
			linewidth: 1,
			mirror: true,
			hoverformat: '.1f'
		},
		showlegend: true,
	  legend: {
	    x: 1,
	    y: 1,
			xanchor: 'right',
			bordercolor: '#dedede',
			borderwidth: 1,
			font: {
				size: 12,
			},
	  }
	};
	devacChart = Plotly.newPlot('devacchart', devacData, devacLayout, {displayModeBar: false});
}

//****************************************************
//DISPLAY OF CROSS SECTION
//****************************************************
function displaycrosssection(flightid){

	if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
		datacrossx = riskcrossx;
	}
	else {
		datacrossx = agreementcrossx;
	}

	layoutcrossx = {
		title: "<b>Vertical cross-section</b>",
		titlefont: {
			size: 18,
			color: 'black'
		},
		font: {
			family: plotly_ff
		},
		autosize: true,
		height: 230,
		//title: 'Cross Section of volcanic ash concentration [mg.m-3]',
		margin: {t:25, l:50, r:30, b:34},
		font: {
			family: plotly_ff,
			size: 12,
			color: font_col
		},
		paper_bgcolor: paper_bgc,
		plot_bgcolor: plot_bgc,
		showlegend: false,
		//width: 1620,
		xaxis: {
			title: 'Distance travelled [km]',
			autorange: true,
			mirror: 'ticks',
			//range: [-80, 10],
			showexponent: 'none',
			showline: true,
			showticklabels: true,
			tickmode: 'auto',
			ticks: '',
			type: 'linear',
			zeroline: false,
			hoverformat: ',f',
			gridcolor: '#e6e6e6',
			gridwidth: 1,
			//showgrid: false,
			titlefont: {color: font_col},
			tickfont: {color: font_col},
		},
		yaxis: {
			title: 'Flight level [FL]',
			autorange: true,
			mirror: 'ticks',
			//range: [20, 70],
			showexponent: 'none',
			showline: true,
			showticklabels: true,
			//tickmode: 'auto',
			autotick: false,
			ticks: '',
			dtick: 50,
			type: 'linear',
			zeroline: false,
			hoverformat: ',f',
			gridcolor: '#e6e6e6',
			gridwidth: 1,
			//showgrid: false,
			titlefont: {color: font_col},
			tickfont: {color: font_col},
		},
	};

	//Add horizontal line, representing the flight altitude
	flightheight = {  //Global variable as it is used in other functions
		x : [0,Math.round(Math.max(datacrossx[flightid].x))],
		y : [flights[flightid].altitude,flights[flightid].altitude],
		mode: 'lines',
		hoverinfo: 'none', // disable hoverinfo
		line: {
			color: flight_range_col,
			width: 0 // set width to zero to hide plottling the line
		}
	}

	//Display line for upper level
	FLLower = {
		x: [0,Math.round(Math.max(datacrossx[flightid].x))],
		y: [350, 350],
		fill: 'tonext', // 'none'
		//type: 'scatter',
		mode: 'lines',
		line: {color: 'rgb(255, 0, 0)'},
	};
	//Display line for lower level
	FLUpper = {
		x: [0,Math.round(Math.max(datacrossx[flightid].x))],//Math.round(Math.max(datacrossx[flightid].x))],
		y: [550, 550],
		fill: 'tonext', // 'tonexty'
		type: 'scatter',
		mode: 'lines',
		line: {color: 'rgb(255, 0, 0)'},
		fillcolor: {color: 'rgb(255, 0, 0)'}
	};
	Plotly.newPlot('crosssection', [datacrossx[flightid],FLLower,FLUpper,flightheight], layoutcrossx, {displayModeBar: false});
}



//****************************************************
//DISPLAY OF ALONG-FLIGHT INFORMATION (ASH CONCENTRATION AND DOSAGE)
//****************************************************
function displayashdosage(flightid){
	var alongFlightAshcLower = {
	  x: flights[flightid].dist,
	  y: flights[flightid].concLo,
	  line: {width: 0},
	  marker: {color: "rgba(220, 26, 102, 1)"},
	  mode: "lines",
	  name: "Minimum",
	  type: "scatter"
	};

	var alongFlightAshc = {
	  x: flights[flightid].dist,
	  y: flights[flightid].conc,
	  fill: "tonexty",
	  fillcolor: "rgba(220, 26, 102, 0.3)",
	  line: {color: "rgba(220, 26, 102, 1)"},
	  mode: "lines",
	  name: "Median",
	  type: "scatter"
	};

	var alongFlightAshcUpper = {
	  x: flights[flightid].dist,
	  y: flights[flightid].concHi,
	  fill: "tonexty",
	  fillcolor: "rgba(220, 26, 102, 0.3)",
	  line: {width: 0},
	  marker: {color: "rgba(220, 26, 102, 1)"},
	  mode: "lines",
	  name: "Maximum",
	  type: "scatter"
	};

	var alongFlightDsgeLower = {
	  x: flights[flightid].dist,
	  y: flights[flightid].dsgeLo,
		yaxis: 'y2',
	  line: {width: 0},
	  marker: {color: "rgba(66, 127, 253, 1)"},
	  mode: "lines",
	  name: "Minimum",
	  type: "scatter"
	};

	var alongFlightDsge = {
	  x: flights[flightid].dist,
	  y: flights[flightid].dosage,
		yaxis: 'y2',
	  fill: "tonexty",
	  fillcolor: "rgba(66, 127, 253, 0.3)",
	  line: {color: "rgba(66, 127, 253, 1)"},
	  mode: "lines",
	  name: "Median",
	  type: "scatter"
	};

	var alongFlightDsgeUpper = {
	  x: flights[flightid].dist,
	  y: flights[flightid].dsgeHi,
		yaxis: 'y2',
	  fill: "tonexty",
	  fillcolor: "rgba(66, 127, 253, 0.3)",
	  line: {width: 0},
	  marker: {color: "rgba(66, 127, 253, 1)"},
	  mode: "lines",
	  name: "Maximum",
	  type: "scatter"
	};

	var alongFlightData = [alongFlightAshcLower, alongFlightAshc, alongFlightAshcUpper, alongFlightDsgeLower, alongFlightDsge, alongFlightDsgeUpper];

	var alongFlightLayout = {
		title:'<b>Along-flight information</b>',
		titlefont: {
			size: 18,
			color: 'black'
		},
		font: {
			family: plotly_ff
		},
		showlegend: false,
		margin: {
			l: 60,
			r: 60,
			b: 40,
			t: 30,
			pad: 1},
		xaxis: {
			title: 'Distance travelled [km]',
			linecolor: '#eeeeee',
			linewidth: 1,
			hoverformat: '.0f'
		},
		yaxis: {
			title: 'Ash concentration [mg m<sup>-3</sup>]',
			titlefont: {color: reading_red},
			tickfont: {color: reading_red},
			linecolor: reading_red,
			linewidth: 1,
			hoverformat: '.1f'
		},
		yaxis2: {
			title: 'Ash dosage [g m<sup>-3</sup> s]',
			titlefont: {color: plotly_blue},
			tickfont: {color: plotly_blue},
			overlaying: 'y',
			side: 'right',
			linecolor: plotly_blue,
			linewidth: 1,
			hoverformat: '.1f'
		}
	};

	alongFlightChart = Plotly.newPlot('ashdosage', alongFlightData, alongFlightLayout, {displayModeBar: false});
}



//****************************************************
//FIND NEAREST POINT ON THE GRID (MAP). RETURNS THE NEAREST POINT
//****************************************************
function getclosestpoint(varlat,varlon,mouselat,mouselon,gridres){
	var index = 0;
	var diff = Math.sqrt (Math.pow((mouselat-varlat[0]),2)+Math.pow((mouselon-varlon[0]),2));
	var newdiff = 9999999;
	for (var i = 0; i < varlat.length; i++) {
		newdiff = Math.sqrt (Math.pow((mouselat-varlat[i]),2)+Math.pow((mouselon-varlon[i]),2));
		if (newdiff < diff) {
			diff = newdiff;
			index = i;
		}
	}
	//if (diff > ash[0].gridres) index=-1; //if nearest point is further than the grid resolution, we'll display 0
	if (diff > gridres) index=-1; //if nearest point is further than the grid resolution, we'll display 0
    return index;
};



//****************************************************
//UPDATE THE MAP
//****************************************************
function updateMap(){
	displaywind = mymap.hasLayer(windlayer);
	displaycontrol = mymap.hasLayer(controllayer);
	displayagree = mymap.hasLayer(agreement_layer);
	assetLayerGroup.eachLayer(function (layer) {
		layer.remove();
	});
	overlays = {};
	controllers.remove();
	assetLayerGroup.clearLayers();
	addflights(timeid);
	//addash(timeid,displayash);
	addwind(timeid,displaywind);
	if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
		console.log("Display Risk");
		if ($('#riskOnMap').prop('checked')){
			addrisk(timeid, displayrisk);
		}
		$('#divragreementlegend ').hide();
		$('#divriskmatrix').show();
		$('.risk').css("font-weight", 'bold');
		$('.agreement').css("font-weight", 'normal');
		$('#riskDisplayChoice').show();
	}
	else {
		console.log("Display Agreement");
		addagreement(timeid, displayagree);
		//$('.legend ').show();
		$('#divriskmatrix').hide();
		$('.agreement').css("font-weight", 'bold');
		$('.risk').css("font-weight", 'normal');
		$('#riskDisplayChoice').hide();
	}
	addcontrol(timeid,displaycontrol);
	addcontrollers();
	// after updating the map make agreement legend click on and off when selecting agreement map from layer selector.
	$('.leaflet-control-layers-selector').click(function(){
		if(mymap.hasLayer(agreement_layer)) {
			$('#divragreementlegend').show();
		} else {
			$('#divragreementlegend').hide();
		}
	});

}


//****************************************************
//Update data in DEvAC chart (right of map)
//****************************************************
function updatedevac(displayedflight){
	// Update DEvAC chart using the Plotly.restyle method.
	// Note 1: Plotly.redraw method is now outdated.
	// Note 2: So that the vertical dosage lines aren't affected only update the first trace updated,
	// which is why there is a '0' at the end of the calls.
	Plotly.restyle('devacchart', 'x', [[flights[displayedflight].concMax]], 0);
	Plotly.restyle('devacchart', 'y', [[flights[displayedflight].expoDur]], 0);
	Plotly.restyle('devacchart', 'error_x.array', [[flights[displayedflight].concUpper - flights[displayedflight].concMax]], 0);
	Plotly.restyle('devacchart', 'error_x.arrayminus', [[flights[displayedflight].concMax - flights[displayedflight].concLower]], 0);
	Plotly.restyle('devacchart', 'error_y.array', [[flights[displayedflight].expoUpper - flights[displayedflight].expoDur]], 0);
	Plotly.restyle('devacchart', 'error_y.arrayminus', [[flights[displayedflight].expoDur - flights[displayedflight].expoLower]], 0);
	Plotly.restyle('devacchart', 'hovertext', 'x: ' + flights[displayedflight].concMax.toFixed(2)
																					+ ' [' + (flights[displayedflight].concLower).toFixed(2)
																					+ ', ' + (flights[displayedflight].concUpper).toFixed(2)
																					+ ']<br>y: ' + flights[displayedflight].expoDur.toFixed(2)
																					+' [' + (flights[displayedflight].expoLower).toFixed(2)
																					+ ', ' + (flights[displayedflight].expoUpper).toFixed(2)+']')
}


//*******************************************************
//Update cross section graph
//****************************************************
function updatecrosssection(displayedflight){
	Plotly.purge('crosssection');

	//Display line for upper level
	FLLower = {
		x: [0,Math.round(Math.max(datacrossx[displayedflight].x))],
		y: [350, 350],
		fill: 'tonext',
		mode: 'lines',
		line: {color: 'rgb(255, 0, 0)'},
	};
	//Display line for lower level
	FLUpper = {
		x: [0,Math.round(Math.max(datacrossx[displayedflight].x))],
		y: [550, 550],
		fill: 'tonext',
		type: 'scatter',
		mode: 'lines',
		line: {color: 'rgb(255, 0, 0)'},
		fillcolor: {color: 'rgb(255, 0, 0)'}
	};

	if ($('#riskselected').prop('checked')){ //If the selector has been placed on risk display
		Plotly.plot('crosssection', [riskcrossx[displayedflight],FLLower,FLUpper,flightheight], layoutcrossx, {displayModeBar: false});
	}
	else {
		Plotly.plot('crosssection', [agreementcrossx[displayedflight],FLLower,FLUpper,flightheight], layoutcrossx, {displayModeBar: false});
	}

	//Plotly.redraw('crosssection');
}


//*******************************************************
//Update data in along-flight dosage chart with the selected flight number (bottom right)
//****************************************************
function updatedosagegraph(displayedflight){
	// Replot ash concentrations
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 0);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].concLo], 0);
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 1);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].conc], 1);
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 2);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].concHi], 2);
	// Replot ash dosages
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 3);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].dsgeLo], 3);
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 4);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].dosage], 4);
	Plotly.restyle('ashdosage', 'x', [flights[displayedflight].dist], 5);
	Plotly.restyle('ashdosage', 'y', [flights[displayedflight].dsgeHi], 5);
}
