import { cn } from "@/lib/utils"
import type { RelationshipTemplate, RelationshipTemplateId } from "@/features/generator/types/template"

interface TemplateSelectorProps {
  templates: RelationshipTemplate[]
  selectedId: RelationshipTemplateId
  onSelect: (id: RelationshipTemplateId) => void
}

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose a template"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {templates.map((template) => {
        const Icon = template.icon
        const isSelected = template.id === selectedId

        return (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(template.id)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isSelected
                ? "border-primary bg-accent ring-1 ring-primary"
                : "border-border hover:bg-muted/50"
            )}
          >
            <Icon
              className={cn(
                "size-5",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold">{template.title}</span>
            <span className="text-xs text-muted-foreground">
              {template.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
