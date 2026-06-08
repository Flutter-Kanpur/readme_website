export default function SidebarAd() {
  const slotId =
    process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ||
    process.env.NEXT_PUBLIC_AD_SLOT_RIGHT;

  return (
    <aside className="article-sidebar-ad" aria-label="Advertisement">
      <div
        className="article-sidebar-ad__slot"
        data-ad-slot={slotId || undefined}
        data-ad-position="sidebar"
      >
        <span className="article-sidebar-ad__label">Advertisement</span>
      </div>
    </aside>
  );
}
