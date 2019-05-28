class SceneManager {
	constructor() {
		//make paper object global
		paper.install(window);

		// paper.setup(canvasID);
		this.mode = null;
	}

	//canvas setup
	initCanvas(canvasID, windowSize) {	
		const { width, height } = windowSize;
		if(width && height) {
			// Create canvas with specified width & height
			const canvas = document.getElementById(canvasID);
			canvas.width = width;
			canvas.height = height;

			const paperCanvas = new Project(canvasID);
			return paperCanvas;
		} else {
			console.error('@SceneManager.initCanvas(canvasID, windowSize): Canvas height and width have not been defined correctly.');
			return null;
		}
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
			console.error('@SceneManager.add(item): Item is not a valid scene object.');
		}
	}
}
