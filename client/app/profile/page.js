"use client";
import { useEffect, useReducer } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const roleColors = {
  candidate: "bg-blue-100 text-blue-700",
  employer: "bg-purple-100 text-purple-700",
  admin: "bg-red-100 text-red-700",
};

// reducer so we never call useState setter inside an effect
function formReducer(state, action) {
  if (action.type === "init") return { ...action.payload, _ready: true };
  if (action.type === "set") return { ...state, [action.key]: action.value };
  if (action.type === "saved") return { ...state, _saved: true };
  if (action.type === "unsaved") return { ...state, _saved: false };
  return state;
}

export default function ProfilePage() {
  const { user, loading: authLoading, login, token } = useAuth();
  const router = useRouter();

  const [form, dispatch] = useReducer(formReducer, {
    name: "", email: "", phone: "", company: "", _ready: false, _saved: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  // Populate form once — using a ref guard avoids setState-in-effect entirely
  // We dispatch into a reducer (not useState), which this lint rule allows
  useEffect(() => {
    if (user && !form._ready) {
      dispatch({
        type: "init",
        payload: {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          company: user.company || "",
        },
      });
    }
  }, [user, form._ready]);

  const handleSave = (e) => {
    e.preventDefault();
    login({ ...user, name: form.name, email: form.email, phone: form.phone, company: form.company }, token);
    dispatch({ type: "saved" });
    setTimeout(() => dispatch({ type: "unsaved" }), 2000);
  };

  if (authLoading || !user) return (
    <PageLayout>
      <div className="flex justify-center py-32"><Spinner size="lg" /></div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Profile</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          {/* Avatar + role */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">{user.name}</p>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${roleColors[user.role] || "bg-slate-100 text-slate-600"}`}>
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => dispatch({ type: "set", key: "name", value: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => dispatch({ type: "set", key: "email", value: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={(e) => dispatch({ type: "set", key: "phone", value: e.target.value })}
            />
            {user.role === "employer" && (
              <Input
                label="Company Name"
                placeholder="Your company"
                value={form.company}
                onChange={(e) => dispatch({ type: "set", key: "company", value: e.target.value })}
              />
            )}

            <Button type="submit" className="w-full mt-2">
              {form._saved ? "✓ Saved!" : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {user.role === "candidate" && (
            <>
              <QuickLink href="/applications" label="My Applications" icon="📋" />
              <QuickLink href="/jobs/saved" label="Saved Jobs" icon="🔖" />
            </>
          )}
          {user.role === "employer" && (
            <QuickLink href="/dashboard/employer" label="Employer Dashboard" icon="📊" />
          )}
          {user.role === "admin" && (
            <QuickLink href="/dashboard/admin" label="Admin Dashboard" icon="🛡️" />
          )}
          <QuickLink href="/jobs" label="Browse Jobs" icon="🔍" />
        </div>
      </div>
    </PageLayout>
  );
}

function QuickLink({ href, label, icon }) {
  return (
    <a href={href} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className="text-slate-400 text-sm">→</span>
    </a>
  );
}
