"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isHomePage = pathname === "/";

  // Scroll listener for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const dashLink =
    user?.role === "employer"
      ? "/dashboard/employer"
      : user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/candidate";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  // Dynamic nav styles based on page + scroll
  const navBg = isHomePage
    ? scrolled
      ? "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/5"
      : "bg-transparent border-b border-transparent"
    : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm";

  const logoColor = isHomePage && !scrolled ? "text-white" : "text-blue-600";
  const logoTextColor = isHomePage && !scrolled ? "text-white" : "text-slate-900";
  const linkColor = isHomePage && !scrolled ? "text-white/90 hover:text-white" : "text-slate-600 hover:text-blue-600";
  const activeLinkColor = isHomePage && !scrolled ? "text-white font-semibold" : "text-blue-600 font-semibold";
  const hamburgerColor = isHomePage && !scrolled ? "bg-white" : "bg-slate-700";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        style={{ transitionProperty: "background-color, border-color, box-shadow, backdrop-filter" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 flex-shrink-0">
              <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${logoColor}`}>
               Job
              </span>
              <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${logoTextColor}`}>
                Portal
              </span>
            </Link> 

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/jobs" label="Browse Jobs" active={isActive("/jobs")} linkColor={linkColor} activeLinkColor={activeLinkColor} />
              <NavLink href="/companies" label="Companies" active={isActive("/companies")} linkColor={linkColor} activeLinkColor={activeLinkColor} />

              {user ? (
                <div className="flex items-center gap-1 ml-2">
                  <NavLink href={dashLink} label="Dashboard" active={isActive("/dashboard")} linkColor={linkColor} activeLinkColor={activeLinkColor} />

                  {/* User Dropdown */}
                  <div className="relative ml-2" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((o) => !o)}
                      className={`flex items-center gap-2 rounded-full pl-3 pr-2 py-1.5 transition-all duration-200 ${
                        isHomePage && !scrolled
                          ? "bg-white/20 hover:bg-white/30 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      <span className="text-sm font-medium max-w-24 truncate">{user.name}</span>
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-blue-200">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 overflow-hidden transition-all duration-200 origin-top-right ${
                        dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                      </div>
                      <Link href="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <span>👤</span> Profile
                      </Link>
                      {user.role === "candidate" && (
                        <>
                          <Link href="/applications" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span>📋</span> My Applications
                          </Link>
                          <Link href="/jobs/saved" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span>🔖</span> Saved Jobs
                          </Link>
                        </>
                      )}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Link href="/auth/login"
                    className={`text-sm px-4 py-2 rounded-xl border font-medium transition-all duration-200 ${
                      isHomePage && !scrolled
                        ? "border-white/40 text-white hover:bg-white/10 hover:border-white/60"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                    }`}>
                    Login
                  </Link>
                  <Link href="/auth/register"
                    className="text-sm px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 font-medium shadow-md shadow-blue-600/25 hover:shadow-blue-500/30">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className={`md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl gap-1.5 transition-all duration-200 ${
                isHomePage && !scrolled ? "hover:bg-white/10" : "hover:bg-slate-100"
              }`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 transition-all duration-300 ${hamburgerColor} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${hamburgerColor} ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${hamburgerColor} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
            <MobileNavLink href="/jobs" label="Browse Jobs" active={isActive("/jobs")} onClick={() => setMenuOpen(false)} />
            <MobileNavLink href="/companies" label="Companies" active={isActive("/companies")} onClick={() => setMenuOpen(false)} />

            {user ? (
              <>
                <MobileNavLink href={dashLink} label="Dashboard" active={isActive("/dashboard")} onClick={() => setMenuOpen(false)} />
                <MobileNavLink href="/profile" label="👤 Profile" active={isActive("/profile")} onClick={() => setMenuOpen(false)} />
                {user.role === "candidate" && (
                  <>
                    <MobileNavLink href="/applications" label="📋 My Applications" active={isActive("/applications")} onClick={() => setMenuOpen(false)} />
                    <MobileNavLink href="/jobs/saved" label="🔖 Saved Jobs" active={false} onClick={() => setMenuOpen(false)} />
                  </>
                )}
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-red-500 py-2.5 px-3 font-medium rounded-xl hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                  className="text-center text-sm py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)}
                  className="text-center text-sm py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer: only on non-homepage (homepage hero covers the navbar) */}
      {!isHomePage && <div className="h-16" />}
    </>
  );
}

function NavLink({ href, label, active, linkColor, activeLinkColor }) {
  return (
    <Link
      href={href}
      className={`relative text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
        active ? activeLinkColor : linkColor
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-500 rounded-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium py-2.5 px-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );
}
