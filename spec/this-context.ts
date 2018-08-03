import { SpecHelper, AssistantJSSetup, TranslateValuesFor, CurrentSessionFactory } from "assistant-source";
import { AlexaSpecHelper } from "assistant-alexa";
import { Container } from "inversify-components";
import { GoogleSpecHelper } from "assistant-google";

export interface ThisContext {
    assistantJs: AssistantJSSetup;
    specHelper: SpecHelper;
    platforms: {
      "alexa": AlexaSpecHelper,
      "googleAssistant": GoogleSpecHelper
    }
    container: Container;
    translateValuesFor(): TranslateValuesFor;
  }