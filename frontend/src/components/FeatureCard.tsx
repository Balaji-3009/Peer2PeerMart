import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 md:p-8 animate-in-viewport hover-scale",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
