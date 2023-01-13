import { defineConfig } from "cypress";

export default defineConfig({
  //cypress settings
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: { "runMode": 1, "openMode": 0 },
  video: true,
  screenshotOnRunFailure: true,

  e2e: {
    //baseUrl could be changed by eg. command line parameters to adjust to eg. different envst
    baseUrl: "http://localhost:4200",
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*'],
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      // setup external json parsing with eg. different test env variables

      //return config
    }
  },

  //reporter settings
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Awesome report with charts and screenshots!',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  //environment variables, extended by cypress.env.json; possible to put cypress.env.json to .gitignore and store less sensive data as local files
  env: {
    username: "aa@aa.aa",
    password: "test1",
    apiUrl: "api.realworld.io/",
    firstName: "John",
    lastName: "Doe",
    age: "35",
    email: "testmail@test.com"
  }
});