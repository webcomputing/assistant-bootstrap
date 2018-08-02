import { GenericIntent, Session } from "assistant-source";
import { ThisContext } from "../../this-context";
import { callIntentHelper } from "../../support/call-intent-helper";

describe("MainState", function() {
  let currentSessionFactory: () => Session;
  let currentStateNameProvider: () => Promise<string>;

  describe("on platform = alexa", function() {
    describe("invokeGenericIntent", function() {
      it("greets and prompts for command", async function(this: ThisContext) {
        const responseResult = await callIntentHelper(GenericIntent.Invoke, this.alexaSpecHelper);
        expect(await this.translateValuesForGetter()("mainState.invokeGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("unhandledGenericIntent", function() {
      it("tries to help", async function() {
        const responseResult = await callIntentHelper("notExistingIntent", this.alexaSpecHelper);
        expect(await this.translateValuesForGetter()("mainState.unhandledGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function() {
        const responseResult= await callIntentHelper(GenericIntent.Help, this.alexaSpecHelper);
        expect(await this.translateValuesForGetter()("mainState.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function() {
        const responseResult = await callIntentHelper(GenericIntent.Cancel, this.alexaSpecHelper);
        expect(await this.translateValuesForGetter()("root.cancelGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });
  })
});