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

		var count = 0;
		var path;
		var i;
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

		
		completeArc.onClick = function(event){
			//completeArc.fillColor.brightness = 1.0;
			//popupText.visible = true;
			//mypath.visible = true;
			for(i = 0; i < definitions.length; i++){
				var top = (50*i)+50;
				var bottom = (50*i)+100;
			rectangles.addChild(new Path.Rectangle(new Rectangle(new Point(50, top), new Point(150, bottom))));
			rectangles.strokeColor = 'black';
			rectangles.fillColor = 'white';
			popupText.addChild(new PointText(new Point(210, bottom)));
			popupText.children[i].content = definitions[i];
			popupText.fillColor = 'black';
		}
			popupText.position = (700, 700);
			rectangles.position = (700, 700);
			path.visible = true;
			//path.add(656,610);

			console.log(popupText);

			for(i = 0; i < definitions.length; i++){
				popupText.children[i].onClick = function(event){
					this.strokeColor = 'red';
				}
			}
			
		}

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

