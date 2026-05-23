export default function SideBannerAd({ position }) {
  const slotId =
    position === "left"
      ? process.env.NEXT_PUBLIC_AD_SLOT_LEFT
      : process.env.NEXT_PUBLIC_AD_SLOT_RIGHT;

  return (
    <aside
      className={`article-side-ad article-side-ad--${position}`}
      aria-label="Advertisement"
    >
      <div
        className="article-side-ad__slot"
        data-ad-slot={slotId || undefined}
        data-ad-position={position}
      >
        <span className="article-side-ad__label">Advertisement</span>
      </div>
    </aside>
  );
}
