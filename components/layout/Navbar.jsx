// import Link from 'next/link'

// export default function Navbar() {
//   return (
//     <nav style={styles.nav}>
//       <Link href="/" style={styles.logo}>
//         Readme
//       </Link>

//       <div style={styles.links}>
//         <Link href="/" style={styles.link}>Home</Link>
//         <Link href="/articles" style={styles.link}>Articles</Link>
//         <Link href="/event" style={styles.link}>Event</Link>
//         <Link href="/community" style={styles.link}>Community</Link>
//         <Link href="/team" style={styles.link}>Team</Link>
//       </div>
//     </nav>
//   )
// }

// const styles = {
//   nav: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '16px 32px',
//     borderBottom: '1px solid #eee',
//     background: '#fff'
//   },
//   logo: {
//     fontSize: '22px',
//     fontWeight: '700',
//     textDecoration: 'none',
//     color: '#000'
//   },
//   links: {
//     display: 'flex',
//     gap: '20px'
//   },
//   link: {
//     textDecoration: 'none',
//     color: '#444',
//     fontSize: '14px'
//   }
// }


import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-[#000000]">
          Readme
        </div>
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-blue-500 font-medium">Home</Link>
          <Link href="/articles" className="text-gray-600 hover:text-black">Articles</Link>
          <Link href="/community" className="text-gray-600 hover:text-black">Community</Link>
          <Link href="/events" className="text-gray-600 hover:text-black">Events</Link>
          <Link href="/team" className="text-gray-600 hover:text-black">Team</Link>
        </div>
        <Link
          href="/login"
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}