// import Link from "next/link";
// import CustomButton from "../Button/CustomButton";
// import { useRouter } from "next/navigation";
// export default function Navbar() {

//    const navLinks = [
//   { name: "Home", href: "/" },
//   { name: "Articles", href: "/articles" },
//   { name: "Community", href: "/community" },
//   { name: "Events", href: "/events" },
//   { name: "Team", href: "/team" }
// ];

//   const router = useRouter();

//   const handleClick = () => {
//     router.push('/login');
//   };

//   return (
//     <nav className="w-full border-b border-gray-200 bg-white">
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//         <div className="text-xl font-bold text-[#000000]">
//           Readme
//         </div>
//         <div className="hidden md:flex gap-8">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="text-gray-600 hover:text-black"
//             >
//               {link.name}
//             </Link>
//           ))}
//         </div>
//         <CustomButton handleClick={handleClick}>
//           Login
//         </CustomButton>
//       </div>
//     </nav>
//   );
// }

import Link from "next/link";
import CustomButton from "../Button/CustomButton";
import { useRouter } from "next/navigation";
import "./styles.css";

export default function Navbar() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "Community", href: "/community" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" }
  ];

  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          Readme
        </div>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-link"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <CustomButton handleClick={handleClick}>
          Login
        </CustomButton>
      </div>
    </nav>
  );
}
