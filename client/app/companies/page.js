"use client";
import PageLayout from "@/components/layout/PageLayout";
import Spinner from "@/components/ui/Spinner";
import { companyApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";

export default function CompaniesPage() {
  const { data, loading, error } = useFetch(() => companyApi.getAll());
  const companies = data?.companies || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Companies</h1>
        <p className="text-slate-500 text-sm mb-8">Explore companies hiring now</p>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🏢</p>
            <p>No companies yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{c.name}</h3>
                    {c.industry && <p className="text-xs text-slate-500">{c.industry}</p>}
                  </div>
                </div>

                {c.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {c.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  {c.location ? <span>📍 {c.location}</span> : <span />}
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c.size}</span>
                </div>

                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Visit website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
