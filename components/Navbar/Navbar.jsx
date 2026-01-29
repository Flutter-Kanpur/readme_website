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
import CustomButton from "../Button/CustomButton";
export default function Navbar() {

   const navLinks = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "Community", href: "/community" },
  { name: "Events", href: "/events" },
  { name: "Team", href: "/team" }
];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-[#000000]">
          Readme
        </div>
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <CustomButton href={'/login'}>
          Login
        </CustomButton>
      </div>
    </nav>
  );
}