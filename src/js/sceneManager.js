class SceneManager {
	constructor(canvasOrientation) {
		//make paper object global
		paper.install(window);

		this.canvasOpts = null;

  		// paper.setup(canvasID);
  		this.orientation = canvasOrientation;
  		this.mode = null;
	}

	//canvas setup
	initCanvas(canvasID, canvasOpts) {	
		if(!canvasOpts){
			console.warn('Canvas height and width not defined.');
			return null;
		} 

		const opts = Object.assign({}, canvasOpts);
		
		// Save reference to canvas width & height
		this.setCanvasOpts(opts);

		// Create canvas with specified width & height
		const canvas = document.getElementById(canvasID);
		canvas.width = opts.width;
		canvas.height = opts.height;

		const paperCanvas = new Project(canvasID);
		return paperCanvas;
	}

	//draws canvas
	draw() {
		view.draw();
	}

	setMode(mode) {
		this.mode = mode;
	}

	getMode() {
		return this.mode;
	}

	//adds single object to the current scene
	add(items) {
		if(Array.isArray(items)){
			project.activeLayer.addChildren(items);
		}
		else if(typeof(items) === 'object'){
			project.activeLayer.addChild(items);
		}
		else{
			throw "Not valid scene object.";
		}
	}

	//adds multiple objects to the scene simultaneously
	//***items: array containing the objets to be added
	// addMulti(items) {
	// 	project.activeLayer.addChildren(items);
	// }

	//removes the object specified by 'ids' from the scene
	remove(ids, recursive) {
		if(Array.isArray(ids)){
			ids.forEach( id => {
				let item = project.getItem({
					name: id
				})

				if(item){ project.activeLayer.children[item.name].remove(); }
			})
		}
		else if(typeof(ids) === 'string'){
			if(recursive){
				project.getItems({
					name: val => {
						if(val) { 
							return val.includes(ids); 
						}
					}
				}).forEach( item => {
					if(item){ project.activeLayer.children[item.name].remove(); }
				})
			}
			else{
				let item = project.getItem({
					name: ids
				})

				if(item){ project.activeLayer.children[item.name].remove(); }
			}
		}
		else{
			throw "Object ID not valid.";
		}
	}

	//clears the scene of all objects (black canvas)
	removeAll() {
		project.activeLayer.children = [];
	}

	// Set canvas specs
	setCanvasOpts(opts) {
		this.canvasOpts = opts;
	}

	//returns the canvas specs
	getCanvasOpts() {
		return this.canvasOpts;
	}

	getItemByName(name) {
		let item = project.getItem({
			name: val => { 
				if(val){ 
					return val.includes(name);
				}
			}
		})

		return item;
	}

	//creates loading text
	initLoadingText(msg) {
		var loadingText = new PointText({
			    point: [ this.canvasOpts.width/2,  this.canvasOpts.height/3 ],
			    content: msg,
			    fillColor: new Color(255, 0, 0, 1),
			    fontFamily: 'Calibri',
			    justification: 'center',
			    fontSize: '3em',
			    name: 'loadingText'
			});

		// loadingText.remove();
		// return loadingText;
	}

	initTitle(opts){
		if(opts.hasOwnProperty('heading')){
			let heading = new PointText({
			    point: [ this.getCanvasOpts().width/2, 50 ],
			    content: opts.heading,
			    fillColor: new Color(0, 0, 0, 1),
			    fontFamily: 'Arial',
			    fontWeight: 'bold',
			    justification: 'center',
			    fontSize: '2.5em',
			    name: 'pageHeading'
			});
		}
		
		if(opts.hasOwnProperty('subHeading')){
			let subHeading = new PointText({
			    point: [ this.getCanvasOpts().width/2, 85 ],
			    content: opts.subHeading,
			    fillColor: new Color(0, 0, 0, 1),
			    fontFamily: 'Calibri',
			    fontWeight: 'bold',
			    justification: 'center',
			    fontSize: '1.5em',
			    name: 'pageSubHeading'
			});
		}
	}

}