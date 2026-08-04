import type { LucideIcon } from "lucide-react"

export type RelationshipTemplateId =
  | "love-letter"
  | "good-morning"
  | "anniversary"
  | "birthday"
  | "apology"
  | "couple-challenge"

export interface RelationshipTemplate {
  id: RelationshipTemplateId
  title: string
  description: string
  icon: LucideIcon
}
