import { AssistantJSSetup, StateMachineSetup } from "assistant-source";
import { descriptor as apiAiDescriptor } from "assistant-apiai";
import { descriptor as googleDescriptor } from "assistant-google";
import { descriptor as authenticationDescriptor, AuthenticationSetup } from "assistant-authentication";
import { descriptor as validationsDescriptor } from "assistant-validations";
import { descriptor as genericUtterancesDescriptor } from "assistant-generic-utterances";
import { descriptor as alexaDescriptor } from "assistant-alexa";
import components from "./config/components";

/** 
 * Initialize assistant.js
 * The only requirement for assistantJs to work is to export an "assistantJs" object with the AssistantJSSetup configured.
 * Here, we are exporting all three used setups. Those setups are already initialized using the initializeSetups() function, see below.
 */
export const assistantJs = new AssistantJSSetup();
export const stateMachineSetup = new StateMachineSetup(assistantJs);
export const authenticationSetup = new AuthenticationSetup(assistantJs);

/**
 * Initializes all needed setup types. This makes the initialization process, which is needed for a running production environment, reusable for specs.
 * @param assistantJs AssistantJS Setup object to initialize 
 * @param stateMachineSetup StateMachineSetup object to initialize 
 * @param authenticationSetup AuthenticationSetup object to initialize
 * @param addOnly If set to true, states and authentication strategies will only be added, but not registered in dependency injection container
 */
export function initializeSetups (assistantJs: AssistantJSSetup, stateMachineSetup: StateMachineSetup, authenticationSetup: AuthenticationSetup, addOnly = false) {
  // Register all components
  assistantJs.registerComponent(alexaDescriptor);
  assistantJs.registerComponent(authenticationDescriptor);
  assistantJs.registerComponent(validationsDescriptor);
  assistantJs.registerComponent(apiAiDescriptor);
  assistantJs.registerComponent(googleDescriptor);
  assistantJs.registerComponent(genericUtterancesDescriptor);

  // Configure components
  assistantJs.addConfiguration(components as any);

  // Register all states and strategies
  stateMachineSetup.registerByConvention(addOnly);
  authenticationSetup.registerByConvention(addOnly);
}

// Initialize the exported production setups
initializeSetups(assistantJs, stateMachineSetup, authenticationSetup);