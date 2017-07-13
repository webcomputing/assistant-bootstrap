import { stateMachineInterfaces, servicesInterfaces, injectionNames, unifierInterfaces } from "assistant-source";
import { needs } from "assistant-validations";
import { injectable, inject } from "inversify";

import { ApplicationState } from "./application";
import { AbbrevationsMixin } from "./mixins/abbrevations";

/**
 * GameState
 * If the conversation is in this state, the game has been started. This means we already thought of a number (stored in session)
 * and now compare this number with the given one.
 * Also have a look at how a mixin is used here: Thanks to AbbrevationsMixin, we can use this.prompt, this.endSession and this.t directly.
 * Mixins can be especially helpful to deal with intents which are common in many states, the same way ApplicationState does it here.
 */

@injectable()
export class GameState extends AbbrevationsMixin(ApplicationState) {
  currentSessionFactory: () => servicesInterfaces.Session;
  entities: unifierInterfaces.EntityDictionary;

  constructor(
    @inject(injectionNames.current.responseFactory) responseFactory, 
    @inject(injectionNames.current.translateHelper) translateHelper,
    @inject(injectionNames.current.sessionFactory) sessionFactory,
    @inject(injectionNames.current.entityDictionary) entities
    ) {
    super(responseFactory, translateHelper);
    this.currentSessionFactory = sessionFactory;
    this.entities = entities;
  }

  /**
   * As soon as the user answers with a guessed number, this intent is called.
   * The @needs decorator is part of assistant-validations and tells assistantJS to wait until the user really
   * submits the entity "guessedNumber". If the user did not submit this entity, assistantJS will prompt for it.
   * Have a look closer at config/components.ts and translations.json for some links to this.
   */
  @needs("guessedNumber")
  async guessNumberIntent() {
    // Retrieve myNumber from session and given number from entity dictionary
    let guessedNumber = parseInt(this.entities.get("guessedNumber"));
    let sessionContainedValue = await this.currentSessionFactory().get("myNumber");
    let myNumber = parseInt(sessionContainedValue);

    
  }
}