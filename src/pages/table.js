// Init AppHelper
const appHelper = new AppHelper();

// Init socket
const socket = new SocketManager('pages/table');

// Init Tuio
const tuio = new TuioManager();

// Init Scene
const scene = new SceneManager();
const canvas = scene.initCanvas('canvas', appHelper.getWindowSize());

// Init SelectionBar
new SelectionBar();
