import { unifierInterfaces } from "assistant-source";

describe("MainState", function() {
  describe("on platform = alexa", function() {
    beforeEach(function() {
      this.callIntent = (intent) => {
        return (this.platforms.alexa as unifierInterfaces.PlatformSpecHelper).pretendIntentCalled(intent);
      };
    });

    describe("invokeGenericIntent", function() {
      it("greets and prompts for command", async function(done) {
        let responseHandler = await this.callIntent(unifierInterfaces.GenericIntent.Invoke) as unifierInterfaces.MinimalResponseHandler;
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.invokeGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("unhandledIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent("notExistingIntent") as unifierInterfaces.MinimalResponseHandler;
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.unhandledIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(done) {
        let responseHandler = await this.callIntent(unifierInterfaces.GenericIntent.Help) as unifierInterfaces.MinimalResponseHandler;
        expect(responseHandler.endSession).toBeFalsy();
        expect(this.translateValuesFor("mainState.helpGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(done) {
        let responseHandler = await this.callIntent(unifierInterfaces.GenericIntent.Cancel) as unifierInterfaces.MinimalResponseHandler;
        expect(responseHandler.endSession).toBeTruthy();
        expect(this.translateValuesFor("root.cancelGenericIntent")).toContain(responseHandler.voiceMessage);
        done();
      });
    });
  })
});