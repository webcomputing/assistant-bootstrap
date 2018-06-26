import { TranslateHelper, BaseState, Transitionable } from "assistant-source";

export interface ApplicationState extends BaseState {
  
}
export interface BackIntentMixinInstance extends ApplicationState {
  backIntent(machine: Transitionable): Promise<void>
}