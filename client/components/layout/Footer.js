import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-blue-400 font-bold text-lg">Job</span>
              <span className="text-white font-bold text-lg">Portal</span>
            </div>
            <p className="text-sm leading-relaxed">Find your next opportunity across thousands of companies.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">For Job Seekers</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/dashboard/candidate" className="hover:text-white transition-colors">My Applications</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">For Employers</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/dashboard/employer" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">Companies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Account</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-xs">
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
