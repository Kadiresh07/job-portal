"use client";
import { useState, useCallback } from "react";
import PageLayout from "@/components/layout/PageLayout";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { jobsApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const params = `${query ? query + "&" : ""}page=${page}&limit=12`;
  const { data, loading, error } = useFetch(() => jobsApi.getAll(params), [params]);

  const jobs = data?.jobs || [];
  const pagination = data?.pagination;

  const handleFilter = useCallback((q) => {
    setQuery(q);
    setPage(1);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Browse Jobs</h1>
          {pagination && (
            <p className="text-slate-500 text-sm mt-1">{pagination.total} jobs found</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <JobFilters onFilter={handleFilter} />
          </aside>

          {/* Job grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Prev
                    </Button>
                    <span className="text-sm text-slate-600 px-2">
                      Page {page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === pagination.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
