import { TranslateHelper, BaseState, Transitionable } from "assistant-source";
import { CurrentAnswerTypes, CurrentHandler } from "../config/handler";

export interface ApplicationState extends BaseState<CurrentAnswerTypes, CurrentHandler> {}

export interface BackIntentMixinInstance extends ApplicationState {
  backIntent(machine: Transitionable): Promise<void>
}