"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
];

import { Menu as MenuIcon, X as CloseIcon, Home, BookOpen, Users, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95">
              <div className="bg-black p-1 rounded-sm shrink-0">
                <Image
                  src="/assets/icons/logo.svg"
                  width={24}
                  height={24}
                  alt="logo"
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold truncate text-black">Readme</span>
            </Link>
          </div>
          
          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center justify-center flex-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${isActive ? "text-black font-bold" : "text-gray-500"
                    } hover:text-black transition-colors text-sm font-medium`}
                >
                  {link.label}
                </Link>
              );
            })}
            {mounted && user && (
              <Link
                href="/drafts"
                className={`${pathname === "/drafts" ? "text-black font-bold" : "text-gray-600"
                  } hover:text-black transition-colors text-sm font-medium`}
              >
                Drafts
              </Link>
            )}
          </div>

          {/* Right: User Profile & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {mounted && !loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${user.id}`} className="transition-transform hover:scale-110 active:scale-95 shrink-0">
                    <Image
                      src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "/avatar.jpg"}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-gray-100 object-cover w-8 h-8 cursor-pointer"
                    />
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/");
                      router.refresh();
                    }}
                    className="hidden lg:block bg-transparent text-[#1e293b] border border-gray-200 px-5 py-1.5 rounded-full text-sm font-semibold shadow-none hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                  
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
                  >
                    {isMenuOpen ? <CloseIcon className="w-6 h-6 stroke-[2.5px]" /> : <MenuIcon className="w-7 h-7 stroke-[2px]" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                   <Link
                    href="/login"
                    className="bg-black text-white px-6 md:px-8 py-2 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-md inline-flex items-center justify-center white-nowrap"
                  >
                    Login
                  </Link>

                   <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
                  >
                    {isMenuOpen ? <CloseIcon className="w-6 h-6 stroke-[2.5px]" /> : <MenuIcon className="w-7 h-7 stroke-[2px]" />}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Structural Isolation */}
      <div className={`lg:hidden fixed inset-0 z-[9999] transition-all duration-300 ease-in-out ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMenuOpen(false)}
        />
        
        <div 
          className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-gray-100 transition-all duration-500 transform rounded-l-[32px] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full opacity-0'}`}
          style={{ backgroundColor: 'white' }}
        >
          <div className="flex items-center justify-between p-8 pb-4">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Navigation</span>
             <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <CloseIcon className="w-8 h-8 stroke-[2px]" />
            </button>
          </div>

          <div className="flex flex-col px-8 gap-0.5 mt-2 overflow-y-auto pb-20">
            {NAV_LINKS.map((link) => {
              const Icon = link.label === 'Home' ? Home : 
                           link.label === 'Articles' ? BookOpen :
                           link.label === 'Community' ? Users :
                           BookOpen; 
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3.5 flex items-center gap-4 text-base font-medium transition-all duration-300 border-b border-gray-50/50 ${pathname === link.href ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  <Icon className={`w-5 h-5 ${pathname === link.href ? 'text-blue-500' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              );
            })}
            
            {user && (
               <>
                <Link
                  href="/drafts"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3.5 flex items-center gap-4 text-base font-medium transition-all duration-300 border-b border-gray-50/50 ${pathname === '/drafts' ? 'text-black' : 'text-gray-500'}`}
                >
                  <BookOpen className={`w-5 h-5 ${pathname === '/drafts' ? 'text-blue-500' : 'text-gray-400'}`} />
                  Drafts
                </Link>
                <div className="mt-auto px-0 pb-10">
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsMenuOpen(false);
                      router.push("/");
                      router.refresh();
                    }}
                    className="w-full flex items-center gap-4 text-left py-4 text-base font-semibold text-red-500 mt-4 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
