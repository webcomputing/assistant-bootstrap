import { Transitionable } from "assistant-source";
import { ApplicationState } from "./states/application";

export interface BackIntentMixinInstance extends ApplicationState {
  backIntent(machine: Transitionable): Promise<void>
}