
//constructor of flight:
function Flight(id,timeid,flightduration,timepenalty,altitude,path,dist,conc,dosage,expodur,dosagemax,name,hoverinfo,opacity) {
	this.id = id;
	this.timeid = timeid;
	this.flightduration = flightduration;
	this.timepenalty = timepenalty;
	this.altitude = altitude;
	this.path = path;
	this.dist = dist;
	this.conc = conc;
	this.dosage = dosage;
	this.expodur = expodur;
	this.dosagemax = dosagemax;
	this.name = name;
	this.hoverinfo = hoverinfo;
	this.opacity = opacity;
}
var flights = [];
/*
//constructor of ashdata:
function Ashdata(id,timeid,timestamp,legendmax,gridres,altitude,active,image,x,y,z) {
	this.id = id;
	this.timeid = timeid;
	this.timestamp = timestamp;
	this.legendmax = legendmax;
	this.gridres = gridres;
	this.altitude = altitude;
	this.active = active;
	this.image = image;
	this.x = x;
	this.y = y;
	this.z = z;
}
var ash = [];
*/
//constructor of agreementdata (based on Ashdata):
function Agreementdata(id,timeid,timestamp,legendmax,gridres,altitude,active,image,x,y,z) {
	this.id = id;
	this.timeid = timeid;
	this.timestamp = timestamp;
	this.legendmax = legendmax;
	this.gridres = gridres;
	this.altitude = altitude;
	this.active = active;
	this.image = image;
	this.x = x;
	this.y = y;
	this.z = z;
}
var agreement = [];

//constructor of Wind:
function Wind(id,image,active,bounds,timeid) {
	this.id = id;
	this.image = image;
	this.active = active;
	this.bounds = bounds;
	this.timeid = timeid;
}
var wind = [];

//constructor of Risk:
function Risk(id,image,active,bounds,timeid) {
	this.id = id;
	this.image = image;
	this.active = active;
	this.bounds = bounds;
	this.timeid = timeid;
}
var risk = [];

//constructor of Model agreement percentage:
/*function Agreement(id,image,active,bounds,timeid) {
	this.id = id;
	this.image = image;
	this.active = active;
	this.bounds = bounds;
	this.timeid = timeid;
}
var agreement0 = [];
var agreement2 = [];
var agreement4 = [];
var agreement6 = [];
var agreement10 = [];
*/
//constructor of Control run contour:
function Control(id,image,active,bounds,timeid) {
	this.id = id;
	this.image = image;
	this.active = active;
	this.bounds = bounds;
	this.timeid = timeid;
}
var control = [];


//constructor of Agreement cross section:
function agreementProfile(flightid,timeid,x,y,z,type,colorscale,contours) {
	this.flightid = flightid;
	this.timeid = timeid;
	this.x = x;
	this.y = y;
	this.z = z;
	// set max and mins of colorscale
	this.zmin = -1;
	this.zmax = 100.1;
	this.type = 'contour';
	this.opacity = 0.95;
	// smooths color contouring if coloring set to 'heatmap'.
	//this.contours = {start: 0, end: 100, step: 10, coloring: 'fill', showlines: false};
	this.contours = {coloring: 'fill', showlines: false};
// This results in even contouring:
//this.ncontours = 5;
//this.contours = {start: 5, end: 30, step: 5, coloring: 'heatmap'};
	// set custom colorscale
	/*this.colorscale = [
			['0.0', '#a54c66'],
			['0.222222222222', '#d04c66'],
			['0.333333333333', '#e65c5d'],
			['0.444444444444', '#f98067'],
			['0.555555555556', '#faad74'],
			['0.666666666667', '#fdc881'],
			['0.777777777778', '#fde39e'],
			['0.888888888889', '#fef1bb'],
			['1.0', 'rgb(255,255,255)']
	];*/
		// set custom colorscale
		this.colorscale = [
				['0.0', '#fee8c8'],
				['0.1', '#fee8c8'],
					['0.1', '#fdbb84'],
					['0.9', '#fdbb84'],
					['0.9', '#e34a33'],
				['1.0', '#e34a33']
		];
	// or can use pre-defined colorscale
	//this.colorscale = 'Greys'
// reverse colorscale
  //this.reversescale = true;
	this.colorbar = {
	  title: 'Model agreement [%]',
	  titleside: 'right',
	  tickfont: {
		size: 12,
	  },
	  titlefont: {
		size: 14,
	  },
	  tickvals:[0,10,90,100],
	  len: 1.12,
	  thicknessmode: 'pixels',
	  thickness: 15,
	  x: 0.99
	}
}

//constructor of Risk cross section:
function riskProfile(flightid,timeid,x,y,z,type,colorscale,contours) {
	this.flightid = flightid;
	this.timeid = timeid;
	this.x = x;
	this.y = y;
	this.z = z;
	// set max and mins of colorscale
	this.zmin = 0;
	this.zmax = 10;
	this.type = 'contour';
	this.opacity = 0.95;
	this.contours = {coloring: 'fill', showlines: false};
		// set custom colorscale
		this.colorscale = [
			['0.0', '#fffa8b'],
			['0.45', '#fffa8b'],
			['0.45', '#feb24c'],
			['0.75', '#feb24c'],
			['0.75', '#e56b5d'],
			['1', '#e56b5d'],
		];
	this.colorbar = {
	  title: 'Risk Level',
	  titleside: 'right',
	  tickfont: {
		size: 12,
	  },
	  titlefont: {
		size: 14,
	  },
	  tickvals:[1,9],
	  len: 1.12,
	  thicknessmode: 'pixels',
	  thickness: 15,
	  x: 0.99
	}
}
var agreementcrossx = [];
var riskcrossx = [];
