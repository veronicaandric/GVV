# GVV
Gene Variant Validation

### Install & Setup
1. Run `npm run setup` in root directory to setup application.
   > This script installs node modules & replaces incompatible tuio module with compatible one located in `assets` folder.

### Start App
1. Open `root/src/AppHelper.js` and assign the correct IP address to `this.ip`.
2. Run `npm run start` in root directory to start application.
   > This script start the main GVV server

### Testing
1. Run `npm run test` in root directory to run all test suites.
   > Tests are written using the [Mocha](https://mochajs.org/) testing framework along with the [Chai](https://www.chaijs.com/) assertion library, and driven by [WebdiverIO](https://webdriver.io/). Configuration options can be found in `root/wdio.config.js`.
   > Test suites are located in `root/test/specs`, and consist of unit tests & user-journey tests.
   > During test automation (i.e. while tests are running), an instance of the Chrome browser will open and close multiple times.
   > **Tests are currently run only in the Chrome browser. Make sure your chrome browser is updated to the latest version (v74 or higher). Testing Coverage in other browsers coming soon.**
   
2. Run `npm run test:report` to view the test report.
   > Test reports are generated using [Allure Reporter](https://docs.qameta.io/allure/).
   > Test results are stored in `root/test/allure-results` and the generated report is stored in `root/test/allure-report`.
   > Compilation of the report may take a few seconds. Once ready, the report will open in a new browser tab automatically.
