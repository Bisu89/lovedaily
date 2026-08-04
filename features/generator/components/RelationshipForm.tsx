import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type {
  GeneratorFormErrors,
  GeneratorFormValues,
} from "@/features/generator/hooks/useGenerator"
import type { Language, Tone } from "@/features/generator/types/generate"

const RELATIONSHIP_OPTIONS = [
  "Husband",
  "Wife",
  "Boyfriend",
  "Girlfriend",
  "Mom",
  "Dad",
]

const TONE_OPTIONS: { value: Tone; label: string; emoji: string }[] = [
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "sweet", label: "Sweet", emoji: "🍯" },
  { value: "emotional", label: "Emotional", emoji: "🥹" },
  { value: "funny", label: "Funny", emoji: "😄" },
  { value: "formal", label: "Formal", emoji: "🎩" },
]

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
]

const DETAILS_MAX_LENGTH = 500

interface RelationshipFormProps {
  values: GeneratorFormValues
  errors: GeneratorFormErrors
  onChange: <K extends keyof GeneratorFormValues>(
    field: K,
    value: GeneratorFormValues[K]
  ) => void
}

export function RelationshipForm({
  values,
  errors,
  onChange,
}: RelationshipFormProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Label className="text-base font-semibold text-foreground">
          Who do you want to surprise today?
        </Label>
        <div
          role="radiogroup"
          aria-label="Who do you want to surprise today?"
          aria-invalid={!!errors.relationship}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {RELATIONSHIP_OPTIONS.map((option) => {
            const isSelected = values.relationship === option
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange("relationship", option)}
                className={cn(
                  "flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <span aria-hidden="true">❤️</span>
                {option}
              </button>
            )
          })}
        </div>
        {errors.relationship ? (
          <p className="text-sm text-destructive">{errors.relationship}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="occasion" className="text-base font-semibold text-foreground">
          Why are you writing this?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="occasion"
          value={values.occasion}
          onChange={(event) => onChange("occasion", event.target.value)}
          placeholder="e.g. their birthday, an anniversary, or just because"
          className="h-12 rounded-xl px-4 text-base"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-base font-semibold text-foreground">
          How do you want them to feel?
        </Label>
        <div
          role="radiogroup"
          aria-label="How do you want them to feel?"
          className="flex flex-wrap gap-2"
        >
          {TONE_OPTIONS.map((option) => {
            const isSelected = values.tone === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange("tone", option.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <span aria-hidden="true">{option.emoji}</span>
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-base font-semibold text-foreground">
          Language
        </Label>
        <div
          role="radiogroup"
          aria-label="Language"
          aria-invalid={!!errors.language}
          className="flex gap-2"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = values.language === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange("language", option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        {errors.language ? (
          <p className="text-sm text-destructive">{errors.language}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="details" className="text-base font-semibold text-foreground">
            Tell us a little about them.{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <span className="shrink-0 text-xs text-muted-foreground">
            {values.details.length}/{DETAILS_MAX_LENGTH}
          </span>
        </div>
        <Textarea
          id="details"
          value={values.details}
          onChange={(event) =>
            onChange("details", event.target.value.slice(0, DETAILS_MAX_LENGTH))
          }
          maxLength={DETAILS_MAX_LENGTH}
          rows={4}
          placeholder="Tell us something special about them..."
          className="min-h-28 rounded-xl px-4 py-3 text-base"
        />
        <p className="text-xs text-muted-foreground italic">
          Example: &ldquo;He always supports our family and works very
          hard.&rdquo;
        </p>
      </div>
    </div>
  )
}
