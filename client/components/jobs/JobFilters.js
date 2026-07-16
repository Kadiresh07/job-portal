"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function JobFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    search: "", location: "", workMode: "", employmentType: "",
  });

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    onFilter(params.toString());
  };

  const handleReset = () => {
    setFilters({ search: "", location: "", workMode: "", employmentType: "" });
    onFilter("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-slate-800">Filters</h3>

      <Input
        label="Search"
        placeholder="Job title or keyword"
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
      />

      <Input
        label="Location"
        placeholder="City or remote"
        value={filters.location}
        onChange={(e) => set("location", e.target.value)}
      />

      <Select
        label="Work Mode"
        value={filters.workMode}
        onChange={(e) => set("workMode", e.target.value)}
      >
        <option value="">All</option>
        <option>Remote</option>
        <option>Hybrid</option>
        <option>Onsite</option>
      </Select>

      <Select
        label="Employment Type"
        value={filters.employmentType}
        onChange={(e) => set("employmentType", e.target.value)}
      >
        <option value="">All</option>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Internship</option>
        <option>Contract</option>
      </Select>

      <Button type="submit" className="w-full">Search</Button>
      <Button type="button" variant="outline" className="w-full" onClick={handleReset}>Reset</Button>
    </form>
  );
}
