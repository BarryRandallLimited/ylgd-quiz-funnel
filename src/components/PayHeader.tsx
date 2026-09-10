/**
 * The same dark header bar / wordmark used at the top of every quiz screen
 * (see QuizLayout.tsx), reused here so the pay. pages read as the same
 * product rather than a bolted-on checkout flow. No back button or step
 * counter, since those only make sense in the sequential quiz, not a standalone
 * purchase page, but `trailing` can carry a small reassurance label instead.
 */
const INK = "#2A2A22";

interface PayHeaderProps {
  trailing?: string;
}

export default function PayHeader({ trailing }: PayHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <div className="w-16" />
      <img src="/images/brand/ylgd-mark-primary.svg" alt="Your Local Garden Designer" className="h-9 w-auto" />
      {trailing ? (
        <span
          className="w-16 text-right text-[11px] font-semibold uppercase"
          style={{ color: "rgba(244,239,228,0.6)", fontFamily: "'Century Gothic','Futura','URW Geometric','Jost',sans-serif", letterSpacing: "0.06em" }}
        >
          {trailing}
        </span>
      ) : (
        <div className="w-16" />
      )}
    </div>
  );
}
