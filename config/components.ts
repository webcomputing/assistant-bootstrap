import * as fakeRedis from "fakeredis";
import {
  AssistantJSConfiguration,
  I18nConfiguration,
  ServicesConfiguration,
  UnifierConfiguration
} from "assistant-source";
import { ApiaiConfigurationAttribute, ApiaiConfiguration } from 'assistant-apiai';
import { ValidationsConfigurationAttribute, ValidationsConfiguration } from "assistant-validations";

/*
 * In AssistantJS, every component may have it's own configuration settings. For example,
 * the interface "I18nConfiguration" describes the configuration of AssistantJS's internal
 * i18n component.
 * But to make it easier for you, you don't need to split up these configuations on your own: 
 * The interface "AssistantJSConfiguration" already describes all configuration options of all core AssistantJS components.
 */

/** Configuration of AssistantJS's i18n component (interface = I18nConfiguration) */
const i18nConfiguration: I18nConfiguration = {
  // This is basically the i18next configuration. Check out https://www.i18next.com/ for more information!
  i18nextAdditionalConfiguration: {
    // This entry is needed and tells i18next where to find your language files.
    backend: {
      loadPath: process.cwd() + "/config/locales/{{lng}}/{{ns}}.json",
    },
    lngs: ["en"],
    fallbackLng: "en",
    // If you encouter problems with i18next, change this to true
    debug: false
  }
}

/** Configuration of AssistantJS's services component (interface = ServicesConfiguration) */
const servicesConfiguration: ServicesConfiguration = {
  sessionStorage: {
    factoryName: "redis",
    configuration: {
        maxLifeTime: 1800,
        redisClient: fakeRedis.createClient(6379)
    }
  }
}

const unifierConfiguration: UnifierConfiguration = {
  /* 
  * Register all used entities here and group them by entity type. 
  * Here, we register the entitiy instance name "guessedNumber", which we use in code and utterances, 
  * and tell assistantJS that this entity is of type "number".
  */
  entities: {
    "number": ["guessedNumber"]
  }
}
// Same applies to api.ai
const apiaiConfiguration: ApiaiConfiguration = {
  route: "/apiai",
  // Go to the "fulfillment" tab in your dialogflow console and add some secret header keys and (complex) values
  authenticationHeaders: {
    "MY-FIRST-SECRET-HEADER": "MY-VERY-SECRET-VALUE",
    "MY-SECOND-SECRET-HEADER": "MY-SECOND-VERY-SECRET-VALUE",
  },
  entities: {
    "number": "@sys.number"
  }
}

const validationsConfiguration: ValidationsConfiguration = {
    defaultPromptState: "PromptState"
}

/*
 * Each configuration must be mapped to it's corresponding component name.
 * The registration is done in index.ts.
 */
const configuration: AssistantJSConfiguration & ApiaiConfigurationAttribute & ValidationsConfigurationAttribute = {
  "core:i18n": i18nConfiguration,
  "core:services": servicesConfiguration,
  "core:unifier": unifierConfiguration,
  "apiai": apiaiConfiguration,
  "validations": validationsConfiguration
}

// The linking between your configuration and your application is done in your index.ts
export default configuration;
