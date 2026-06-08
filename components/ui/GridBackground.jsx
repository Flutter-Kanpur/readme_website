/**
 * Optional standalone gradient band (no navbar).
 * Most pages get the gradient via Navbar's `page-gradient` wrapper instead.
 */
export default function GridBackground({ plain = false }) {
  return (
    <div
      className={`page-gradient${plain ? ' page-gradient--plain' : ''}`}
      aria-hidden="true"
    />
  );
}
