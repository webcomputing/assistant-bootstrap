import { CurrentSessionFactory, injectionNames, State, EntityDictionary, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";
import { needs } from "assistant-validations";
import { ApplicationState } from "./application";
import { BackIntentMixin } from "./mixins/backIntent";
import { CurrentAnswerTypes, CurrentHandler } from "../../config/handler";

/**
 * GameState
 * If the conversation is in this state, the game has been started. This means we already thought of a number (stored in session)
 * and now compare this number with the given one.
 * Also have a look at how a mixin is used here: Thanks to BackIntentMixin, we can go back to the main state at any time.
 * Mixins can be especially helpful to deal with intents which are common in many states, the same way ApplicationState does it here.
 */

@injectable()
export class GameState extends BackIntentMixin(ApplicationState) {
  currentSessionFactory: CurrentSessionFactory;

  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: State.SetupSet<CurrentAnswerTypes, CurrentHandler>,
    @inject(injectionNames.current.sessionFactory) sessionFactory: CurrentSessionFactory,
    @inject(injectionNames.current.entityDictionary) public entities: EntityDictionary
  ) {
    super(stateSetupSet);
    this.currentSessionFactory = sessionFactory;
  }
  /**
   * As soon as the user answers with a guessed number, this intent is called.
   * The @needs decorator is part of assistant-validations and tells assistantJS to wait until the user really
   * submits the entity "guessedNumber". If the user did not submit this ecntity, assistantJS will prompt for it.
   * Have a look closer at config/components.ts and translations.json for some links to this.
   */
  @needs("guessedNumber")
  public async guessNumberIntent() {
    // Retrieve myNumber from session and given number from entity dictionary
    let guessedNumber = this.entities.get("guessedNumber");
    let myNumber = await this.currentSessionFactory().get("myNumber") || "";

    // Compare myNumber with the given number from entitiy dictionary and end session with specific answer.
    this.endSessionWith(this.t(myNumber === guessedNumber ? ".success" : ".failure", { myNumber}));
  }

  /**
   * This acts here as generic utterance fallback: As long as the user gave me a number, he probably meant guessNumberIntent(). 
   * Otherwise, just use the old unhandledIntent from ApplicationState.
   */
   async unhandledGenericIntent(machine: Transitionable) {
    if (this.entities.contains("guessedNumber")) {
      return machine.handleIntent("guessNumber");
    } else if (this.entities.contains("number")) {
      this.entities.set("guessedNumber", this.entities.get("number"));
      return machine.handleIntent("guessNumber");
    } else {
      super.unhandledGenericIntent(machine,"guessedNumber");
    }
  }
}