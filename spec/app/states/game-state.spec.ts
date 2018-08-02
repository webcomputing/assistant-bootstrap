import { injectionNames, Session, GenericIntent } from "assistant-source";
import { ThisContext } from "../../this-context";
import { callIntentHelper } from "../../support/call-intent-helper";


interface CurrentThisContext extends ThisContext {
  prepareGuessing(number?);
}

describe("GameState", function() {
  const myNumber = "2";
  let currentSessionFactory: () => Session;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.prepareGuessing = async (guessedNumber = undefined) => {
        // Derive additional extractions
        let additionalExtractions = typeof guessedNumber === "undefined" ? {} : { entities: { guessedNumber: guessedNumber } };

        // Prepare request
        await this.alexaSpecHelper.pretendIntentCalled("guessNumberIntent", false, additionalExtractions);

        // Store number in session factory
        await this.currentSessionFactoryGetter()().set("myNumber", myNumber.toString());

        // Run state machine and return responseHandler
        await this.alexaSpecHelper.specSetup.runMachine("GameState");
        return this.alexaSpecHelper.specSetup.getResponseResults();
      }
    });

    describe("unhandledGenericIntent", function() {
      describe("with no number passed", function() {
        it("tries to help", async function(this: CurrentThisContext) {
          const responseResult = await callIntentHelper("notExistingIntent", this.alexaSpecHelper, "GameState");
          expect(await this.translateValuesForGetter()("gameState.unhandledGenericIntent")).toContain(responseResult.voiceMessage!.text);
        });
      })
      
      describe("with a number passed", function() {
        it("just acts as guessNumberIntent (here: success)", async function(this: CurrentThisContext) {
          let responseResult = await this.prepareGuessing(myNumber);
          expect(await this.translateValuesForGetter()("gameState.guessNumberIntent.success")).toContain(responseResult.voiceMessage!.text);
        });
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        let responseHandler = await callIntentHelper(GenericIntent.Help, this.alexaSpecHelper, "GameState");
        expect(await this.translateValuesForGetter()("gameState.helpGenericIntent")).toContain(responseHandler.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        let responseHandler = await callIntentHelper(GenericIntent.Cancel, this.alexaSpecHelper, "GameState");
        expect(await this.translateValuesForGetter()("root.cancelGenericIntent")).toContain(responseHandler.voiceMessage!.text);
      });
    });

    describe("guessNumberIntent", function() {
      describe("when no number was passed", function() {
        it("returns prompt message", async function(this: CurrentThisContext) {
          let responseHandler = await this.prepareGuessing();
          expect(await this.translateValuesForGetter()("promptState.guessedNumber")).toContain(responseHandler.voiceMessage!.text);
        });
      });

      describe("when guessed number was correct", function() {
        it("tells user that he or she won", async function(this: CurrentThisContext) {
          let responseHandler = await this.prepareGuessing(myNumber);
          expect(await this.translateValuesForGetter()("gameState.guessNumberIntent.success")).toContain(responseHandler.voiceMessage!.text);
        });
      });

      describe("when guessed number was not correct", function() {
        it("tells user that he or she lost", async function(this: CurrentThisContext) {
          let responseHandler = await this.prepareGuessing(myNumber + 1);
          expect(await this.translateValuesForGetter()("gameState.guessNumberIntent.failure", { myNumber: myNumber })).toContain(responseHandler.voiceMessage!.text);
        });
      });
    });
  })
});