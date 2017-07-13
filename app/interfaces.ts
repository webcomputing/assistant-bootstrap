import { stateMachineInterfaces, unifierInterfaces, i18nInterfaces, servicesInterfaces } from "assistant-source";

export interface ApplicationState extends stateMachineInterfaces.State {
  responseFactory: unifierInterfaces.ResponseFactory;
  translateHelper: i18nInterfaces.TranslateHelper;
}

export interface AbbrevationsMixinInstance extends ApplicationState, i18nInterfaces.TranslateHelper {
  prompt(text: string): void;
  endSessionWith(text: string): void;
}