import { Constructor, Mixin, Transitionable } from "assistant-source";
import { BackIntentMixinInstance } from "../../interfaces";
import { ApplicationState } from "../application";

export function BackIntentMixin<T extends Constructor<ApplicationState>>(superState: T): Mixin<BackIntentMixinInstance> & T {
  return class extends superState {
    async backIntent(machine: Transitionable) {
      await machine.transitionTo("MainState");
      this.prompt(this.t());
    }
  }
}