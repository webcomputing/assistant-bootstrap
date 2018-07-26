import { Constructor, Mixin, Transitionable } from "assistant-source";
import { BackIntentMixinInstance, ApplicationState } from "../../interfaces";

export function BackIntentMixin<T extends Constructor<ApplicationState>>(superState: T): Mixin<BackIntentMixinInstance> & T {
  return class extends superState {
    async backIntent(machine: Transitionable) {
      await machine.transitionTo("MainState");
      this.responseHandler.prompt(this.translateHelper.t());
    }
  }
}