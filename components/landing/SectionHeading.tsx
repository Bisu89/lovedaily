import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  headingId?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  headingId,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={headingId}
        className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-lg text-muted-foreground text-balance">
          {description}
        </p>
      ) : null}
    </div>
  )
}
