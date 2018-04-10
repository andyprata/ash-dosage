# README #

### What is this repository for? ###

* Web display of Volcanic ash plumes and ash dosages per flight routes. User can scroll in time and select pre-computed flight routes.
* Current Version: V3 (April 2018)
* [See project running website](http://www.met.reading.ac.uk/ash-dosage)

### How do I get set up? ###

* Setup: simply copy all files in a web reachable directory.
* Configuration: Load the data, pictures and time steps in the directory /data. See existing data for example.
* Dependencies: This project uses the following libraries:
* * Leaflet: https://unpkg.com/leaflet@1.0.3/dist/leaflet.js + sub-libraries
* * plotly.js v1.26.0
* * jquery: http://code.jquery.com/jquery-1.9.1.min.js
* * fontawsome: https://use.fontawesome.com/851295a42c.js
* * MaxJax (enables LaTeX notation): https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_SVG
* * maps from Mapbox


### GENERAL FILE ORGANIZATION ###
* Landing webpage is index.html
* Loading the libraries as well as the data, then loading the /js/main.js file to update divs with jquery
/js/main.js/ calls functions in /js/functions.js (map display, graph rendering...)


### DATA ###
As for April 2018: Data stored in javascript objects. Constructors are called in /js/datainit.js
Data in the form of dataname[id].class with id starting at 0. (expl: Flight[1].altitude = 350 (for FL350))

* Flight(id,timeid,flightduration,timepenalty,altitude,path,dist,conc,dosage,expodur,dosagemax,name,hoverinfo,opacity)
* Ashdata(id,timeid,timestamp,legendmax,gridres,altitude,active,image,x,y,z)
* Ashcrossx(flightid,timeid,x,y,z,type,colorscale,contours)
* Agreement(id,image,active,bounds,timeid)
* Wind(id,image,active,bounds,timeid)

* Time steps (in file /data/timesteps.js:
    var timesteps = [];
    timesteps[0] = '2017-01-01 09:00 UTC';
	[...]



### Contribution guidelines ###

* This project is now shared under the GPL 3.0 licence.

### Who do I talk to? ###

* Repo owner or admin
University of Reading: Helen Dacre <h.f.dacre@reading.ac.uk>
