import { RedisClient } from "redis";
import { i18nInterfaces, unifierInterfaces, servicesInterfaces } from "assistant-source";
import { Configuration as AlexaConfguration } from "assistant-alexa";

let unifierConfiguration: unifierInterfaces.Configuration = {
  /* 
   * Register all used entities here and group them by entity type. 
   * Here, we register the entitiy instance name "guessedNumber", which we use in code and utterances, 
   * and tell assistantJS that this entity is of type "number".
   */
  entities: {
    "number": ["guessedNumber"]
  }
}

let alexaConfiguration: AlexaConfguration = {
  // You find your application id in the amazon developers console. Paste it here!
  applicationID: "YOUR-APPLICATION-ID",

  // Make sure that you configure this route in your amazon developers console (https url), too!
  route: "/alexa", 

  /*
   * Map every used entity type (see above) to a concrete amazon slot type. 
   * You can also use a custom slot type here, if there is no applyable built-in type. That way, you can easily reach a 
   * broad entity compatibility between multiple platforms!
   */
  parameters: {
    "number": "AMAZON.Number"
  }
};

let i18nConfiguration: i18nInterfaces.Configuration = {
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

let servicesConfiguration: servicesInterfaces.Configuration = {
  // In case you need to change your redis connection data, this is the place to go
  redisClient: new RedisClient({})
}

/*
 * Each configuration must be mapped to it's corresponding component name.
 * The registration is done in index.ts.
 */
export default {
  "alexa": alexaConfiguration,
  "core:i18n": i18nConfiguration,
  "core:unifier": unifierConfiguration,
  "core:services": servicesInterfaces
}