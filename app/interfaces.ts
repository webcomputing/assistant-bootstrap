import { TranslateHelper, BaseState } from "assistant-source";

export interface ApplicationState extends BaseState {
  
}

export interface AbbrevationsMixinInstance extends ApplicationState, TranslateHelper {
  prompt(text: string): void;
  endSessionWith(text: string): void;
}