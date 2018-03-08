import { injectable, inject, unmanaged } from "inversify";
import { State, EntityDictionary, CurrentSessionFactory, PlatformGenerator, injectionNames } from "assistant-source";
import { PromptStateMixinRequirements, PromptStateMixin } from "assistant-validations";
import { ApplicationState } from "./application";

/**
 * This small class is needed to apply the PromptStateMixin since TypeScript does not allow type-specific constructor mixins.
 * Just add it to your regular class hierarchy.
 */
@injectable()
class PromptStateRequirements extends ApplicationState implements PromptStateMixinRequirements {
  constructor(
    @unmanaged() stateSetupSet: State.SetupSet,
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
    @inject(injectionNames.current.stateSetupSet) setupSet: State.SetupSet,
    @inject(injectionNames.current.entityDictionary) entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) sessionFactory: CurrentSessionFactory,
    @inject("core:unifier:user-entity-mappings") mappings: PlatformGenerator.EntityMapping
  ) {
    super(setupSet, entities, sessionFactory, mappings);
  }
}