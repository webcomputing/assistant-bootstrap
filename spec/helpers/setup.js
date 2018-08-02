require("reflect-metadata");
let initializeSetups = require("../../index").initializeSetups;
let AssistantSource = require("assistant-source");
let AssistantAuthentication = require("assistant-authentication");
let alexa = require("assistant-alexa");
let google = require("assistant-google");

beforeEach(function() {
  // Initialize AssistantJS spec helper and register some useful abbrevations
  this.specHelper = new AssistantSource.SpecHelper();
  this.assistantJs = this.specHelper.setup;
  this.container = this.assistantJs.container;

  // Initialize states, strategies, configuration, ... the same way index.ts does
  initializeSetups(this.assistantJs, new AssistantSource.StateMachineSetup(this.assistantJs), new AssistantAuthentication.AuthenticationSetup(this.assistantJs));

  // Initialize platform specific spec helpers; remember that all of them fulfill the AssistantSource.unifierInterfaces.PlatformSpecHelper interface!
  this.alexaSpecHelper = new alexa.AlexaSpecHelper(this.specHelper);
  this.googleSpecHelper = new google.GoogleSpecHelper(this.specHelper);
  
  // Execute bindings
  this.specHelper.prepare();

  // Shorten access to i18next helper
  this.translateValuesForGetter = () => this.container.inversifyInstance.get(AssistantSource.injectionNames.current.i18nTranslateValuesFor);

  // Session Factory
  this.currentSessionFactoryGetter = () => this.container.inversifyInstance.get(AssistantSource.injectionNames.current.sessionFactory);
});