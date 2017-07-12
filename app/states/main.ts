import { stateMachineInterfaces, unifierInterfaces, i18nInterfaces,  injectionNames } from "assistant-source";
import { injectable, inject } from "inversify";

@injectable()
export class MainState implements stateMachineInterfaces.State {
  responseFactory: unifierInterfaces.ResponseFactory;
  translateHelper: i18nInterfaces.TranslateHelper;

  constructor(@inject(injectionNames.current.responseFactory) responseFactory, @inject(injectionNames.current.translateHelper) translateHelper) {
    this.responseFactory = responseFactory;
    this.translateHelper = translateHelper;
  }

  invokeGenericIntent() {
    this.responseFactory.createSimpleVoiceResponse().prompt(this.translateHelper.t());
  }

  unhandledIntent() {
    
  }
}