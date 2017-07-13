import { stateMachineInterfaces, servicesInterfaces, injectionNames } from "assistant-source";
import { injectable, inject } from "inversify";

import { ApplicationState } from "./application";

/**
 * GameState
 * If the conversation is in this state, the game has been started. This means we already thought of a number (stored in session)
 * and now compare this number with the given one.
 */

@injectable()
export class GameState extends ApplicationState {
  currentSessionFactory: () => servicesInterfaces.Session;

  constructor(
    @inject(injectionNames.current.responseFactory) responseFactory, 
    @inject(injectionNames.current.translateHelper) translateHelper,
    @inject(injectionNames.current.sessionFactory) sessionFactory
    ) {
    super(responseFactory, translateHelper);
    this.currentSessionFactory = sessionFactory;
  }

  
}