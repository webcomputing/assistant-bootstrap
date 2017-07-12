require("reflect-metadata");
let initializeSetups = require("../../index").initializeSetups;
let AssistantSource = require("assistant-source");
let AssistantAuthentication = require("assistant-authentication");
let Alexa = require("assistant-alexa");
let GoogleAssistant = require("assistant-google");


beforeEach(function() {
  // Initialize AssistantJS spec helper and register some useful abbrevations
  this.specHelper = new AssistantSource.SpecSetup();
  this.assistantJs = this.specHelper.setup;
  this.container = this.assistantJs.container;

  // Initialize states, strategies, configuration, ... the same way index.ts does
  initializeSetups(this.assistantJs, new AssistantSource.StateMachineSetup(this.assistantJs), new AssistantAuthentication.AuthenticationSetup(this.assistantJs));

  // Initialize platform specific spec helpers; remember that all of them fulfill the AssistantSource.unifierInterfaces.PlatformSpecHelper interface!
  this.platforms = {
    "alexa": new Alexa.SpecHelper(this.specHelper),
    "googleAssistant": new GoogleAssistant.SpecHelper(this.specHelper)
  }

  // Execute bindings
  this.specHelper.prepare();

  // Shorten access to i18next helper
  this.translateValuesFor = this.container.inversifyInstance.get(AssistantSource.injectionNames.i18nTranslateValuesFor);
});