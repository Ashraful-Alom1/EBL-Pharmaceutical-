"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  MapPin,
  Clock,
  Send,
  GraduationCap,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Building
} from "lucide-react";
import { dataStore } from "@/lib/data-store";

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const job = dataStore.getJobBySlug(resolvedParams.slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!job) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold">Job opening not found or has been closed.</h2>
        <Link href="/careers" className="text-[#0A1B8F] underline mt-4 inline-block font-bold text-sm">
          Return to All Careers
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      dataStore.submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        name,
        email,
        phone,
        education,
        experienceYears: experience,
        currentLocation: location,
        coverNote,
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="py-14 px-6 max-w-[1100px] mx-auto">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0A1B8F] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Openings
      </Link>

      {/* Header Banner */}
      <div className="bg-[#FAFBFD] p-8 sm:p-10 rounded-3xl border border-gray-200 mb-10 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0A1B8F] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {job.department}
          </span>
          {job.lastDateToApply && (
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Apply by {job.lastDateToApply}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{job.title}</h1>
        {job.role && (
          <p className="text-sm text-gray-600 font-semibold mb-6">{job.role}</p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-600 font-medium pt-4 border-t border-gray-200/60">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-gray-400" /> {job.employmentType} ({job.openingsCount} Openings)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" /> Exp: {job.experienceRange}
          </span>
          {job.salaryRange && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <IndianRupee className="w-4 h-4" /> {job.salaryRange.replace(/^₹/, "")}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Job Description, Criteria & Requirements */}
        <div className="lg:col-span-7 space-y-8">
          {/* Key Job Specifications Grid */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {job.educationalCriteria && (
              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Educational Qualification
                </span>
                <p className="font-bold text-gray-900">{job.educationalCriteria}</p>
              </div>
            )}

            {job.salaryRange && (
              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Compensation / CTC
                </span>
                <p className="font-bold text-emerald-700">{job.salaryRange}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Experience Needed
              </span>
              <p className="font-bold text-gray-900">{job.experienceRange}</p>
            </div>

            {job.lastDateToApply && (
              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-500" /> Application Deadline
                </span>
                <p className="font-bold text-red-600">{job.lastDateToApply}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Role Overview &amp; Responsibilities</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Key Requirements &amp; Eligibility</h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#0A1B8F] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits &amp; What We Offer</h3>
              <ul className="space-y-2.5">
                {job.benefits.map((ben, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Application Form (Basic Details - No CV Upload Required) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md sticky top-24">
            <h3 className="text-xl font-black text-gray-900 mb-1">Apply for this Vacancy</h3>
            <p className="text-xs text-gray-500 mb-6">
              Submit your basic contact and qualification details. Our HR department will contact you directly via WhatsApp or phone call. <strong>No resume upload needed.</strong>
            </p>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-black text-lg text-gray-900">Application Submitted Successfully!</h4>
                <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 text-left space-y-2 border">
                  <p>
                    Thank you, <strong>{name}</strong>! Your application for <strong>{job.title}</strong> has been directly delivered to the Eastern Biochemicals HR team.
                  </p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                    <p><strong>Contact Registered:</strong> {phone}</p>
                    <p><strong>Email Registered:</strong> {email}</p>
                    <p><strong>Highest Education:</strong> {education}</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-700 font-semibold">
                  Our HR coordinator will review your profile and reach out to your registered phone number.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setEducation("");
                    setExperience("");
                    setLocation("");
                    setCoverNote("");
                  }}
                  className="text-xs text-[#0A1B8F] underline font-bold cursor-pointer"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Contact Number (WhatsApp / Phone) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">HR will contact you via WhatsApp / Call at this number.</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Educational Qualification *</label>
                  <input
                    type="text"
                    required
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Pharm / M.Sc Chemistry / Graduate"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Experience *</label>
                    <input
                      type="text"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 3 Years / Fresher"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Current City / Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Guwahati, Assam"
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Remarks / Note for HR (Optional)</label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state your relevant background or preferred joining date..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0A1B8F] hover:bg-[#1527ab] text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <span>Registering Application...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Your information is submitted directly to Eastern Biochemicals HR.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
