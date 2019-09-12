class MenuTwo {
	constructor(data, xpos, ypos) {
		this.gene = data;
		//console.log(data);
		return this.initMenu(data, xpos, ypos);
	}

	initMenu(data, xpos, ypos) {
		const x = xpos || view.center.x;
		const y = ypos || 600;
		//1250 for the table top

		if(!data){
			return null;
		}

		let menu = new Group({ name: 'menu' });

		let options = Object.keys(data); 
		console.log("The options are: "+options);

		var location = 20;

		options.forEach( (option, i) => {
			var variantCircle = new Path.Circle(new Point(x+205, y+location), 10);
			var x_pos = x+205;
			var y_pos = y+location;
			location = location + 10;
			variantCircle.fillColor = 'green';
			console.log("The variance selected is"+option);
			//this.createArc({option: option});
			this.addTouchEvents(variantCircle, option, x_pos,y_pos);
		})

		return menu;
	}

	addTouchEvents(completeArc, variance, x, y) {
            var obj = this.gene;
            //var name = Object.keys(obj);
            //console.log(name);
            var definitions = Object.keys(obj[variance]['definitions']);

            //console.log(definitions);

            completeArc.onClick = function(event){
            	//this.fillColor = 'red';
            	var mousePosition;
				var offset = [0,0];
				var div;
				var isDown = false;
				var div2;

				div = document.createElement("div");
				div.style.position = "absolute";
				div.style.left = "700px";
				div.style.top = "600px";
				div.style.width = "100px";
				//div.style.height = "100px";
				div.style.background = "red";
				div.style.color = "blue";

				var height = 0;

				document.body.appendChild(div);

				for(var i=0; i<definitions.length; i++){
					var collapsible = document.createElement("BUTTON");	
					collapsible.innerHTML = definitions[i];
					collapsible.style.width = "100px";
					collapsible.style.height = "50px";
					collapsible.className = "collapsible";
					height = height + 50;
					div.style.height = height+"px";
					//console.log(height);
					var content = document.createElement("div");
					content.style.width = "100px";
					content.style.maxHeight = "200px";
					content.style.background = "red";
					content.style.color = "black";
					content.className = "content";

					div.appendChild(collapsible);

					var db = obj[variance]['definitions'][definitions[i]]['db']['name'];
					var database = document.createElement("BUTTON");	
					database.innerHTML = "Databases:";
					database.style.width = "100px";
					database.style.height = "10px";
					content.appendChild(database);
					//console.log(content);

					var select = obj[variance]['definitions'][definitions[i]]['db']['in_use'];

					for(var x=0; x<db.length; x++){
						if(select[x] == "true"){
							var dbName = document.createElement("p");	
							var node = document.createTextNode('\u2714'+db[x]);
							dbName.appendChild(node);
							content.appendChild(dbName);
						}

						else if(select[x] == "false"){
							var dbName = document.createElement("p");	
							var node = document.createTextNode('\u2716'+db[x]);
							dbName.appendChild(node);
							content.appendChild(dbName);
						}

					}

					var th = obj[variance]['definitions'][definitions[i]]['threshold']['value'];
					console.log(th);
					var threshold = document.createElement("BUTTON");	
					threshold.innerHTML = "Threshold:";
					threshold.style.width = "100px";
					threshold.style.height = "10px";
					//var threshold = document.createElement("LINK");
					//var text = document.createTextNode("Threshold");
					//threshold.appendChild(text);
					//threshold.style;
					//console.log(threshold);
					content.appendChild(threshold);
					//console.log(content);

					//var select = obj[variance]['definitions'][definitions[i]]['db']['in_use'];

					//for(var x=0; x<db.length; x++){
							var thValue = document.createElement("p");	
							var nodeTwo = document.createTextNode(th);
							thValue.appendChild(nodeTwo);
							content.appendChild(thValue);

					//}

					div.appendChild(content);
					content.style.display = "none";
					//console.log(db);																												
				}

				//console.log(content);

				collapsible = document.getElementsByClassName("collapsible");
				//content = document.getElementsByClassName("content");

				//console.log(collapsible);
				//console.log(content);

				
				for (i = 0; i < collapsible.length; i++) {
					console.log(i);
				  collapsible[i].addEventListener("click", function() {
				  	//console.log(content[i]);
				    this.classList.toggle("active");
				    var content = this.nextElementSibling;
				    //console.log(content);
				    //console.log(this.previousElementSibling);
				    //this represents the button
				    
				    if (content.style.display == "block") {
				      content.style.display = "none";
				    } else {
				      content.style.display = "block";
				      //console.log(content);
				    }
				    

				    //console.log(div.childNodes);
				    console.log(i);
				    var con = div.childNodes;

				    for(var x =0; x < con.length; x+=2){
				    	if(x == (i+1)){
				    		//console.log(x);
				    		//console.log(con[x]);
				    	}
				    }

				    /*
				    if (content.style.maxHeight) {
				      content.style.maxHeight = null;
				    } else {
				      content.style.maxHeight = "100px";
				      console.log(content);
				    }*/
				  });
				}
				
				/*
				for (var i = 0; i < collapsible.length; i++) {
					//console.log(i);
				    collapsible[i].onclick = function() {
				    	var setClasses = !this.classList.contains('active');
				        setClass(collapsible, 'active', 'remove');
				        setClass(content, 'show', 'remove');
				        
				       	if (setClasses) {
				            this.classList.toggle("active");
				            this.nextElementSibling.classList.toggle("show");
				        }
				    }
				}*/

				function setClass(els, className, fnName) {
				    for (var i = 0; i < els.length; i++) {
				        els[i].classList[fnName](className);
				    }
				}
				

				div.addEventListener('mousedown', function(e) {
				    isDown = true;
				    offset = [
				        div.offsetLeft - e.clientX,
				        div.offsetTop - e.clientY
				    ];
				}, true);

				document.addEventListener('mouseup', function() {
				    isDown = false;
				}, true);

				document.addEventListener('mousemove', function(event) {
				    event.preventDefault();
				    if (isDown) {
				        mousePosition = {
				    
				            x : event.clientX,
				            y : event.clientY
				    
				        };
				        div.style.left = (mousePosition.x + offset[0]) + 'px';
				        div.style.top  = (mousePosition.y + offset[1]) + 'px';
				    }
				}, true);


            }


		var count = 0;
		var path;
		var i;
		//var oldX = [];
		var oldY = [];
		//var oldHeight = [];
		//var oldWidth = [];
		/*
		var popupPoint;
		var popupText;
		var mypath;
			path = new Path();
			path.strokeColor = '#00000';
			popupPoint = new Point(700,600);
			popupText = new PointText(popupPoint);
			popupText.fillColor = 'red';
			popupText.fontSize= 20;
			popupText.content = definitions[0];
			popupText.content = definitions[1];*/
			//mypath = new Path();
			//mypath.strokeColor = 'black';
			//mypath.add(new Point(700, 650)); 
			//mypath.add(new Point(700, 550)); 
			//mypath.add(new Point(750, 550));
			//mypath.add(new Point(750, 650));
			//mypath.closed = true;
			//popupText.visible = false;
			//mypath.visible = false;
			//path.visible = false;
			var tool = new Tool();
			//var tool2 = new Tool();
			//var newgroup = new Group([tool1, tool2]);
			//tool.fixedDistance = 25;
			var rectangles = new Group();
			var popupText = new Group();
			var popupText;
			var path = new Path();
			path.strokeColor = 'black';

		/*
		completeArc.onClick = function(event){
			//completeArc.fillColor.brightness = 1.0;
			//popupText.visible = true;
			//mypath.visible = true;
			for(i = 0; i < definitions.length; i++){
				//var top = (50*i)+50;
				var y = (50*i);
				oldY[i] = y;
 			rectangles.addChild(new Path.Rectangle(new Rectangle(700, y, 100, 50))); 
			rectangles.strokeColor = 'black';
			rectangles.fillColor = 'white';
			popupText.addChild(new PointText(new Point(700, y)));
			popupText.children[i].content = definitions[i];
			popupText.children[i].name = definitions[i];
			popupText.fillColor = 'black';
			}
			popupText.position = (700, 700);
			rectangles.position = (700, 700);
			path.visible = true;
			//path.add(656,610);

			//console.log(popupText);

			for(i = 0; i < definitions.length; i++){
				var textHeight = 700;
				//rectangles.children[i].visible = false;
				//console.log(i);
				popupText.children[i].onClick = function(event){

					this.strokeColor = 'red';
					//console.log(this.name);
					//var temp = this.name;
					var k;
					//console.log(rectangles);
					for(k = 0; k < definitions.length; k++){
						//console.log(definitions[k]);
						
						if(definitions[k] == this.name){
							console.log(this.name);
							var defName = this.name;

							//rectangles.children[k].visible = false;
							//rectangles.visible = false;

							//rectangles.addChild(new Path.Rectangle(new Rectangle(700,oldY[k],100,150)));
							//rectangles.children[k+3].visible = true;
							//rectangles.strokeColor = 'black';

							var newRect = new Path.Rectangle(new Rectangle(700,700,100,150));
							newRect.strokeColor = 'black';
							newRect.fillColor = 'white';
							newRect.position = event.point;
							var text = new Group();
							var num = 0;
							text.addChild(new PointText(new Point(700, 700)));
							text.fillColor = 'black';
							text.children[num].content = 'Databases:';
							num++;
							var db = obj[variance]['definitions'][this.name]['db'];
							console.log(db);
							for(var h = num; h <= db.length; h++){
								//console.log(text);
								textHeight = textHeight + 25;
								text.addChild(new PointText(new Point(700, textHeight)));
								text.children[h].content = db[h-1];
								text.fillColor = 'black';
								//console.log(text);
								num++;
							}
							textHeight = textHeight + 25;
							//popupText.addChild(text);

							text.addChild(new PointText(new Point(700, textHeight)));
							text.fillColor = 'black';
							text.children[num].content = 'Thresholds:';
							num++;
							var th = obj[variance]['definitions'][this.name]['threshold'];
							console.log(db);
							for(var h = 0; h < th.length; h++){
								//console.log(text);
								textHeight = textHeight + 25;
								text.addChild(new PointText(new Point(700, textHeight)));
								text.children[num].content = th[h];
								text.fillColor = 'black';
								//console.log(text);
								num++;
							}

							text.position.x = event.point.x;
							text.position.y = event.point.y;

							rectangles.addChild(newRect);
							//console.log(event.point);

							rectangles.addChild(text);

							var tempCount = 1;

							for(var o = k; o >= 0; o--){
								var tempY = (50*tempCount) + 50;
								tempCount = tempCount + 1;
								//console.log(tempY);
								rectangles.children[o].position.x = event.point.x;
								popupText.children[o].position.x = event.point.x;
								rectangles.children[o].position.y = event.point.y - tempY;
								popupText.children[o].position.y = event.point.y - tempY;
								//console.log(rectangles.children[o].position);
							}

							tempCount = 1;
							for(var o = k+1; o < definitions.length; o++){
								//console.log(o);
								var tempY = 50*tempCount + 50;
								tempCount = tempCount + 1;
								//console.log(tempCount);
								rectangles.children[o].position.x = event.point.x;
								popupText.children[o].position.x = event.point.x;
								rectangles.children[o].position.y = event.point.y + tempY;
								popupText.children[o].position.y = event.point.y + tempY;
								//console.log(rectangles.children[o].position);
							}

							//var copy = rectangles.children[k].clone();
							//copy.scale(1,5);
							//copy.visible = true;
							
							/*
							var x = 700;
							//console.log(x);
							var y = oldY[k];
							var width = 100;
							var oldHeight = 50;
							console.log(oldHeight);
							var height = 3*(oldHeight);
							var newHeight = (oldHeight/2) + height;
							console.log(newHeight);
							var t;
							rectangles.addChild(new Path.Rectangle(new Rectangle(x,y,width,height)));
							rectangles.strokeColor = 'black';
							console.log(rectangles);
							for(t = k; t < definitions.length; t++){
								rectangles.children[t].position.y = newHeight;
							}
						}
					}*/
					/*
					rectangles.children[k].visible = false;
					var x = rectangles.children[k].x;
					var y = rectangles.children[k].y;
					var width = rectangles.children[k].width;
					var oldHeight = rectangles.children[k].height;
					var height = 3*(oldHeight);
					var newHeight = (oldHeight/2) + height;
					var t;
					rectangles.addChild(new Path.Rectangle(new Rectangle(x,y,width,height)));
					rectangles.strokeColor = 'black';
					for(t = i; t < definitions.length; t++){
						rectangles.children[t].position.y = newHeight;
					}*/
			//	}
			//}
			
		//}

		/*
		mypath.onClick = function(event){
			//tool.attach();
			//controlDrag();
			tool = new Tool();
			tool.fixedDistance = 25;
		}*/
		

		//function controlDrag(){

			rectangles.onMouseDrag = function(event) {
				this.position = event.point;
				popupText.position = event.point;
				path.removeSegment(count);
				path.add(x,y);
				path.add(event.point.x - 25, event.point.y);
				path.sendToBack();
				count++;
				//tool.detach();
			}
		//}
		//console.log(popupText);

		/*for(i =0; i<definitions.length; i++){
			popupText.children[i].onClick = function(event){
			this.strokeColor = 'red';
		}
		}*/

	}
	
}

