/*
Date creation: 22/05/2017
Author: University of Reading (E. Mathieu + A. Prata)
Purpose: This script displays the output of the flight volcanic ash dosage model
- flight paths
- ash concentration, or Model Agreement, or Risk Matrix
- dosage for each given flight
- cross section of certain flight paths
The display is updated for each time step

Last edit: 14/3/2018
*/



//****************************************************
//INITIALIZE VARIABLES
//****************************************************
var displayedflight = 0; //current flight path to highlight (others will be grayed)
var activlayer = 0;
//var ashid = 0; //ID of the ash layer to display. Use an id in case there are several layers for one time step. So it can be independent from time steps and flight paths.
var agreementid = 0; //ID of the agreement layer to display. Use an id in case there are several layers for one time step. So it can be independent from time steps and flight paths.


//var	displayash = true;
var displaywind = false;
var displaycontrol = true;
var displayrisk = false;
var displayagree = false;

// Use custom colors
var plotly_blue = '#1f7ffd';
var reading_red = '#da0067';
var python_green = '#2da94f';
var pale_red = '#d9544d';
var paper_bgc = 'white';
var plot_bgc = 'white';
var font_col = 'black';
var grid_col = ''; // if empty string then sets to plotly's default
var flight_range_col = 'rgba(150, 208, 150, 1.000)';

// set fonts for all plots universally
//var plotly_ff = 'Effra';
//var plotly_ff = 'Effra-Light';
//var plotly_ff = 'Verdana';
var plotly_ff = 'Helvetica Neue';


var highlight = {
    'color': 'red',
    'weight': 4,
    'opacity': 1
};
var lowlight = {
    'color': 'grey',
    'weight': 4,
    'opacity': 0.5
};

//LEGEND CONTENTS
var legendAshDosageContent = "";
//var legendAgreementContent = 'C<sub>ash</sub> > 0.2 mg m<sup>-3</sup><br><img src="./img/agreement_colourbar_transparent.png" width="100" height="100">';
//var legendRiskContent = '<div style="position:relative; margin-top:5px; margin-right: 5px; text-align:right;">Risk Matrix<br><img src="./img/riskmatrix.png"></div>					<canvas id="canvaslegend"  width="195" height="138" style=" z-index:9999; position:absolute; bottom:0px; left: 0px;">Your browser does not support the HTML5 canvas tag. Use a more recent browser.</canvas>				</div>			</div>';

//risk matrix:
var c = document.getElementById("canvaslegend");
var ctx = c.getContext("2d");
var risklegendcoordx = [93,93,93,132,132,171,132,171,171];
var risklegendcoordy = [82,50,18,82,50,82,18,50,18]

//****************************************************
//SELECT TIME TO DISPLAY
//****************************************************
var timeid = 0; //id of the time steps. Used by slider.
console.log("selected time: "+ timeid);

//****************************************************
//DISPLAY GRAPHS FOR SELECTED TIME
//****************************************************
displaymap(timeid);
displayconclimits(displayedflight);
displaycrosssection(displayedflight);
displayashdosage(displayedflight);


$(document).ready(function(){
	testdisplay();
    displayflightparam(displayedflight);
	window.setTimeout(function(){
		openCloseSurvey();
	}, 5000);
});


//****************************************************
//EVENT HANDLERS TO SWITCH BETWEEN AGREEMENT AND RISK DISPLAY
//****************************************************
$( '#riskselected' ).change(function() {
	updateMap();
	updatecrosssection(displayedflight);
});

//****************************************************
//EVENT HANDLERS TO SWITCH BETWEEN ROUTE AND MAP COLORING OF RISK
//****************************************************
$( '#riskDisplayChoice' ).change(function() {
	updateMap();
});

//****************************************************
//EVENT HANDLERS TO UPDATE GRAPHS OR RELOAD FOR DIFFERENT TIME
//****************************************************

//Listener on map click: load different flight path data
clicklistener();

/*
//Listener on mouse above: display ash concentration
mymap.on('mousemove', function(e){
	var ashindex = getclosestpoint(ash[ashid].y,ash[ashid].x,e.latlng.lat,e.latlng.lng);
	if (ashindex == -1) {
		ashcon = 0;
	} else {
		var ashcon = ash[ashid].z[ashindex];
		// round the concentration to a precision of 2
		ashcon = ashcon.toFixed(1);
	}
	info.update(ashcon);
});
*/

//****************************************************
// TIME SLIDER. CLASS EXTENSION TO RELOAD ELEMENTS DEPENDING ON TIME SELECTION
//****************************************************
$( function() {
	var handle = $( "#custom-handle" );
	$( "#slider" ).slider({
	  value: 0,
	  min: 0,
	  max: timesteps.length - 1,
	  step: 1,
	  create: function() {
		//handle.text( $( this ).slider( "value" ) );
		$( "#slidertime" ).val(timesteps[timeid]);
	  },
	  slide: function( event, ui ) {
		$( "#slidertime" ).val(timesteps[ui.value]);
		//handle.text( $( this ).slider( "value" ) );
		//update elements on map
		timeid = ui.value;
		overlays = {};
		updateMap(); //Update the map with selected items

		displayflightparam(displayedflight);//update route info

		updatedevac(displayedflight);//update devac chart

	  },
	  stop: function(event, ui) {
        // Load the graphs when releasing the mouse. (Must be done after selecting the time, otherwise too slow)
		//update crosssection
		updatecrosssection(displayedflight);
		//update flight dosage graph
		updatedosagegraph(displayedflight);
		clicklistener();
	  }
	});
} );
