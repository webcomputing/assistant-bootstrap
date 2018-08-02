import { GenericIntent, SpecHelper, BasicAnswerTypes } from "assistant-source";
import { GoogleSpecHelper } from "assistant-google";
import { AlexaSpecHelper } from "assistant-alexa";

export async function callIntentHelper (
  intent: GenericIntent | string,
  specHelper: GoogleSpecHelper | AlexaSpecHelper,
  state: "MainState" | "GameState" = "MainState", 
): Promise<Partial<BasicAnswerTypes>> {
    await specHelper.pretendIntentCalled(intent, false);
    await specHelper.specSetup.runMachine(state);
    return specHelper.specSetup.getResponseResults();
  };