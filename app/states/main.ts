import { CurrentSessionFactory, injectionNames, State, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";
import { ApplicationState } from "./application";


/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class MainState extends ApplicationState {
  currentSessionFactory: CurrentSessionFactory;

  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: State.SetupSet,
    @inject("core:unifier:current-session-factory") sessionFactory: CurrentSessionFactory,
  ) {
    super(stateSetupSet);    
    this.currentSessionFactory = sessionFactory;
  }

  /**
   * The invokeGenericIntent method (unifierInterfaces.GenericIntent.invoke) is your "main entrance" into your application. 
   * It is called as soon as the application is launched, e. g. if user says "launch xxxxx".
   */
  invokeGenericIntent() {
    this.responseFactory.createVoiceResponse().prompt(this.translateHelper.t());
  }

  /**
   * Starts a game.
   * Notice that this is a custom intent, not a generic one (see unifierInterfaces.GenericIntent). So this intent method does not 
   * have a "GenericIntent" prefix, but an "Intent" prefix. In difference to generic intents, you have to provide utterances for custom intents.
   * @param machine the state machine, can be used for transitions and redirects. Every intent method gets this parameter.
   */
  async startGameIntent(machine: Transitionable) {
    // Think of a number between 1 and 10 (inclusive)
    let myNumber = Math.floor(Math.random() * 10) + 1;

    // Wait for both promises to finish, but run them in parallel
    await Promise.all([
      // Store this number into session and transition to new state      
      this.currentSessionFactory().set("myNumber", myNumber.toString()),

      // Transition to GameState
      machine.transitionTo("GameState")
    ]);

    // Send response 
    this.responseFactory.createVoiceResponse().prompt(this.translateHelper.t());
  }
}