import { SpecHelper, AssistantJSSetup, TranslateValuesFor, CurrentSessionFactory } from "assistant-source";
import { AlexaSpecHelper } from "assistant-alexa";
import { Container } from "inversify-components";
import { GoogleSpecHelper } from "assistant-google";

export interface ThisContext {
    assistantJs: AssistantJSSetup;
    specHelper: SpecHelper;
    alexaSpecHelper: AlexaSpecHelper;
    googleSpecHelper: GoogleSpecHelper;
    container: Container;
    translateValuesForGetter(): TranslateValuesFor;
    currentSessionFactoryGetter(): CurrentSessionFactory;
  }