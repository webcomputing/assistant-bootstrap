import { unifierInterfaces, injectionNames, servicesInterfaces } from "assistant-source";

describe("GameState", function() {
  const myNumber = 2;
  let responseHandler: unifierInterfaces.MinimalResponseHandler;
  let currentSessionFactory: () => servicesInterfaces.Session;

  describe("on platform = alexa", function() {
    beforeEach(function() {
      this.callIntent = async (intent) => {
        responseHandler = await (this.platforms.alexa as unifierInterfaces.PlatformSpecHelper).pretendIntentCalled(intent, false);
        await this.specHelper.runMachine("GameState");
        return responseHandler;
      };

      this.prepareGuessing = async (guessedNumber = undefined) => {
        // Derive additional extractions
        let additionalExtractions = typeof guessedNumber === "undefined" ? {} : { entities: { guessedNumber: guessedNumber } };

        // Prepare request
        responseHandler = await (this.platforms.alexa as unifierInterfaces.PlatformSpecHelper).pretendIntentCalled("guessNumber", false, additionalExtractions);

        // Store myNumber into session
        currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        await currentSessionFactory().set("myNumber", myNumber.toString());

        // Run state machine and return responseHandler
        await this.specHelper.runMachine("GameState");
        return responseHandler;
      }
    });

    describe("unhandledGenericIntent", function() {
      describe("with no number passed", function() {
        it("tries to help", async function(done) {
          let responseHandler = await this.callIntent("notExistingIntent");
          expect(responseHandler.endSession).toBeFalsy();
          expect(this.translateValuesFor("gameState.unhandledGenericIntent")).toContain(responseHandler.voiceMessage);
          done();
        });
      })
      
      describe("with a number passed", function() {
        it("just acts as guessNumberIntent (here: success)", async function(done) {
          let responseHandler = await this.prepareGuessing(myNumber);
          expect(responseHandler.endSession).toBeTruthy();
          expect(this.translateValuesFor("gameState.guessNumberIntent.success")).toContain(responseHandler.voiceMessage);
          done();
        });
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

    describe("guessNumberIntent", function() {
      describe("when no number was passed", function() {
        it("returns prompt message", async function(done) {
          let responseHandler = await this.prepareGuessing();
          expect(responseHandler.endSession).toBeFalsy();
          expect(this.translateValuesFor("promptState.guessedNumber")).toContain(responseHandler.voiceMessage);
          done();
        });
      });

      describe("when guessed number was correct", function() {
        it("tells user that he or she won", async function(done) {
          let responseHandler = await this.prepareGuessing(myNumber);
          expect(responseHandler.endSession).toBeTruthy();
          expect(this.translateValuesFor("gameState.guessNumberIntent.success")).toContain(responseHandler.voiceMessage);
          done();
        });
      });

      describe("when guessed number was not correct", function() {
        it("tells user that he or she lost", async function(done) {
          let responseHandler = await this.prepareGuessing(myNumber + 1);
          expect(responseHandler.endSession).toBeTruthy();
          expect(this.translateValuesFor("gameState.guessNumberIntent.failure", { myNumber: myNumber })).toContain(responseHandler.voiceMessage);
          done();
        });
      });
    });
  })
});