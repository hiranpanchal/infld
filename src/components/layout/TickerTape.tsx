const TICKER_TEXT =
  "UNINFLUENCED \u00B7 THINK FOR YOURSELF \u00B7 REBEL EDITION \u00B7 NOT YOUR BRAND \u00B7 WEAR YOUR OWN MIND \u00B7 DIY OR DIE \u00B7 ";

export function TickerTape() {
  return (
    <div className="ticker-tape py-1.5" aria-hidden="true">
      <div className="ticker-tape-inner">
        {TICKER_TEXT.repeat(6)}
      </div>
    </div>
  );
}
