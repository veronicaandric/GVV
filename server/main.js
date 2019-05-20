const Bundler = require('parcel-bundler');
const app = require('express')();
const path = require('path');

const { socketServer } = require('./socketServer');
const { tuioServer } = require('./tuioServer');
const { tcpServer } = require('./tcpServer');

const file = path.join(__dirname, '../', 'src', 'index.html'); // Entrypoint
const options = {
  outDir: './dist',
  outFile: 'index.html',
  watch: true,
  cache: true,
  cacheDir: '.cache',
  contentHash: false,
  global: 'moduleName',
  minify: false,
  scopeHoist: false,
  target: 'browser',
  bundleNodeModules: true,
  https: false,
  logLevel: 3,
  hmr: true,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: '',
  detailedReport: false,
};

(async function start() {
  // Initialize a new bundler using a file and options
  const bundler = new Bundler(file, options);

  // Let express use the bundler middleware
  // This will let Parcel handle every request over your express server
  app.use(bundler.middleware());

  // Listen on port 8080
  app.listen(8080, () => {
    console.log('Server started on port 8080');
  });

  app.on('error', () => {
    console.log('Port 8080 is taken, choose another.');
  });

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode
  // This promise will only trigger once and not for every rebuild
  await bundler.bundle();

  bundler.on('buildEnd', () => {
    // Do something...
  });
}());

// Start Socket server
socketServer(app);

// Start Tuio server
tuioServer(app);

// Start TCP server
tcpServer();
