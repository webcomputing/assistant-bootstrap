import { Constructor, Mixin, unifierInterfaces, i18nInterfaces } from "assistant-source";
import { ApplicationState, AbbrevationsMixinInstance } from "../../interfaces";

export function AbbrevationsMixin<T extends Constructor<ApplicationState>>(superState: T): Mixin<AbbrevationsMixinInstance> & T {
  return class extends superState {
    responseFactory: unifierInterfaces.ResponseFactory;
    translateHelper: i18nInterfaces.TranslateHelper;
    prompt(text: string) {
      this.responseFactory.createVoiceResponse().prompt(text);
    }

    endSessionWith(text: string) {
      this.responseFactory.createVoiceResponse().endSessionWith(text);
    }

    /** Short form for translateHelper access */
    t(...args: any[]): string {
      return this.translateHelper.t(...args);
    }
  }
}