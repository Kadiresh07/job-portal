const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body instanceof FormData) delete headers["Content-Type"];

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const authApi = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
};

export const jobsApi = {
  getAll: (params = "") => request(`/jobs?${params}`),
  getOne: (id) => request(`/jobs/${id}`),
  create: (body) => request("/jobs", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/jobs/${id}`, { method: "DELETE" }),
  close: (id) => request(`/jobs/${id}/close`, { method: "PATCH" }),
  save: (id) => request(`/jobs/${id}/save`, { method: "POST" }),
  unsave: (id) => request(`/jobs/${id}/save`, { method: "DELETE" }),
  saved: () => request("/jobs/saved"),
};

export const companyApi = {
  create: (body) => request("/companies", { method: "POST", body: JSON.stringify(body) }),
  getAll: () => request("/companies"),
  getOne: (id) => request(`/companies/${id}`),
  update: (id, body) => request(`/companies/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

export const applicationApi = {
  apply: (jobId, formData) =>
    request(`/jobs/${jobId}/apply`, { method: "POST", body: formData }),
  myApplications: () => request("/applications"),
  jobApplications: (jobId) => request(`/applications/job/${jobId}`),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

export const dashboardApi = {
  employer: () => request("/dashboard/employer"),
  candidate: () => request("/dashboard/candidate"),
  admin: () => request("/dashboard/admin"),
};

export const adminApi = {
  getApplications: () => request("/admin/applications"),
  getUsers: () => request("/admin/users"),
  getCompanies: () => request("/admin/companies"),
  getJobs: () => request("/admin/jobs"),
};
