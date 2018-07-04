import { GenericIntent, injectionNames, MinimalResponseHandler, PlatformSpecHelper, Session } from "assistant-source";

describe("MainState", function() {
  let responseHandler: MinimalResponseHandler;
  let currentSessionFactory: () => Session;
  let currentStateNameProvider: () => Promise<string>;

  describe("on platform = alexa", function() {
    beforeEach(function() {
      this.callIntent = (intent) => {
        return (this.platforms.alexa as PlatformSpecHelper).pretendIntentCalled(intent);
      };
    });

    describe("invokeGenericIntent", function() {
      it("greets and prompts for command", async function(done) {
        let responseHandler = await this.callIntent(GenericIntent.Invoke);
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.invokeGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("unhandledGenericIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent("notExistingIntent");
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.unhandledGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent(GenericIntent.Help);
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.helpGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(done) {
        let responseHandler = await this.callIntent(GenericIntent.Cancel);
        expect(responseHandler.endSession).toBeTruthy();
        expect(this.translateValuesFor("root.cancelGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("startGameIntent", function() {
      beforeEach(async function(done) {
        responseHandler = await this.callIntent("startGame");
        done();
      });

      it("tells user that a new game was started", async function(done) {
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.startGameIntent")).toContain(responseHandler.voiceMessage);
        done();
      });

      // Yes.. We do not really need to store this in a session, we could just generate it in the next request. But well, this way you see how it works. ;-)
      it("stores guessed number into session", async function(done) {
        currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory)
        let myNumber = await currentSessionFactory().get("myNumber");
        expect(parseInt(myNumber || "0")).toBeGreaterThan(0);
        expect(parseInt(myNumber || "0")).toBeLessThanOrEqual(10);
        done();
      });

      it("sets the current conversation state to 'GameState'", async function(done) {
        currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
        let currentStateName = await currentStateNameProvider();
        expect(currentStateName).toEqual("GameState");
        done();
      });
    });
  })
});