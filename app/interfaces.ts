import { stateMachineInterfaces, unifierInterfaces, i18nInterfaces, servicesInterfaces } from "assistant-source";

export interface ApplicationState extends stateMachineInterfaces.State {
  responseFactory: unifierInterfaces.ResponseFactory;
  translateHelper: i18nInterfaces.TranslateHelper;
}