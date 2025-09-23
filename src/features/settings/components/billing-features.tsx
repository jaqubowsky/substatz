import { CheckCircle2 } from "lucide-react";

export const BillingFeature = ({ feature }: { feature: string }) => {
  return (
    <div className="flex items-start gap-2.5">
      <CheckCircle2
        aria-hidden="true"
        focusable="false"
        className="h-4 w-4 shrink-0 mt-0.5 text-primary"
      />
      <span className="text-sm">{feature}</span>
    </div>
  );
};

export const BillingFeatures = ({ features }: { features: string[] }) => {
  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <BillingFeature key={feature} feature={feature} />
      ))}
    </div>
  );
};
