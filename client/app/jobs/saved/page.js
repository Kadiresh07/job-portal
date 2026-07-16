"use client";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import JobCard from "@/components/jobs/JobCard";
import Spinner from "@/components/ui/Spinner";
import { jobsApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SavedJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const { data, loading } = useFetch(() => jobsApi.saved(), [user]);
  const saved = data?.saved || [];

  if (authLoading || loading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Saved Jobs</h1>
        <p className="text-slate-500 text-sm mb-8">{saved.length} saved job{saved.length !== 1 ? "s" : ""}</p>

        {saved.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔖</p>
            <p className="font-medium">No saved jobs yet</p>
            <Link href="/jobs" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {saved.map((s) => s.job && <JobCard key={s._id} job={s.job} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
