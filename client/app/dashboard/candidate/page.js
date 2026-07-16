"use client";
import PageLayout from "@/components/layout/PageLayout";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { dashboardApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const statusColor = {
  Pending: "yellow", Reviewed: "blue", Shortlisted: "green",
  Rejected: "red", Hired: "green",
};

export default function CandidateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const { data, loading } = useFetch(() => dashboardApi.candidate(), [user]);

  if (authLoading || loading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  const stats = data?.stats || {};
  const recent = data?.recentApplications || [];
  const breakdown = data?.statusBreakdown || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Dashboard</h1>
        <p className="text-slate-500 text-sm mb-8">Track your job applications</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applied" value={stats.totalApplications || 0} color="blue" />
          {breakdown.map((b) => (
            <StatCard key={b._id} label={b._id} value={b.count} color={statusColor[b._id] || "gray"} />
          ))}
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Applications</h2>
            <Link href="/jobs" className="text-sm text-blue-600 hover:underline">Browse more jobs →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">📋</p>
              <p>No applications yet</p>
              <Link href="/jobs" className="text-blue-600 text-sm mt-2 inline-block">Find jobs →</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((app) => (
                <div key={app._id} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                      {app.job?.company?.name?.[0] || "J"}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/jobs/${app.job?._id}`} className="font-medium text-sm text-slate-900 hover:text-blue-600 truncate block">
                        {app.job?.title}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">{app.job?.company?.name}</p>
                    </div>
                  </div>
                  <Badge color={statusColor[app.status] || "gray"}>{app.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value, color }) {
  const bg = { blue: "bg-blue-50 text-blue-700", green: "bg-green-50 text-green-700", yellow: "bg-yellow-50 text-yellow-700", red: "bg-red-50 text-red-700", gray: "bg-slate-50 text-slate-600" };
  return (
    <div className={`rounded-xl p-5 ${bg[color] || bg.gray}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  );
}
