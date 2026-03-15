import { cn } from "@/lib/utils";

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  const displayName = userName || "Student";
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date().toLocaleDateString("en-US", dateOptions);

  return (
    <div className="flex flex-col gap-1 mb-8 mt-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Good Morning, {displayName}{" "}
        <span className="text-2xl inline-block wave-animation">👋</span>
      </h1>
      <span
        className={cn(
          "text-sm font-medium text-muted-foreground mt-1",
          "before:content-['Today_is_'] before:mr-1 before:text-muted-foreground/70 before:font-normal",
        )}
      >
        {today}
      </span>
    </div>
  );
}
