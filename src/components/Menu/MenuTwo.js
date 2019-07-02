class MenuTwo {
	constructor(data, xpos, ypos) {
		this.gene = data;
		//console.log(data)
		return this.initMenu(data, xpos, ypos);
	}

	initMenu(data, xpos, ypos) {
		const x = xpos || view.center.x;
		const y = ypos || 600;

		if(!data){
			return null;
		}

		let menu = new Group({ name: 'menu' });

		let options = Object.keys(data); 
		//console.log("The options are: "+options);
		let arcAngle = 0;
		let currFiberAngle = 0;
		let innerRadius = 115;

		options.forEach( (option, i) => {

			//reference circle for drawing menu
			let menuRef = new Path.Circle({ center: [x, y], radius: (innerRadius + 90)/*175*/, name: 'menuRef' });
			menuRef.remove();

			//reference circle for drawing arc names
			let textRef = new Path.Circle({ center: [x, y], radius: (innerRadius + 45)/*130*/, name: 'textRef' });
			textRef.strokeWidth = 3;
			textRef.strokeColor = new Color(0, 0, 0, 1.0);;
			menu.addChild( textRef );
			textRef.remove();

			//draw menu bounds
			if( !menu.children['menuBounds'] ) {
				menu.addChild( this.getMenuBounds(menuRef) );
			}

			//get arc length and arc text position
			let arcParameters = this.getArcParameters({
				menuRef_length: menuRef.length,
				textRef_length: textRef.length,
				numArcs: options.length,
				option: option,
				arcType: ''
			})

			//create experimental group arc
			menu.addChild( this.createArc({
					option: option, 
					menuRef: menuRef, 
					textRef: textRef, 
					numArcs: options.length, 
					arcLength: arcParameters.arcLength, 
					arcAngle: arcAngle, 
					textPos: arcParameters.textPos, 
					innerRadius: innerRadius, 
					pathogenicity: data[option]['pathogenicity'],
					arcType: ''
				})
			)

			// get arc rotation angle for next arc
			arcAngle = this.getArcAngle(option, arcAngle, '', options.length);
		})

		return menu;
	}

	getArcParameters(args) {
		let arcLength = 0;
		let textPos = 0;

		if(args.numArcs > 1) {
			arcLength = args.menuRef_length/args.numArcs;
			textPos = args.textRef_length/args.numArcs;
		}
		else {
			textPos = args.textRef_length;
		}

		return { arcLength: arcLength, textPos: textPos };
	}

	getArcAngle(option, arcAngle, arcType, numArcs) {
		let angle = 0;

		angle = arcAngle + (360/numArcs);

		return angle;
	}

	createArc(args) {
		//init arc
		var tempGroupArc = new Path();
		tempGroupArc.moveTo(args.menuRef.position);
		tempGroupArc.lineTo(args.menuRef.getPointAt(0));

		if( args.numArcs > 1 ){
			tempGroupArc.arcTo( args.menuRef.getPointAt(args.arcLength/2), args.menuRef.getPointAt(args.arcLength) );
			tempGroupArc.closePath();
			tempGroupArc.rotate( args.arcAngle, args.menuRef.position );	
		}
		else{
			tempGroupArc.arcTo(args.menuRef.getPointAt( args.menuRef.length / 2 ), args.menuRef.getPointAt( args.menuRef.length - 0.1 ));
			tempGroupArc.closePath()
		}

		//style arc
		let groupArc = this.styleArc( tempGroupArc, args.menuRef, args.innerRadius, args.pathogenicity );
		groupArc.name = args.option + '_arc';

		//arc text
		let arcText = this.createArcText(args.option, args.textRef, args.textPos, args.arcAngle);


		let completeArc = new Group({ name: args.option + '_completeArc', children: [groupArc, arcText] });

		return completeArc;
	}

	styleArc(tempGroupArc, menuRef, innerRadius, pathogenicity) {
		tempGroupArc.strokeColor = new Color(0, 0, 0, 1.0);
		tempGroupArc.strokeWidth = 0.3;
		tempGroupArc.fillColor = { hue: 50, saturation: 1, brightness: 0.8, alpha: 1 };

		//inner cutout for tangible
		let cutout = new Path.Circle({ center: menuRef.position, radius: innerRadius });
		let groupArc = tempGroupArc.subtract( cutout );

		tempGroupArc.remove();
		cutout.remove();

		return groupArc;
	}

	createArcText(option, textRef, textPos, arcAngle) {
		var name = option;
		var fullname = name.split(':');
		var variance = fullname[3];
		let arcText = new PointText({
		    point: [textRef.getPointAt(textPos/2).x + 3, textRef.getPointAt(textPos/2).y - (option.split('\n').length * 6)], //center text y-pos using #lines as offset
		    content: variance,
		    fillColor: new Color(0, 0, 0, 1.0),
		    fontFamily: 'Calibri',
		    justification: 'center',
		    fontSize: '1em',
		    fontWeight: 'bold',
		    name: 'arcText',
		    rotation: 270 + (((textPos/2)/textRef.length)*360)
		});
		arcText.rotate( arcAngle, textRef.position );

		return arcText;
	}


	getMenuBounds(menuRef) {
		let menuBounds = new Group({
			name: 'menuBounds',
			children: [
				new Path.Line({
				  	from: [ menuRef.position.x, menuRef.position.y - 450 ],
				   	to: [ menuRef.position.x, menuRef.position.y + 450 ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'verticalBounds'
				}),
				new Path.Line({
				  	from: [ menuRef.position.x - 450, menuRef.position.y ],
				   	to: [ menuRef.position.x + 450, menuRef.position.y ],
				   	strokeColor: new Color(0, 0, 0, 0),
				   	strokeWidth: 1,
				   	name: 'horizontalBounds'
				})
			]
		});
		
		return menuBounds;
	}
	
}

