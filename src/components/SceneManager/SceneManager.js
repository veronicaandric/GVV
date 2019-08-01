class SceneManager {
	constructor() {
		// Make paper object global
		paper.install(window);
		this.mode = null;
	}

	// Canvas setup
	// @param: canvasID should be a string and match the html canvas element id
	// @param: windowSize should be an object containing the veiwport width & height
	initCanvas(canvasID, windowSize) {	
		const { width, height } = windowSize;
		if(width && height) {
			// Create canvas with specified width & height
			const canvas = document.getElementById(canvasID);
			canvas.width = width;
			canvas.height = height;

			const paperCanvas = new Project(canvasID);
			
			//const tool = new Tool();
        	//tool.fixedDistance = 0;
			return paperCanvas;
		} else {
			console.error('@SceneManager.initCanvas(canvasID, windowSize): Canvas height and width have not been defined correctly.');
			return null;
		}
	}

	// Set scene mode
	setMode(mode) {
		this.mode = mode;
	}

	// Get scene mode
	getMode() {
		return this.mode;
	}

	// Adds single object to the current scene
	add(items) {
		if(Array.isArray(items)){
			project.activeLayer.addChildren(items);
		}
		else if(typeof(items) === 'object'){
			project.activeLayer.addChild(items);
		}
		else{
			console.error('@SceneManager.add(item): Item is not a valid scene object.');
		}
	}

	// Removes object specified by its name from the scene
	// @param: name can be a string or an array of strings
	// if name is array of strings, then all objects with names matching exactly those string will be removed
	// if name is a string, then the object name matching exactly that string will be removed
	
	// @ param: recursive should be a boolean and only works when name is a string (i.e. not an array)
	// if true, then all object names partially matching the 'name' string will be removed
	remove(name, recursive) {
		if(Array.isArray(name)){
			name.forEach( id => {
				let item = project.getItem({
					name: id
				})

				if(item){ project.activeLayer.children[item.name].remove(); }
			})
		}
		else if(typeof(name) === 'string'){
			if(recursive){
				project.getItems({
					name: val => {
						if(val) { 
							return val.includes(name); 
						}
					}
				}).forEach( item => {
					if(item){ project.activeLayer.children[item.name].remove(); }
				})
			}
			else{
				let item = project.getItem({
					name: name
				})

				if(item){ project.activeLayer.children[item.name].remove(); }
			}
		}
		else{
			console.error('@SceneManager.remove(name, recursive): Invalid object ID.');
		}
	}

	// Clears the scene of all objects (black canvas)
	removeAll() {
		project.activeLayer.children = [];
	}

	// Retrieves object from scene using its name
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
}
