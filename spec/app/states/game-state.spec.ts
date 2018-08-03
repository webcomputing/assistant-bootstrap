import { injectionNames, Session, GenericIntent, BasicAnswerTypes } from "assistant-source";
import { ThisContext } from "../../this-context";

interface CurrentThisContext extends ThisContext {
  /** Invokes the guessNumberIntent and returns specific response results */
  prepareGuessing(guessedNumber?: number | undefined): Promise<Partial<BasicAnswerTypes>>;
  /** Simulate an intent call and returns the response results */
  callIntent(intent: GenericIntent | string): Promise<Partial<BasicAnswerTypes>>;
}

describe("GameState", function() {
  const myNumber = 2;
  let currentSessionFactory: () => Session;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.prepareGuessing = async (guessedNumber = undefined) => {
        // Derive additional extractions
        let additionalExtractions = typeof guessedNumber === "undefined" ? {} : { entities: { guessedNumber: guessedNumber } };

        // Prepare request
        await this.platforms.alexa.pretendIntentCalled("guessNumberIntent", false, additionalExtractions),

        // Store number in session factory
        currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        await currentSessionFactory().set("myNumber", myNumber.toString()),

        // Run state machine and return responseHandler
        await this.platforms.alexa.specSetup.runMachine("GameState")

        // Return the result set
        return this.platforms.alexa.specSetup.getResponseResults();
      }

      this.callIntent = async (intent) => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("GameState");
        return this.platforms.alexa.specSetup.getResponseResults();
      }
    });

    describe("unhandledGenericIntent", function() {
      describe("with no number passed", function() {
        it("tries to help", async function(this: CurrentThisContext) {
          const responseResult = await this.callIntent("notExistingIntent");
          expect(responseResult.shouldSessionEnd).toBeFalsy();
          expect(await this.translateValuesFor()("gameState.unhandledGenericIntent")).toContain(responseResult.voiceMessage!.text);
        });
      })
      
      describe("with a number passed", function() {
        it("just acts as guessNumberIntent (here: success)", async function(this: CurrentThisContext) {
          const responseResult = await this.prepareGuessing(myNumber);
          expect(responseResult.shouldSessionEnd).toBeTruthy();
          expect(await this.translateValuesFor()("gameState.guessNumberIntent.success")).toContain(responseResult.voiceMessage!.text);
        });
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        const responseResult = await this.callIntent(GenericIntent.Help);
        expect(responseResult.shouldSessionEnd).toBeFalsy();
        expect(await this.translateValuesFor()("gameState.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        const responseResult = await this.callIntent(GenericIntent.Cancel);
        expect(responseResult.shouldSessionEnd).toBeTruthy();
        expect(await this.translateValuesFor()("root.cancelGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("guessNumberIntent", function() {
      describe("when no number was passed", function() {
        it("returns prompt message", async function(this: CurrentThisContext) {
          const responseResult = await this.prepareGuessing();
          expect(responseResult.shouldSessionEnd).toBeFalsy();
          expect(await this.translateValuesFor()("promptState.guessedNumber")).toContain(responseResult.voiceMessage!.text);
        });
      });

      describe("when guessed number was correct", function() {
        it("tells user that he or she won", async function(this: CurrentThisContext) {
          const responseResult = await this.prepareGuessing(myNumber);
          expect(responseResult.shouldSessionEnd).toBeTruthy();
          expect(await this.translateValuesFor()("gameState.guessNumberIntent.success")).toContain(responseResult.voiceMessage!.text);
        });
      });

      describe("when guessed number was not correct", function() {
        it("tells user that he or she lost", async function(this: CurrentThisContext) {
          const responseResult = await this.prepareGuessing(myNumber + 1);
          expect(responseResult.shouldSessionEnd).toBeTruthy();
          expect(await this.translateValuesFor()("gameState.guessNumberIntent.failure", { myNumber: myNumber })).toContain(responseResult.voiceMessage!.text);
        });
      });
    });
  })
});