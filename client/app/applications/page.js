"use client";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { applicationApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const statusColor = {
  Pending: "yellow",
  Reviewed: "blue",
  Shortlisted: "green",
  Rejected: "red",
  Hired: "green",
};

export default function MyApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const { data, loading } = useFetch(() => applicationApi.myApplications(), [user]);
  const applications = data?.applications || [];

  if (authLoading || loading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Applications</h1>
        <p className="text-slate-500 text-sm mb-8">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>

        {applications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No applications yet</p>
            <Link href="/jobs" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Find jobs →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {applications.map((app) => {
              const job = app.job || {};
              const company = job.company || {};
              return (
                <div key={app._id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {company.name?.[0] || "J"}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="font-medium text-sm text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {job.title || "Job"}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">
                        {company.name} {job.location ? `· ${job.location}` : ""}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge color={statusColor[app.status] || "gray"}>{app.status}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
