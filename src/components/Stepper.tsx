const STEPS = [
  "Requisition",
  "Purchase Order",
  "Goods Receipt",
  "Quality Check",
  "Invoice & Payment",
];

interface Props {
  currentStep: number;
}

export function Stepper({ currentStep }: Props) {
  return (
    <div className="stepper card">
      {STEPS.map((step, index) => {
        const state =
          index < currentStep ? "done" : index === currentStep ? "current" : "pending";
        return (
          <div key={step} className="step-wrap">
            <div className={`step step-${state}`}>
              <span className="step-dot">{state === "done" ? "✓" : index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`step-line ${index < currentStep ? "step-line-done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
