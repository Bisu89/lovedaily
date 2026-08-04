import { Cake, CalendarHeart, HeartCrack, Mail, Puzzle, Sunrise } from "lucide-react"

import type { RelationshipTemplate } from "@/features/generator/types/template"

export const TEMPLATES: RelationshipTemplate[] = [
  {
    id: "love-letter",
    title: "Love Letter",
    description: "A heartfelt letter that puts your feelings into words.",
    icon: Mail,
  },
  {
    id: "good-morning",
    title: "Good Morning Message",
    description: "A warm text to start their day with a smile.",
    icon: Sunrise,
  },
  {
    id: "anniversary",
    title: "Anniversary Wishes",
    description: "Celebrate another year together.",
    icon: CalendarHeart,
  },
  {
    id: "birthday",
    title: "Birthday Wishes",
    description: "A birthday message that feels personal.",
    icon: Cake,
  },
  {
    id: "apology",
    title: "Apology Letter",
    description: "Say sorry the right way.",
    icon: HeartCrack,
  },
  {
    id: "couple-challenge",
    title: "Couple Challenge",
    description: "Fun prompts to grow closer together.",
    icon: Puzzle,
  },
]
