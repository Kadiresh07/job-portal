"use client";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

const workModeColor = { Remote: "green", Hybrid: "blue", Onsite: "purple" };
const typeColor = { "Full-time": "blue", "Part-time": "yellow", Internship: "green", Contract: "gray" };

export default function JobCard({ job }) {
  const company = job.company || {};

  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Company logo placeholder */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
              {company.name?.[0] || "J"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{company.name || "—"}</p>
            </div>
          </div>
          {job.status === "Closed" && (
            <Badge color="red">Closed</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge color={workModeColor[job.workMode] || "gray"}>{job.workMode}</Badge>
          <Badge color={typeColor[job.employmentType] || "gray"}>{job.employmentType}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            📍 {job.location}
          </span>
          <span className="text-slate-400">
            {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>

        {job.salary && job.salary !== "Not Disclosed" && (
          <p className="mt-2 text-xs font-medium text-green-600">{job.salary}</p>
        )}
      </div>
    </Link>
  );
}
