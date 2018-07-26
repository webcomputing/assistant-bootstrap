import { CurrentSessionFactory, EntityDictionary, injectionNames, PlatformGenerator, State } from "assistant-source";
import { PromptStateMixin, PromptStateMixinRequirements } from "assistant-validations";
import { inject, injectable, unmanaged } from "inversify";
import { ApplicationState } from "./application";
import { CurrentAnswerTypes, CurrentHandler } from "../../config/handler";

/**
 * This small class is needed to apply the PromptStateMixin since TypeScript does not allow type-specific constructor mixins.
 * Just add it to your regular class hierarchy.
 */
@injectable()
class PromptStateRequirements extends ApplicationState implements PromptStateMixinRequirements {
  constructor(
    @unmanaged() stateSetupSet: State.SetupSet<CurrentAnswerTypes, CurrentHandler>,
    @unmanaged() public entities: EntityDictionary,
    @unmanaged() public sessionFactory: CurrentSessionFactory,
    @unmanaged() public mappings: PlatformGenerator.EntityMapping
  ) {
    super(stateSetupSet);
  }
}

@injectable()
export class PromptState extends PromptStateMixin(PromptStateRequirements) {
  constructor(
    @inject(injectionNames.current.stateSetupSet) setupSet: State.SetupSet<CurrentAnswerTypes, CurrentHandler>,
    @inject(injectionNames.current.entityDictionary) entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) sessionFactory: CurrentSessionFactory,
    @inject("core:unifier:user-entity-mappings") mappings: PlatformGenerator.EntityMapping
  ) {
    super(setupSet, entities, sessionFactory, mappings);
  }
}