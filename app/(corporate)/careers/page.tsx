"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  Calendar,
  Sparkles
} from "lucide-react";
import { dataStore, JobPosting } from "@/lib/data-store";

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Only fetch active (non-hidden) job vacancies for candidates
    setJobs(dataStore.getActiveJobs());
    const unsub = dataStore.subscribe(() => {
      setJobs([...dataStore.getActiveJobs()]);
    });
    return unsub;
  }, []);

  const departments = [
    "All",
    "R&D & Innovation",
    "Quality & Compliance",
    "Operations & Logistics",
    "Sales & Marketing",
    "Human Resources",
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.role && job.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.educationalCriteria && job.educationalCriteria.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesQuery;
  });

  return (
    <div className="py-16 px-6 max-w-[1240px] mx-auto">
      {/* Hero */}
      <div className="max-w-3xl mb-14">
        <span className="text-[#1AA3D9] text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> JOIN OUR TALENT NETWORK
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0F] tracking-tight mb-6">
          Fuel the Future of Healthcare &amp; Biochemical Science
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          At Eastern Biochemicals, every team member directly contributes to making medicines more affordable, effective, and accessible across North East India and nationwide. Explore our current open positions.
        </p>
      </div>

      {/* Perks summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#EEF2F8] p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-[#0A1B8F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-gray-900">World-Class Laboratories</h4>
            <p className="text-xs text-gray-500 mt-1">High-end chromatography and formulation pilot plants</p>
          </div>
        </div>
        <div className="bg-[#EEF2F8] p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-[#0A1B8F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-gray-900">Competitive Compensation</h4>
            <p className="text-xs text-gray-500 mt-1">Top-tier salary benchmarks, annual bonuses &amp; health coverage</p>
          </div>
        </div>
        <div className="bg-[#EEF2F8] p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-[#0A1B8F] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-gray-900">Direct Mentorship</h4>
            <p className="text-xs text-gray-500 mt-1">Direct guidance from senior pharmaceutical scientists &amp; directors</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAFBFD] p-4 sm:p-6 rounded-2xl border border-gray-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Department Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? "bg-[#0A1B8F] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, degrees, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-full outline-none focus:border-[#0A1B8F]"
          />
        </div>
      </div>

      {/* Job Cards List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Briefcase className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 font-semibold text-sm">No active job openings found matching your criteria.</p>
            <p className="text-xs text-gray-400 mt-1">Check back later or try adjusting your search terms.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A1B8F] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block border border-blue-100">
                    {job.department}
                  </span>
                  {job.lastDateToApply && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Apply before {job.lastDateToApply}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">{job.title}</h3>
                  {job.role && (
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{job.role}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> Exp: {job.experienceRange}
                  </span>
                  {job.educationalCriteria && (
                    <span className="flex items-center gap-1 text-purple-700 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> {job.educationalCriteria}
                    </span>
                  )}
                  {job.salaryRange && (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" /> {job.salaryRange.replace(/^₹/, "")}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/careers/${job.slug}`}
                className="bg-[#0A1B8F] text-white hover:bg-[#1527ab] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0 shadow-sm transition-all"
              >
                <span>Read Details &amp; Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
