import { BaseState, State, Transitionable } from "assistant-source";
import { injectable, unmanaged } from "inversify";
import { CurrentAnswerTypes, CurrentHandler } from "../../config/handler";

@injectable()
export class ApplicationState extends BaseState<CurrentAnswerTypes, CurrentHandler> {
  constructor(@unmanaged() setupSet: State.SetupSet<CurrentAnswerTypes, CurrentHandler>) {
    super(setupSet);
  }

  /** 
   * Called if no other intent was matched. 
   * This is the only requirement for a class to be a valid state.
   * See also: stateMachineInterfaces.State, which extends ApplicationState
   */
  unhandledIntent(machine: Transitionable) {
    // Although we are in a different state, all i18n conventions ("{state}.{intent}.{platform}.{key}") still apply
    this.responseHandler.prompt(this.translateHelper.t());
  }

  /** 
   * Called if user says "Help me!" or "What can I do now?"
   */
  helpGenericIntent() {
    this.responseHandler.prompt(this.translateHelper.t());
  }

  /**
   * User wants to abort, meaning - as a default - end the application.
   */
  cancelGenericIntent() {
    // We are using ".endSessionWith" instead of ".prompt" here to really end this conversation now
    this.responseHandler.endSessionWith(this.translateHelper.t());
  }
}