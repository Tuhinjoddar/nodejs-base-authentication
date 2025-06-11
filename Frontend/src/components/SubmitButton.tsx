interface SubmitButtonProps {
  loading: boolean;
  text: string;
  className?: string; // Optional prop for custom styles
}

export function SubmitButton({ loading, text, className }: SubmitButtonProps) {
  return (
    <button type="submit" className={className} disabled={loading}>
      {loading ? "Processing..." : text}
    </button>
  );
}
