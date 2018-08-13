import { GenericIntent, Session, BasicAnswerTypes, injectionNames } from "assistant-source";
import { ThisContext } from "../../this-context";

interface CurrentThisContext extends ThisContext {
  /** Simulate an intent call and returns the response results */
  callIntent(intent: GenericIntent | string): Promise<Partial<BasicAnswerTypes>>
}

describe("MainState", function() {
  let currentSessionFactory: () => Session;
  let currentStateNameProvider: () => Promise<string>;
  let responseResult: Partial<BasicAnswerTypes>;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.callIntent = async (intent) => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("MainState");
        return this.platforms.alexa.specSetup.getResponseResults();
      }
    });

    describe("invokeGenericIntent", function() {
      it("greets and prompts for command", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Invoke);
        expect(await this.translateValuesFor()("mainState.invokeGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("unhandledGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent("notExistingIntent");
        expect(await this.translateValuesFor()("mainState.unhandledGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        responseResult= await this.callIntent(GenericIntent.Help);
        expect(await this.translateValuesFor()("mainState.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Cancel);
        expect(await this.translateValuesFor()("root.cancelGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("startGameIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
       responseResult = await this.callIntent("startGame");
      });

      it("tells user that a new game was started", async function(this: CurrentThisContext) {
        expect(responseResult.shouldSessionEnd).toBeFalsy();
        expect(await this.translateValuesFor()("mainState.startGameIntent")).toContain(responseResult.voiceMessage!.text);
      });

      // Yes.. We do not really need to store this in a session, we could just generate it in the next request. But well, this way you see how it works. ;-)
      it("stores guessed number into session", async function(this: CurrentThisContext) {
        currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory)
        let myNumber = await currentSessionFactory().get("myNumber");
        expect(parseInt(myNumber!)).toBeGreaterThan(0);
        expect(parseInt(myNumber!)).toBeLessThanOrEqual(10);
      });

      it("sets the current conversation state to 'GameState'", async function(this: CurrentThisContext) {
        currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
        let currentStateName = await currentStateNameProvider();
        expect(currentStateName).toEqual("GameState");
      });
    });
  })
});