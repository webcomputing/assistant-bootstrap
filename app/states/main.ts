import { stateMachineInterfaces, unifierInterfaces, i18nInterfaces,  injectionNames } from "assistant-source";
import { injectable, inject } from "inversify";

import { ApplicationState } from "./application";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class MainState extends ApplicationState {
  constructor(@inject(injectionNames.current.responseFactory) responseFactory, @inject(injectionNames.current.translateHelper) translateHelper) {
    super(responseFactory, translateHelper);
  }

  /**
   * The invokeGenericIntent method (unifierInterfaces.GenericIntent.invoke) is your "main entrance" into your application. 
   * It is called as soon as the application is launched, e. g. if user says "launch xxxxx".
   */
  invokeGenericIntent() {
    this.responseFactory.createVoiceResponse().prompt(this.translateHelper.t());
  }
}