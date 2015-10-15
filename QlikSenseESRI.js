require.config({
	paths: {
		"components": "https://rawgit.com/johsund/QlikESRIGit/master/bower_components", //"http://localhost:4848/extensions/QlikSenseESRI/bower_components",
		"dojo": "https://rawgit.com/johsund/QlikESRIGit/master/bower_components/dojo",//"http://localhost:4848/extensions/QlikSenseESRI/bower_components/dojo",
		"dijit": "https://rawgit.com/johsund/QlikESRIGit/master/bower_components/dijit",//"http://localhost:4848/extensions/QlikSenseESRI/bower_components/dijit",
		"dojox": "https://rawgit.com/johsund/QlikESRIGit/master/bower_components/dojox",//"http://localhost:4848/extensions/QlikSenseESRI/bower_components/dojox",
		"esri": "https://js.arcgis.com/3.8/js/esri" 
	}
});

define( [
	'jquery',
	'text!./template.html',
	'text!./css/esri.css',
	'qvangular',
	'js/qlik',
	"esri/map",
	"esri/toolbars/draw",
	"esri/tasks/query", 
	"esri/geometry/Circle",
	"esri/arcgis/utils",
	"esri/dijit/Legend",
	"esri/graphicsUtils",
	"esri/layers/GraphicsLayer",
	"esri/graphic",
	"esri/geometry/Point",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol", 
	"esri/symbols/SimpleFillSymbol",
	"dojo/_base/Color",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/on",
	"dojo/domReady!"
], function ( $, template, cssContent, qv, qlik, Map, Draw, Query, Circle, arcgisUtils, Legend, graphicsUtils, GraphicsLayer, Graphic, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, arrayUtils, dom, on) {
	'use strict';

	$("<style>").html(cssContent).appendTo("head");
	
	//Legend widget
	var legendDijit, position;
  
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 1000
				}]
			}
		},
		//property panel
		definition: 
		
		{
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions", 
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items : {
					webmapid : {
							ref : "webmapid",
							type : "string",
							label : "Web map ID",
							defaultValue : "891937e148e7482caef8671fdc22515b"
						},
					popup: {
						type: "items",
						label: "Popup Window Settings",
						items: {
							popupshowcheck: {
								type: "boolean",
								label: "Show popups",
								ref: "popupshow",
								defaultValue: true
							},
							popupwindowtitle : {
								ref : "popupwindowtitle",
								type : "string",
								label : "Popup Window Title",
								defaultValue : "This is my Title"
							},
							popupwindowbody : {
								ref : "popupwindowbody",
								type : "string",
								label : "Popup Window Body",
								defaultValue : "This is my Expression value:"
							}
						}
					},
					extras: {
						type: "items",
						label: "Legend/Layer Settings",
						items: {
							legendshowcheck: {
								type: "boolean",
								label: "Show Legend",
								ref: "legendshow",
								defaultValue: true
							},
							layersshowcheck: {
								type: "boolean",
								label: "Show Layers",
								ref: "layershow",
								defaultValue: true
							}
						}
					},
					markers: {
					type: "items",
					label: "Marker style",
					items: {
						sliderR: {
							ref: "markerFillR",
							label: "Marker fill Red",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderG: {
							ref: "markerFillG",
							label: "Marker fill Green",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderB: {
							ref: "markerFillB",
							label: "Marker fill Blue",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderA: {
							ref: "markerFillA",
							label: "Marker fill Alpha",
							type: "integer",
							min: 0,
							max: 1,
							step: 0.01,
							component: "slider",  
							defaultValue: 0.5
						},
						markerWidth: {
							ref: "markerWidth",
							type: "integer",
							component: "slider",
							label: "Marker width",
							min: 1,
							max: 20,
							step: 1,
							defaultValue: 10
							}
						}
					},
					borders: {
					type: "items",
					label: "Border style",
					items: {
						sliderR: {
							ref: "markerBorderR",
							label: "Border fill Red",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderG: {
							ref: "markerBorderG",
							label: "Border fill Green",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderB: {
							ref: "markerBorderB",
							label: "Border fill Blue",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						sliderA: {
							ref: "markerBorderA",
							label: "Border fill Alpha",
							type: "integer",
							min: 0,
							max: 255,
							step: 1,
							component: "slider",  
							defaultValue: 127
						},
						borderStroke: {
							ref: "borderWidth",
							type: "number",
							component: "dropdown",
							label: "Border width",
							options: [
								{
									value: 0,
								},
								{
									value: 0.1,
								},
								{
									value: 0.2,
								},
								{
									value: 0.3,
								},
								{
									value: 0.4,
								},
								{
									value: 0.5,
								},
								{
									value: 0.6,
								},
								{
									value: 0.7,
								},
								{
									value: 0.8,
								},
								{
									value: 0.9,
								},
								{
									value: 1.0,
								}
							],
							defaultValue: 0
							},

                        }
                    }
					}
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {
		
			// GETTING THE DATA FROM Qlik
			
			this.backendApi.cacheCube.enabled = false;
			var _this = this;
			
			var columns = layout.qHyperCube.qSize.qcx, totalheight = layout.qHyperCube.qSize.qcy;
		    var pageheight = Math.floor(10000 / columns);
			var numberOfPages = Math.ceil(totalheight / pageheight);

			var markers = [];
			var selectedMarkers = [];
			
			var dimensions = layout.qHyperCube.qDimensionInfo;
																		
			var columns = layout.qHyperCube.qSize.qcx;
			var totalheight = layout.qHyperCube.qSize.qcy;
			
			var pageheight = Math.floor(10000 / columns);
			var numberOfPages = Math.ceil(totalheight / pageheight);
			
			var Promise = qv.getService('$q');
			
			var promises = Array.apply(null, Array(numberOfPages)).map(function(data, index) {
				var page = {
					qTop: (pageheight * index) + index,
					qLeft: 0,
					qWidth: columns,
					qHeight: pageheight
				};
				
				return this.backendApi.getData([page]);
				
			}, this)
			

			$element.html(template);
			
			Promise.all(promises).then(function(d) {
				render(d);
			});
			
			function render(d) {	
			
			var map;
			var myDraw;
			var app = qlik.currApp();
			
			var createMapOptions = {
				mapOptions: {
					autoResize: true,
					maxZoom: 16,
					slider: true
				}
			};
			
			//Create map based on WebmapID.
			var deferred = arcgisUtils.createMap(layout.webmapid, 'mapDiv', createMapOptions);

			deferred.then(function(response){

				map = response.map;
				
				//Restore LayerList position

				if(typeof localStorage.getItem("containerTop")!== 'undefined' && localStorage.getItem("containerTop") !== null)
				{
				var containerright = ($('#mapDiv').width()-$('#container').width())-(localStorage.getItem("containerLeft"));
				var containertop = localStorage.getItem("containerTop");

				document.getElementById("container").style.top = containertop + "px";
				document.getElementById("container").style.right = containerright + "px";
				}
				else
				{
					document.getElementById("container").style.top = "10px";
					document.getElementById("container").style.right = "20px";
				}

				/////////
				
				//Restore Legend position

				if(typeof localStorage.getItem("legendTop")!== 'undefined' && localStorage.getItem("legendTop") !== null)
				{
				var legendleft = localStorage.getItem("legendLeft");//($('#mapDiv').width()-$('#container').width())-(localStorage.getItem("containerLeft"));
				var legendtop = localStorage.getItem("legendTop");

				document.getElementById("legendDivContainer").style.top = legendtop + "px";
				document.getElementById("legendDivContainer").style.left = legendleft + "px";
				}
				else
				{
					document.getElementById("legendDivContainer").style.top = "10px";
					document.getElementById("legendDivContainer").style.left = "65px";
				}

				/////////
				
				
				//Load all layers for layer toggling and Legend.
				var layers = response.itemInfo.itemData.operationalLayers;
				
				//Catch available layers for Legend.
				 var layerInfo = [];        
				 dojo.forEach(layers,function(layer){
				   if(!layer.featureCollection){
				    layerInfo.push({"layer":layer.layerObject,"title":layer.title});
				   }
				 });
				 
					//Destroy any existing legend upon redraw
					try{
						legendDijit.destroy();
					}
					catch (err) {
						//console.log(err);
					}
					//Create Legend based on webmap.
				  try {
						legendDijit = new Legend({map:map, layerInfos:layerInfo}, "legendDiv");
						legendDijit.startup();
				   }
				  catch (err) {
				 	  //console.log(err);
				   }
				
				 //Assign a label to the Legend Div and make it draggable.
				 $('<b>Legend</b>').appendTo($('#legendtitle_bar'));
				 $("#legendDivContainer").draggable({
					stop: function() {
						var position = $("#legendDivContainer").position();
						localStorage.setItem('legendLeft', position.left);
						localStorage.setItem('legendTop', position.top);
					} 
				 });
				
				//Apply hide/show functionality to the Legend div.
				$("#legendbutton").click(function(){
					if($(this).html() == "-"){
						$(this).html("+");
						  $( "#legendDiv" ).fadeTo( "slow" , 0.0, function() {
							// Animation complete.
						  });
					}
					else{
						$(this).html("-");
						  $( "#legendDiv" ).fadeTo( "slow" , 1.0, function() {
							// Animation complete.
						  });
					}
				});
				
				if(layout.legendshow)
				{
					$( "#legendDivContainer" ).show();
				}
				else
				{
					$( "#legendDivContainer" ).hide();
				}
				if(layout.layershow)
				{
					$( "#container" ).show();
				}
				else
				{
					$( "#container" ).hide();
				}
				
				buildLayerList(layers);
				
				function buildLayerList(layers) {
						$('<b>Web Map Layers</b>').appendTo($('#title_bar'));

					layers.forEach(function (layer) {
							$('<input />', { type: 'checkbox', id: layer.id, value: layer.id }).appendTo($('#layerList'));
							$('<label />', { 'for': layer.id, text: layer.id }).appendTo($('#layerList'));
							$('<br>').appendTo($('#layerList'));
							
							if(layer.visibility) {
								$("#"+layer.id).prop( "checked", true );
							}
							
							$("#" + layer.id).click(function(){
								var myLayer = map.getLayer(layer.id);
								if($("#"+layer.id).prop('checked'))
								{
									myLayer.show();
								}
								else
								{
									myLayer.hide();
								}
							});

					})
				}
				
				$("#button").click(function(){
					if($(this).html() == "-"){
						$(this).html("+");
						  $( "#layerList" ).fadeTo( "slow" , 0.0, function() {
							// Animation complete.
						  });
					}
					else{
						$(this).html("-");
						  $( "#layerList" ).fadeTo( "slow" , 1.0, function() {
							// Animation complete.
						  });
					}
				});
				
				 $("#container").draggable({
					stop: function() {
						var position = $("#container").position();
						localStorage.setItem('containerLeft', position.left);
						localStorage.setItem('containerTop', position.top);
					}
				 });
					 
					 var myval = 1;		

					// Get max Expression value
				d.forEach(function (obj) {
					obj[0].qMatrix.forEach(function (row, index) {
						if (row[0].qText == '-') return;
					   if(Math.round(row[1].qNum)>myval) {
						   myval = row[1].qNum;
					   }
					});
				});

				var gl = new GraphicsLayer(); 
			   
					
				  var p;
				  var s;
				  var mymetric;

				  //Loop through all hypercube rows and create markers
				d.forEach(function (obj) {
	
					obj[0].qMatrix.forEach(function (row, index) {
					if (row[0].qText == '-') return;

						//Parse the dimension
						var latlng = JSON.parse(row[0].qText);
								
						//Capture Measure value
						if(row[1].qNum>0) {
							mymetric = row[1].qNum;
						}
						else {
							mymetric = 1;
						}
						
							var myColor = new Color ([layout.markerFillR,layout.markerFillG,layout.markerFillB,layout.markerFillA]);
							var mySize = mymetric*(layout.markerWidth/myval);
					
						s = new SimpleMarkerSymbol({
							size: mySize,
							qElemLoc: row[0].qText,
							qExpValue: row[1].qNum,
							color: myColor,
							outline: {"color":[layout.markerBorderR,layout.markerBorderG,layout.markerBorderB,layout.markerBorderA],"width":layout.borderWidth,"type":"esriSLS","style":"esriSLSSolid"}
						});

							p = new Point(latlng[0], latlng[1]);
							var g = new Graphic(p, s);
							gl.add(g);

					});
				}); //LOOP
				
					//Add Graphics layer to map.
                    map.addLayer(gl);
					
					//Refocus map on available points
					 var extent = graphicsUtils.graphicsExtent(gl.graphics);
					if(extent){
						map.setExtent(extent)
					}

					//Update button colors while hovering.
				$( "#circleselect" ).hover(
				  function() {
					$('#circleselect')
					.css('background-color', '')
					.css('background-color', 'rgba(205,205,205,1)');
				  }, function() {
					$('#circleselect')
					.css('background-color', '')
					.css('background-color', 'rgba(255,255,255,1)');
				  }
				);
				$( "#lassoselect" ).hover(
				  function() {
					$('#lassoselect')
					.css('background-color', '')
					.css('background-color', 'rgba(205,205,205,1)');
				  }, function() {
					$('#lassoselect')
					.css('background-color', '')
					.css('background-color', 'rgba(255,255,255,1)');
				  }
				);				
					
				//Drawing function for selections in map.
				$("#circleselect").click(function(){
					myDraw = new Draw(map);
					myDraw.activate(Draw["CIRCLE"]);
					myDraw.on("draw-end", addToMap);
					
					$('#circleselect')
					.css('background-color', '')
					.css('background-color', 'rgba(155,155,155,1)');
				});		
				$("#lassoselect").click(function(){
					myDraw = new Draw(map);
					myDraw.activate(Draw["FREEHAND_POLYGON"]);
					myDraw.on("draw-end", addToMap);
					
					$('#lassoselect')
					.css('background-color', '')
					.css('background-color', 'rgba(155,155,155,1)');
				});					
				
				//Use the shape drawn and query the graphics layer for points within the extent & select in Qlik.
				function addToMap(evt) {
				  var symbol;
				  myDraw.deactivate();
				  map.showZoomSlider();
				  switch (evt.geometry.type) {
					case "point":
					case "multipoint":
					  symbol = new SimpleMarkerSymbol();
					  break;
					case "polyline":
					  symbol = new SimpleLineSymbol();
					  break;
					default:
					  symbol = new SimpleFillSymbol();
					  break;
				  }
				  var graphic = new Graphic(evt.geometry, symbol);
				  map.graphics.add(graphic);	  

				var locvalues = [];
				  
				var myExtent = evt.geometry.getExtent();

				gl.graphics.forEach(function(graphic){
					if (myExtent.contains(graphic.geometry)) {
						var myLoc = graphic.symbol.qElemLoc;
						locvalues.push(myLoc);
					}
				});
			
				app.field(dimensions[0].qGroupFieldDefs[0]).selectValues(locvalues, false, true);
				
				} //addtomap()

					//Whether to show popups or no.
					if(layout.popupshow)
					{
						//Add a popup window while hovering over a marker.
						map.on("mouse-move", function(evt){
							try
							{
								var g = evt.graphic;
								map.infoWindow.setContent(layout.popupwindowbody+ " " + g.symbol.qExpValue);
								map.infoWindow.setTitle(layout.popupwindowtitle);
								map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
							}
							catch(err)
							{
								//Suppress error messages
							}
						});
						//Hide popup when moving out from hover.
						map.on("mouse-out", function() {
								map.infoWindow.hide();
						});
					} //Whether to show popups or no.
							

                });	  
		  
			}; //render
		} //paint
	}
});




