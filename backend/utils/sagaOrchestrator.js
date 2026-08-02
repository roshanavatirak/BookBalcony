/**
 * SagaOrchestrator - Distributed Transaction Manager for Hybrid Databases
 * Handles multi-step workflow execution with automatic compensating rollbacks.
 */
class SagaStep {
  constructor(name, execute, compensate) {
    this.name = name;
    this.execute = execute;
    this.compensate = compensate;
  }
}

class SagaOrchestrator {
  constructor(sagaName = "GenericSaga") {
    this.sagaName = sagaName;
    this.steps = [];
  }

  addStep(name, execute, compensate = async () => {}) {
    this.steps.push(new SagaStep(name, execute, compensate));
    return this;
  }

  async execute(initialContext = {}) {
    const context = { ...initialContext };
    const executedSteps = [];

    console.log(`\n🚀 [SAGA STARTED] Starting ${this.sagaName}...`);

    for (const step of this.steps) {
      try {
        console.log(`  ▶️ [SAGA STEP] Executing step: "${step.name}"...`);
        const result = await step.execute(context);
        if (result && typeof result === "object") {
          Object.assign(context, result);
        }
        executedSteps.push(step);
      } catch (error) {
        console.error(`  ❌ [SAGA STEP FAILED] Error in step "${step.name}":`, error.message);
        console.log(`  🔄 [SAGA ROLLBACK] Initiating compensating rollbacks for ${executedSteps.length} steps...`);

        // Execute compensating actions in REVERSE order
        for (let i = executedSteps.length - 1; i >= 0; i--) {
          const compStep = executedSteps[i];
          try {
            console.log(`    ⏮️ [COMPENSATING] Rolling back: "${compStep.name}"...`);
            await compStep.compensate(context);
            console.log(`    ✅ [COMPENSATED] Rollback complete for: "${compStep.name}"`);
          } catch (rollbackErr) {
            console.error(`    ⚠️ [COMPENSATE FAILED] Failed to rollback "${compStep.name}":`, rollbackErr.message);
          }
        }

        throw new Error(`Saga "${this.sagaName}" failed at step "${step.name}": ${error.message}`);
      }
    }

    console.log(`✅ [SAGA COMPLETED] ${this.sagaName} finished successfully!\n`);
    return context;
  }
}

module.exports = SagaOrchestrator;
