import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  isLoading: boolean
}

export function GenerateButton({ isLoading }: GenerateButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isLoading}
      className="h-12 w-full text-base sm:w-auto sm:px-10"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Writing your letter...
        </>
      ) : (
        <>
          <span aria-hidden="true">✨</span>
          Create My Letter
        </>
      )}
    </Button>
  )
}
