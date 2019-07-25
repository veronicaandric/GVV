class MenuTwo {
	constructor(data, xpos, ypos) {
		this.gene = data;
		//console.log(data);
		return this.initMenu(data, xpos, ypos);
	}

	initMenu(data, xpos, ypos) {
		const x = xpos || view.center.x;
		const y = ypos || 600;

		var outerCircle = new Path.Circle(new Point(x, y), 205);
		outerCircle.fillColor = { hue: 50, saturation: 1, brightness: 0.8, alpha: 1 };
		outerCircle.strokeColor = 'black';
		outerCircle.strokeWidth = 0.3;

		var innerCircle = new Path.Circle(new Point(x, y), 115);
		innerCircle.fillColor = 'white';
		innerCircle.strokeColor = 'black';
		innerCircle.strokeWidth = 0.3;

		if(!data){
			return null;
		}

		let menu = new Group({ name: 'menu' });

		let options = Object.keys(data); 
		console.log("The options are: "+options);
		//let innerRadius = 115;
		/*
		var obj = this.gene;
		var name = completeArc.name.replace('_completeArc','');
		var pathogenicity = obj[name]['pathogenicity'];

		switch(pathogenicity) {
        
			case "benign":
				x = 'green';
				break;
						
			case "likely benign":
				x = '#90EE90';
				break;
						
			case "likely pathogenic":
				x = 'red';
				break;
						
			case "pathogenic":
				x = '#8B0000';
				break;
						
			case "vus":
				x = 'yellow';
				break;
				
			default:
				 x = 'black'
				break;      
		}*/

		options.forEach( (option, i) => {
			var variantCircle = new Path.Circle(new Point(x+205, y+10), 10);
			variantCircle.fillColor = 'green';
			//this.createArc({option: option});
			this.addTouchEvents(variantCircle);
			variantCircle.onMouseDown= function(event) {
				variantCircle.scale(2);
			}
			variantCircle.onDoubleClick= function(event) {
				variantCircle.scale(0.125);
			}
		})

		return menu;
	}

	addTouchEvents(completeArc) {
			//var popupPoint = new Point(650,600);
			//var popupText = new PointText(popupPoint);
            //popupText.fillColor = 'red';
            //popupText.fontSize= 20;
            //popupText.visible = false;
            var obj = this.gene;
            console.log(this.gene);
            //var name = completeArc.name.replace('_completeArc','');
            //var definition = obj[name]['definitions'];
            //popupText.content = "hello";
/*
		completeArc.onMouseEnter = function(event) {
			completeArc.fillColor.brightness = 1.0;
			popupText.visible = true;
		}

		completeArc.onMouseLeave = function(event) {
			completeArc.fillColor.brightness = 0.8;
			popupText.visible = false;
		}

		*/

		var count = 0;
		var path;
		var popupPoint;
		var popupText;
		var mypath;
		var canvas = document.getElementById("canvas");
			path = new Path();
			path.strokeColor = '#00000';
			popupPoint = new Point(700,600);
			popupText = new PointText(popupPoint);
			popupText.fillColor = 'red';
			popupText.fontSize= 20;
			popupText.content = "Hello";
			mypath = new Path();
			mypath.strokeColor = 'black';
			mypath.add(new Point(700, 650)); 
			mypath.add(new Point(700, 550)); 
			mypath.add(new Point(750, 550));
			mypath.add(new Point(750, 650));
			mypath.closed = true;
			popupText.visible = false;
			mypath.visible = false;
			path.visible = false;

		
		completeArc.onClick = function(event){
			//completeArc.fillColor.brightness = 1.0;
			popupText.visible = true;
			mypath.visible = true;
			path.visible = true;
			
		}


		/*canvas.onMouseDown = function(event) {
			// Create a new path and select it:
			//path = new Path();
			//path.strokeColor = '#00000';
			console.log("Create segment");
			path.removeSegment(count);
			// Add a segment to the path where
			// you clicked:
			path.add(800,900);
			count++;
		}*/

		mypath.onMouseDrag = function(event) {
			// Every drag event, add a segment
			// to the path at the position of the mouse:
			//path.add(event.point);
			mypath.position = event.point;
			popupText.position = event.point;
			path.removeSegment(count);
			path.add(656,610);
			path.add(event.point.x - 25, event.point.y);
			count++;
		}

		/*canvas.onMouseUp = function(event) {
			// Every drag event, add a segment
			// to the path at the position of the mouse:
			path.add(event.point.x - 30, event.point.y);
			//mypath.position = event.point;
		}*/


	}
	
}

