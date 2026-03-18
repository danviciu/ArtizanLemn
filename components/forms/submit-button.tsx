import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  isSubmitting: boolean;
};

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isSubmitting}
      className="justify-center md:w-fit"
    >
      {isSubmitting ? (
        <>
          <LoaderCircle size={16} className="animate-spin" />
          Trimitem cererea...
        </>
      ) : (
        "Trimite cererea ta"
      )}
    </Button>
  );
}
