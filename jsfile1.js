function runAll() {
		
	// Map Initiation
	var map = L.map('mapid', {zoomControl: false, center: [23.7, 120.888340], zoom: 10});

	//Icon setup
	//var siteIcon = L.icon(defaultIcon);

	var defaultIcon = L.icon({
		iconUrl: 'sites2.png',
		iconSize: [22, 22]});
		
	var mouseoverIcon = L.icon({
		iconUrl: 'sites2.png',
		iconSize: [32, 32]});
		
		
	//Base map
	var OSM = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		});
		
	var WMTS = L.tileLayer('http://140.115.110.11/SP/SP2012NC_3857/{z}/{x}/{y}.png', {
		attribution: 'Formosat2 2012 &copy; 2016 CSRSR National Central University',});
		
/* 	var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		maxZoom: 17,
		attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	}); */

	var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
	}).addTo(map);








	//GeoJSON Layers
		var highlightStyle = {
			color: 'green', 
			weight: 7,
			opacity: 0.8,
		};

		var defaultStyle = {
					color: "green",
					weight: 5,
					opacity: 0.6
				};


			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				}
			else {	
				function onEachFeature(feature, layer) {
					layer.setStyle(defaultStyle);
					(function(layer, properties) {
						layer.on("mouseover", function (e) {
							layer.setStyle(highlightStyle);
							var popupContent = '<p><b>' + feature.properties.name + '</p><p> From ' + feature.properties._from + ' To ' + feature.properties._to + '<br><a href="https://www.google.com/maps/dir/' + feature.properties.from_where + '+nantou+taiwan/' + feature.properties.to_where + '" target="_blank">Get direction</a></p>';
							layer.bindPopup(popupContent).openPopup();
						});
						layer.on("mouseout", function (e) {
						layer.setStyle(defaultStyle);
						});
						})(layer, feature.properties);
						}
				}

	function onEachFeature2(feature, layer) {
			layer.setIcon(defaultIcon);
			(function(layer, properties) {
				layer.on("mouseover", function (e) {
					layer.setIcon(mouseoverIcon);
					var popupContent2 = '<h2><b>' + feature.properties.sites + '</h2><p>' + feature.properties.description + '<br/>' + '<a href="' + feature.properties.website + '" target="_blank">Website</a></p><img src="' +  feature.properties.picture_filename + '"' + 'style="width:250px;height:150px;">';
					layer.bindPopup(popupContent2);
				});
				layer.on("mouseout", function (e) {
				layer.setIcon(defaultIcon);
				});
				})(layer, feature.properties);
				}


		var geoJsonLayer = L.geoJson([road], {
			style: {fillColor: "#2262CC",
					color: "#2262CC",
					weight: 10,
					opacity: 0.6,
					fillOpacity: 0.1},

			onEachFeature: onEachFeature,
			
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng);}
		});



			
		
		
		

		

	// CartoDB Integration
		var sites = null;

		
		var cartoDBUserName = "heshemap";

		// Get CartoDB selection as GeoJSON and Add to Map
		function showAll(){
			if(map.hasLayer(sites)){
			map.removeLayer(sites);
			}
			
			var sqlQuery = "SELECT * FROM sites_heshe";
			var sqlQuery2 = "SELECT * FROM poi";
			var sqlQuery3 = "SELECT * FROM road";
			
			
			

		  // Road Network
		  $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery3, function(data) {
			road = L.geoJson(data,{
			  onEachFeature: function (feature, layer) {
				layer.bindPopup('<p>' + feature.properties.name + '</p><p> From ' + feature.properties._from + ' To ' + feature.properties._to + '<br><a href="https://www.google.com/maps/dir/' + feature.properties.from_where + '/' + feature.properties.from_where + '" target="_blank">Get direction</a></p>');
				layer.cartodb_id=feature.properties.cartodb_id;
			  },
			  

				onEachFeature: onEachFeature,
				pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, {
						radius: 5, 
						fillColor: "#FFCC00",
						color: "#FFCC00",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					});
				}
			}).addTo(map);
		  });		
			
			
		  // Sites
		  $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
			sites = L.geoJson(data,{
			  onEachFeature: function (feature, layer) {
				var popupContent2 = '<h2><b>' + feature.properties.sites + '</h2><p>' + feature.properties.description + '<br>' + '<a href="' + feature.properties.website + '" target="_blank">Website</a></p><img src="' +  feature.properties.picture_filename + '"' + 'style="width:250px;height:150px;">';
				layer.bindPopup(popupContent2);
				layer.cartodb_id=feature.properties.cartodb_id;
			  },
			  
			  onEachFeature: onEachFeature2,
			  
			  pointToLayer: function (feature, latlng) {
					return L.marker(latlng)//, {icon: siteIcon
					//});
				}
			}).addTo(map);
		  });
		  
		  
		  // POI (Point of Interest)
		  $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery2, function(data) {
			POI = L.geoJson(data,{
			  onEachFeature: function (feature, layer) {
				layer.bindPopup('<p>' + feature.properties.poi + ' (' + feature.properties.description + ')</p><img src="' +  feature.properties.picture_filename + '"' + 'style="width:150px;height:100px;">');
				layer.cartodb_id=feature.properties.cartodb_id;
			  },
			  pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, {
						radius: 5, 
						fillColor: "#FFCC00",
						color: "#FFCC00",
						weight: 1,
						opacity: 1,
						fillOpacity: 1
					});
				}
			}).addTo(map);
		  });
		  
		  

		  
		  
		  
		}

		// Run showAll function automatically when document loads
		$( document ).ready(function() {
		  showAll();
		});


			// Suggestion route carto DB integration
		
		var route1 = "SELECT * FROM road WHERE _from = 'Wang Xiang' OR _from = 'Plum Factory' OR _from = 'Checheng' OR _to = 'Wang Xiang' OR _to = 'Plum Factory' OR _to = 'Checheng';"
		var route2 = "SELECT * FROM road WHERE _from = 'Plum Factory' OR _from = 'Jiji Station' OR _from = 'Sun Moon Lake' OR _from = 'Xitou' OR _to = 'Plum Factory' OR _to = 'Jiji Station' OR _to = 'Sun Moon Lake' OR _to = 'Xitou';"
		var route3 = "SELECT * FROM road WHERE _from = 'Wang Xiang' OR _from = 'Dongpu' OR _from = 'Tataka' OR _from = 'Zhushan' OR _to = 'Wang Xiang' OR _to = 'Dongpu' OR _to = 'Tataka' OR _to = 'Zhushan';"
		
		var routes = null;	
		function suggestionroute(route){
		var cartoDBUserName = "heshemap";
			if(map.hasLayer(routes)){
			map.removeLayer(routes);
			}
		
		  // Routes as suggested
		  $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q="+route, function(data) {
			routes = L.geoJson(data,{
			  onEachFeature: function (feature, layer) {
				layer.bindPopup('<p>' + feature.properties.name + '</p><p> From ' + feature.properties._from + 'To ' + feature.properties._to + '<br><a href="https://www.google.com/maps/dir/' + feature.properties.from_where + '/' + feature.properties.to_where + '" target="_blank">Get direction</a></p>');
				layer.cartodb_id=feature.properties.cartodb_id;
			  },
			  
			  pointToLayer: function (feature, latlng) {
	/* 				return L.circleMarker(latlng, {
						radius: 5, 
						fillColor: "#FFCC00",
						color: "#FFCC00",
						weight: 1,
						opacity: 1,
						fillOpacity: 1
					}); */
				}
			}).addTo(map);
			var bounds = routes.getBounds();
			map.fitBounds(bounds);
		  });
		}	  

		
		//Adding Heshe point
		//Heshe Site
		var heshe = L.circleMarker([23.591160, 120.888340], {
						radius: 8, 
						fillColor: "red",
						color: "red",
						weight: 1,
						opacity: 1,
						fillOpacity: 1
					}).addTo(map)
		.bindPopup('<h2>Heshe Nature Education Area</h2><p>Located in Xinyi Township, Heshe is a quiet little town surrounded with a wide variety of plants and wildlife. With a healthy combination of cultural and natural attractions, Heshe offers a different experience, especially for people veering away from tourists. <br><a href = "http://www.exfo.ntu.edu.tw/en/about/Index/C3B26EBC-F10D-4110-8A05-0DC609D823E4" "target = "_blank">Website</a><br><img src = "https://googledrive.com/host/0B6291J1qLr_5OXg5Q0Z2a1hmbVk/heshe.jpg" style="width:280px;height:150px;"></p>').openPopup();
		
		//It is one of the Experimental Forests of National Taiwan University, mainly for academic researches and environmental protection. It is also the home for three aboriginal tribes in Taiwan, namely the WangXiang, Luona, and XingXiang tribes. 
		
		//Layer object
		
		var baseMaps = {
			"Open Street Map" : OSM, 
			"WMTS CSRSR" : WMTS,
			//"OpenTopoMap" : OpenTopoMap,
			"ESRI Topo" : Esri_WorldTopoMap,
			"OSM" : OSM};
			
		var overlayMaps = {
			//"Sites" : sites,
			//"POI" : POI
		};

		new L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
		
		

		//JQuery for suggestion route
		
		//var group = new L.featureGroup(routes);
		$(document).ready(function() { 
			$('input[type=radio][name=trip]').change(function() {
				
				if (this.value == 'one') {
					var route = route1;
					document.getElementById("tripdesc").innerHTML = 
					"<ul>(Option 1)<li>WangXiang Village (Spend some time with the tribe and learn about their history and customs!) </li><li>Dongpu (Enjoy magnificent valley views from a suspension bridge, hike to one of Dongpu’s waterfalls and finish your trip with a relaxing hot bath.)</li></ul><br><ul>(Option 2)<li>WangXiang Village (Spend some time with the tribe and learn about their history and customs!) </li><li>Plum Factory (Indulge yourseld with a variety of organic plum products like candies, wine, plum sauces, and even plum flavored ice cream!)</li><li>Checheng (Have a stroll around this beautiful village and learn about the history of Taiwan’s timber industry or visit the local wood factory and create your own furniture.)</li></ul>";
				}
				else if (this.value == 'two'){
					var route = route2;
					document.getElementById("tripdesc").innerHTML = 
					"<br><ul>Option 1<li>(Plum Factory) Indulge yourseld with a variety of organic plum products like candies, wine, plum sauces, and even plum flavored ice cream!</li><li>(Jiji) Visit the Endemic Species Research Institute or try out stinky tofu, the village’s signature culinary speciality. </li><li>(Sun Moon Lake) Stroll around the bike trail to have a scenic view of the lake. The stunning panoramic view of the whole lake is at the top of the Cl'en Pagoda, hike up!</li></ul><br><ul>Option 2<li>(Wang Xiang) Spend some time with the tribe and learn about their history and customs!</li><li>(Shuili) Have a look around the visitor centre of Yushan National Park Headquarters or visit the Shuili Snake Kiln pottery and take a picture of the world’s largest vase (almost seven metres tall). </li><li>(Checheng Station) Have a stroll around this beautiful village and learn about the history of Taiwan’s timber industry or visit the local wood factory and create your own furniture. </li><li>(Sun Moon Lake) Stroll around the bike trail to have a scenic view of the lake. The stunning panoramic view of the whole lake is at the top of the Cl'en Pagoda, hike up!</li></ul>";
				}
				else {
					var route = route3;
					document.getElementById("tripdesc").innerHTML = 
					"<br><ul>Option 1<li>(Wang Xiang) Spend some time with the tribe and learn about their history and customs!</li><li>(Dongpu) Enjoy magnificent valley views from a suspension bridge, hike to one of Dongpu’s waterfalls and finish your trip with a relaxing hot bath. </li><li>(Tataka) Hike up Mt. Linjhih to enjoy breath-taking views across the Yushan mountain range or climb Mt. Dongpu to enjoy the magnificent sunrise.</li><li>(Alishan) Start the day with the breathtaking sunrise dancing in the sea of clouds at Mt Zhushan and end it with the serene sunset at Alishan train station!</li></ul><br><ul>Option 2<li>(Wang Xiang) Spend some time with the tribe and learn about their history and customs!</li><li>(Dongpu) Enjoy magnificent valley views from a suspension bridge, hike to one of Dongpu’s waterfalls and finish your trip with a relaxing hot bath. </li><li>(Plum Factory) Indulge yourseld with a variety of organic plum products like candies, wine, plum sauces, and even plum flavored ice cream!</li><li>(Checheng Station) Have a stroll around this beautiful village and learn about the history of Taiwan’s timber industry or visit the local wood factory and create your own furniture. </li><li>(Sun Moon Lake) Stroll around the bike trail to have a scenic view of the lake. The stunning panoramic view of the whole lake is at the top of the Cl'en Pagoda, hike up!</li></ul>";
				}
				suggestionroute(route);
				//map.fitBounds(group.getBounds());
				});
			});
	
}
	
	

	 



	

