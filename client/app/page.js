import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";

const stats = [
  { label: "Jobs Posted", value: "10,000+" },
  { label: "Companies", value: "500+" },
  { label: "Candidates Hired", value: "25,000+" },
];

const categories = [
  {
    label: "Technology", count: "2,400 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    label: "Marketing", count: "870 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    label: "Design", count: "640 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  },
  {
    label: "Finance", count: "1,100 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    label: "Healthcare", count: "930 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    label: "Education", count: "520 jobs",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
];

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Find Your <span className="text-yellow-300">Dream Job</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Search thousands of jobs across all industries and locations. Your next career move starts here.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-white rounded-xl px-5 py-3.5 text-slate-900 text-sm focus:outline-none shadow-lg"
              placeholder="Job title, keyword, or company..."
            />
            <Link
              href="/jobs"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg text-sm whitespace-nowrap"
            >
              Search Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Browse by Category</h2>
          <p className="text-slate-500 mt-2">Explore opportunities in the field that excites you most</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.label}
              href={`/jobs?search=${c.label}`}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex justify-center mb-3 text-blue-500 group-hover:text-blue-600 transition-colors">
                {c.icon}
              </div>
              <div className="font-semibold text-sm text-slate-800 group-hover:text-blue-600">{c.label}</div>
              <div className="text-xs text-slate-400 mt-1">{c.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Are you hiring?</h2>
            <p className="text-slate-400">Post jobs and reach thousands of qualified candidates today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Post a Job
            </Link>
            <Link href="/companies" className="border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Browse Companies
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
