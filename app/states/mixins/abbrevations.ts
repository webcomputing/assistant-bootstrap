import { Constructor, Mixin } from "assistant-source";
import { AbbrevationsMixinInstance, ApplicationState } from "../../interfaces";

export function AbbrevationsMixin<T extends Constructor<ApplicationState>>(superState: T): Mixin<AbbrevationsMixinInstance> & T {
  return class extends superState {
    public prompt(text: string, ...reprompts: string[]) {
      this.responseFactory.createVoiceResponse().prompt(text, ...reprompts);
    }

    public endSessionWith(text: string) {
      this.responseFactory.createVoiceResponse().endSessionWith(text);
    }

    /** Short form for translateHelper access */
    // tslint:disable-next-line:function-name mixin-functions
    public t(...args: any[]) {
      return this.translateHelper.t(...args);
    }
  };
}