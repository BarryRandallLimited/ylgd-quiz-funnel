import { Leaf } from "lucide-react";

/**
 * The same dark header bar / leaf mark used at the top of every quiz screen
 * (see QuizLayout.tsx), reused here so the pay. pages read as the same
 * product rather than a bolted-on checkout flow. No back button or step
 * counter, since those only make sense in the sequential quiz, not a standalone
 * purchase page, but `trailing` can carry a small reassurance label instead.
 */
interface PayHeaderProps {
  trailing?: string;
}

export default function PayHeader({ trailing }: PayHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#1E3A2F" }}>
      <div className="w-16" />
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#C9A76A" }}
        >
          <Leaf size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-white font-display">
          Your Local Garden Designer
        </span>
      </div>
      {trailing ? (
        <span className="w-16 text-right text-white/60 text-xs font-semibold">{trailing}</span>
      ) : (
        <div className="w-16" />
      )}
    </div>
  );
}
