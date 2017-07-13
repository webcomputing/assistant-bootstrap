import { unifierInterfaces, injectionNames, servicesInterfaces } from "assistant-source";

describe("GameState", function() {
  let responseHandler: unifierInterfaces.MinimalResponseHandler;
  let currentSessionFactory: () => servicesInterfaces.Session;

  describe("on platform = alexa", function() {
    beforeEach(function() {
      this.callIntent = async (intent) => {
        responseHandler = await (this.platforms.alexa as unifierInterfaces.PlatformSpecHelper).pretendIntentCalled(intent, false);
        await this.specHelper.runMachine("GameState");
        return responseHandler;
      };
    });

    describe("unhandledIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent("notExistingIntent");
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("gameState.unhandledIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent(unifierInterfaces.GenericIntent.Help);
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("gameState.helpGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(done) {
        let responseHandler = await this.callIntent(unifierInterfaces.GenericIntent.Cancel);
        expect(responseHandler.endSession).toBeTruthy();
        expect(this.translateValuesFor("root.cancelGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });
  })
});