class Menu {
	constructor(data, length, xpos, ypos) {
		this.gene = data;
		//console.log(data)
		return this.initMenu(data, length, xpos, ypos);
	}


	initMenu(data, length, xpos, ypos) {
		const x = xpos || view.center.x;
		const y = ypos || 600;
		//1250 for the table top

		var angles = [];
		var segLen = [];
		var totalLen;
		var count = 0;
		var innerRadius = 115;
		var outerRadius = 205;

		var g = new PointText({
		    point: [500, 515],
		    content: 'G',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});

		var e = new PointText({
		    point: [500, 530],
		    content: 'e',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});

		var n = new PointText({
		    point: [500, 545],
		    content: 'n',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});	

		var e2 = new PointText({
		    point: [500, 560],
		    content: 'e',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});	

		var group = new Group();
		group.addChild(g);
		group.addChild(e);
		group.addChild(n);
		group.addChild(e2);
		group.position = [660,600];
		group.visible = false;
		group.pivot = (x,y);
		group.pivot.x = x;
		group.pivot.y = y;

		var outerCircle = new Path.Circle(new Point(x, y), outerRadius);
		outerCircle.fillColor = { hue: 50, saturation: 1, brightness: 0.8, alpha: 1 };
		outerCircle.strokeColor = 'black';
		outerCircle.strokeWidth = 0.3;
		//outerCircle.visible = false;

		var innerCircle = new Path.Circle(new Point(x, y), innerRadius);
		innerCircle.fillColor = 'black';
		innerCircle.strokeColor = 'black';
		innerCircle.strokeWidth = 0.3;

		/*
		var pointOnInCir = x,y+{
		    length: innerRadius,
		    angle: 0
		};

		console.log("Point on circle is"+pointOnInCir);

		var pointOnOutCir = view.center+{
		    length: outerRadius,
		    angle: 0
		};

		console.log("Point on circle is"+pointOnOutCir);
		*/
		
		if(!data){
			return null;
		}

		if(!length){
			return null;
		}

		let geneLen = Object.keys(length);

		//console.log(geneLen);

		geneLen.forEach( (geneName, i) => {
			//totalLen = totalLen + length[geneName]['length'][i];
			//console.log(totalLen);
			//totalLen.push(length[geneName]['length']);
			//Array.prototype.push.apply(segLen, length[geneName]['length']);
			//totalLen.push.apply(segLen, length[geneName]['length']);
			//console.log(segLen);
			var i;
			var temp = length[geneName]['length'];
			var value = 0;
			for(i = 0; i < temp.length; i++){
				value = value + temp[i];
			}
			//totalLen.push.apply(segLen, value);
			segLen[count] = value;
			//console.log(segLen[count]);
			count++;

		})

		totalLen = this.totLen(segLen);
		angles = this.calAngles(segLen, totalLen);
		//console.log(angles);
		var newgroup = this.createLines(angles, x, y, innerRadius, outerRadius);
		//console.log(newgroup);

		let options = Object.keys(data); 
		//console.log("The options are: "+options);
		//let arcAngle = 0;
		//let currFiberAngle = 0;
		//let innerRadius = 115;

		options.forEach( (option, i) => {
			//console.log("The option is "+option);
			//console.log("The gene num is "+i);
			//console.log(option);
			//console.log(data[option]);
			this.rotateLines(i, newgroup.group1, newgroup.array1, group, data[option]);

		})

		//this.geneText();
	}

/*
	geneText(){
		var g = new PointText({
		    point: [500, 515],
		    content: 'G',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});

		var e = new PointText({
		    point: [500, 530],
		    content: 'e',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});

		var n = new PointText({
		    point: [500, 545],
		    content: 'n',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});	

		var e2 = new PointText({
		    point: [500, 560],
		    content: 'e',
		    fillColor: 'black',
		    fontFamily: 'Courier New',
		    fontWeight: 'bold',
			rotation: 90,
		    fontSize: 25
		});	

		var group = new Group();
		group.addChild(g);
		group.addChild(e);
		group.addChild(n);
		group.addChild(e2);
		group.position = [660,600];
	}
	*/

	totLen(len) {
		var i;
		var length = 0;
		for(i = 0; i < len.length; i++){
			length = length + len[i];
		}
		//console.log(length);
		return length;
	}

	calAngles(len, total){
		var i;
		var angle = [];
		for(i = 0; i < len.length; i++){
			angle[i] = (len[i]/total)*360;
			//console.log(angle[i]);
		}
		return angle;
	}

	createLines(angle, pivotx, pivoty, pointIn, pointOut){
		var i;
		var angleRef = [];
		var totalAngle = 0;
		var from = new Point(pivotx+pointIn, pivoty);
		var to = new Point(pivotx+pointOut, pivoty);
		var group = new Group([new Path.Line(from, to)]);
		group.children[0].pivot = (pivotx,pivoty);
		group.children[0].pivot.x = pivotx;
		group.children[0].pivot.y = pivoty;
		group.strokeColor = 'black';
		group.strokeWidth =10;
		angleRef[0] = 0;

		//console.log("Line created");

		for(i = 1; i < angle.length; i++){
			totalAngle = totalAngle + angle[i];
			angleRef[i] = totalAngle;
			group.addChild(new Path.Line(from, to));
			//console.log(group);
			group.strokeColor = 'black';
			group.children[i].pivot = (pivotx,pivoty);
			group.children[i].pivot.x = pivotx;
			group.children[i].pivot.y = pivoty;
			group.children[i].rotate(angleRef[i]);
			
		}

		//return (group, angleRef);
		return {group1: group, array1: angleRef};
	}

	rotateLines(num, group, angleRef, group2, nextLayer){
		var i;
		var count = 1;
		var angleOne = angleRef[num];
		var angleTwo;
		var angleRot = [];
		var division = 20/(angleRef.length - 1);
		var counter = 0;
		var value;
		var menuTwo;
		//console.log(group.children[num]);
		//console.log(num);
		group.children[num].onClick = function(event) {
			//console.log(this);
    		//this.fillColor = 'red';
    		for(i = num+1; i < angleRef.length; i++){
    			angleTwo = angleOne + (division*count);
    			if(angleRef[i] > angleTwo){
    				//console.log("The reference angle is "+angleRef[i]);
    				angleRot[count-1] = (-1)*(angleRef[i] - angleTwo);
    				//value = (-1)*(360/angleRot[count-1]);
    				//group.children[i].rotate(angleRot[count-1]);
    				value = angleRot[count-1]/10;
    				myAnimation(group.children[i], value);
    				
    				/*
	    			paper.view.attach('frame', firstAnimation);
						//startFirstAnimation(this);
					function firstAnimation(event)
					{
						if(counter <= 36)
						{
						    console.log(counter);
							counter++;
							group.children[i].rotate(angleRot[count-1]);
							//firstLabel.content = 'First animation count: ' + event.count;
						}
						else
						{	counter = 0;
							paper.view.detach('frame', firstAnimation);
							console.log("first animation finished");
						}
					}*/
    				console.log(angleRot[count-1]);
    			}
    			else{
    				angleRot[count-1] = (-1)*(angleRef[i] + (360 - angleTwo));
    				console.log(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = angleRot[count-1]/10;
    				myAnimation(group.children[i], value);
    				//group.children[i].rotate(angleRot[count-1]);
    			}
    			count++;

			}

			for(i = 0; i < num; i++){
    			angleTwo = angleOne + (division*count);
    			//console.log(angleTwo);
    			if(angleRef[i] > angleTwo){
    				angleRot[count-1] = (-1)*(angleRef[i] - angleTwo);
    				//group.children[i].rotate(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = angleRot[count-1]/10;
    				myAnimation(group.children[i], value);
    				console.log(angleRot[count-1]);
    			}
    			else{
    				angleRot[count-1] = (-1)*(angleRef[i] + (360 - angleTwo));
    				console.log(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = angleRot[count-1]/10;
    				myAnimation(group.children[i], value);
    				//group.children[i].rotate(angleRot[count-1]);
    			}
    			count++;

			}

			group2.rotate(angleOne + 10);
			group2.visible = true;
			menuTwo = new MenuTwo(nextLayer);
			//call menutwo
		}

		group2.onClick = function(event) {
			console.log(menuTwo);
			group2.visible = false;
			count = 1;
			console.log(angleRot);
			//console.log(this);
    		//this.fillColor = 'red';
    		for(i = 0; i < num; i++){
    			angleTwo = angleOne + (division*count);
    			//console.log(angleTwo);
    			if(angleRef[i] > angleTwo){
    				//angleRot[count-1] = (-1)*(angleRef[i] - angleTwo);
    				//group.children[i].rotate(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = (-1)*(angleRot[count-1]/10)
    				myAnimation(group.children[i], value);
    				console.log(angleRot[count-1]);
    			}
    			else{
    				//angleRot[count-1] = (-1)*(angleRef[i] + (360 - angleTwo));
    				console.log(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = (-1)*(angleRot[count-1]/10)
    				myAnimation(group.children[i], value);
    				//group.children[i].rotate(angleRot[count-1]);
    			}
    			count++;

			}

    		for(i = num+1; i < angleRef.length; i++){
    			angleTwo = angleOne + (division*count);
    			if(angleRef[i] > angleTwo){
    				//console.log("The reference angle is "+angleRef[i]);
    				//angleRot[count-1] = (-1)*(angleRef[i] - angleTwo);
    				//value = (-1)*(360/angleRot[count-1]);
    				//group.children[i].rotate(angleRot[count-1]);
    				value = (-1)*(angleRot[count-1]/10);
    				myAnimation(group.children[i], value);
    				
    				/*
	    			paper.view.attach('frame', firstAnimation);
						//startFirstAnimation(this);
					function firstAnimation(event)
					{
						if(counter <= 36)
						{
						    console.log(counter);
							counter++;
							group.children[i].rotate(angleRot[count-1]);
							//firstLabel.content = 'First animation count: ' + event.count;
						}
						else
						{	counter = 0;
							paper.view.detach('frame', firstAnimation);
							console.log("first animation finished");
						}
					}*/
    				console.log(angleRot[count-1]);
    			}
    			else{
    				//angleRot[count-1] = (-1)*(angleRef[i] + (360 - angleTwo));
    				console.log(angleRot[count-1]);
    				//value = (-1)*(360/angleRot[count-1]);
    				value = (-1)*(angleRot[count-1]/10)
    				myAnimation(group.children[i], value);
    				//group.children[i].rotate(angleRot[count-1]);
    			}
    			count++;

			}

		}

		function myAnimation(obj, rot) {
			var counter = 0;
			paper.view.attach('frame', firstAnimation);
			console.log("first animation start");
		
		function firstAnimation(event)
		{
			//to control speed
			//if (event.count % 10 === 0) {
			if(counter <= 9)
			{
			    console.log("first animation running");
				counter++;
				obj.rotate(rot);
				//firstLabel.content = 'First animation count: ' + event.count;
			}
			else
			{
				counter = 0;
				paper.view.detach('frame', firstAnimation);
				console.log("first animation finished");
			}
		//}
		}

		}

	}

	addTouchEvents(completeArc, groupArc, user) {
		/*
		completeArc.on('click',() => {
			groupArc.fillColor.brightness = 1.0;
			var obj = this.gene;
			var name = completeArc.name.replace('_completeArc','');
			new MenuTwo(obj[name]);
		})

        groupArc.fillColor.brightness = 0.8;
        */

	}
}
