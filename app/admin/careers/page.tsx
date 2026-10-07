"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  GraduationCap,
  IndianRupee,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  Send,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
  Award,
  Check
} from "lucide-react";
import { dataStore, JobApplication, JobPosting } from "@/lib/data-store";

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "postings">("applications");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [jobFilter, setJobFilter] = useState<string>("ALL");

  // Job Modal (Create / Edit)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  // Job Form fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobDepartment, setJobDepartment] = useState("R&D & Innovation");
  const [jobLocation, setJobLocation] = useState("Guwahati / Agartala, India");
  const [jobType, setJobType] = useState<JobPosting["employmentType"]>("Full-Time");
  const [jobExperience, setJobExperience] = useState("2-5 Years");
  const [jobSalary, setJobSalary] = useState("₹6,00,000 - ₹9,00,000 PA");
  const [jobEducation, setJobEducation] = useState("B.Pharm / M.Pharm / M.Sc Chemistry");
  const [jobLastDate, setJobLastDate] = useState("2026-11-30");
  const [jobOpenings, setJobOpenings] = useState(2);
  const [jobStatus, setJobStatus] = useState<"OPEN" | "HIDDEN">("OPEN");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobBenefits, setJobBenefits] = useState("");

  // HR Notification Modal
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [hrTemplateType, setHrTemplateType] = useState<"SHORTLIST" | "INTERVIEW" | "HIRED" | "REJECT" | "CUSTOM">("INTERVIEW");
  const [hrCustomMessage, setHrCustomMessage] = useState("");
  const [hrCopied, setHrCopied] = useState(false);

  // Load store data
  useEffect(() => {
    setApplications(dataStore.getApplications());
    setJobs(dataStore.getJobs());

    const unsub = dataStore.subscribe(() => {
      setApplications([...dataStore.getApplications()]);
      setJobs([...dataStore.getJobs()]);
    });
    return unsub;
  }, []);

  // Format clean phone for WhatsApp
  const cleanPhoneNumber = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/[^0-9]/g, "");
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  // Open HR Notification Modal
  const handleOpenHrModal = (app: JobApplication) => {
    setSelectedApp(app);
    generateHrMessage(app, "INTERVIEW");
    setIsHrModalOpen(true);
  };

  // Generate HR Message Template
  const generateHrMessage = (app: JobApplication, type: "SHORTLIST" | "INTERVIEW" | "HIRED" | "REJECT" | "CUSTOM") => {
    setHrTemplateType(type);
    let msg = "";
    if (type === "SHORTLIST") {
      msg = `Dear ${app.name},\n\nGreetings from Eastern Biochemicals Private Limited HR Team.\n\nWe have reviewed your profile for the position of "${app.jobTitle}" and are pleased to inform you that your application has been SHORTLISTED for further technical evaluation.\n\nOur HR coordinator will connect with you soon regarding the schedule. If you have any questions, please reply to this message.\n\nBest regards,\nHR Department\nEastern Biochemicals Private Limited\nwww.easternbiochemicals.com`;
    } else if (type === "INTERVIEW") {
      msg = `Dear ${app.name},\n\nGreetings from Eastern Biochemicals Private Limited.\n\nWe would like to invite you for an interview round for the position of "${app.jobTitle}".\n\nInterview Mode: Video Call / In-Person\nPlease let us know your availability over the next 2-3 business days.\n\nContact: HR Recruitment Wing\nEastern Biochemicals Private Limited`;
    } else if (type === "HIRED") {
      msg = `Congratulations ${app.name}!\n\nWe are delighted to inform you that Eastern Biochemicals Private Limited has selected you for the position of "${app.jobTitle}".\n\nOur HR executive will share the formal Offer Letter and onboarding details shortly. Please confirm receipt of this message.\n\nWarm regards,\nManagement Team\nEastern Biochemicals Private Limited`;
    } else if (type === "REJECT") {
      msg = `Dear ${app.name},\n\nThank you for your interest in career opportunities with Eastern Biochemicals Private Limited and for applying for "${app.jobTitle}".\n\nAfter careful review, we regret to inform you that we will not be moving forward with your candidacy for this role at this time. We will retain your details in our talent database for future vacancies.\n\nWe wish you all the best in your career pursuits.\n\nSincerely,\nHR Department\nEastern Biochemicals Private Limited`;
    } else {
      msg = `Dear ${app.name},\n\nGreetings from Eastern Biochemicals Private Limited regarding your application for "${app.jobTitle}".\n\n`;
    }
    setHrCustomMessage(msg);
  };

  // Send WhatsApp
  const handleSendWhatsApp = () => {
    if (!selectedApp) return;
    const phone = cleanPhoneNumber(selectedApp.phone);
    const encoded = encodeURIComponent(hrCustomMessage);
    dataStore.recordHrContact(selectedApp.id, `Sent WhatsApp notification (${hrTemplateType})`);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    setIsHrModalOpen(false);
  };

  // Send Email
  const handleSendEmail = () => {
    if (!selectedApp) return;
    dataStore.recordHrContact(selectedApp.id, `Sent Email notification (${hrTemplateType})`);
    const subject = encodeURIComponent(`Update regarding your application for ${selectedApp.jobTitle} - Eastern Biochemicals`);
    const body = encodeURIComponent(hrCustomMessage);
    window.location.href = `mailto:${selectedApp.email}?subject=${subject}&body=${body}`;
    setIsHrModalOpen(false);
  };

  // Change Application Status
  const handleStatusChange = (id: string, status: JobApplication["status"]) => {
    dataStore.updateApplicationStatus(id, status);
    if (selectedApp?.id === id) {
      setSelectedApp({ ...selectedApp, status });
    }
  };

  // Delete Application
  const handleDeleteApplication = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete application from "${name}"? This cannot be undone.`)) {
      dataStore.deleteApplication(id);
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    }
  };

  // Job Modal Helpers
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobTitle("");
    setJobRole("");
    setJobDepartment("R&D & Innovation");
    setJobLocation("Guwahati / Agartala, India");
    setJobType("Full-Time");
    setJobExperience("2-5 Years");
    setJobSalary("₹6,00,000 - ₹9,00,000 PA");
    setJobEducation("B.Pharm / M.Pharm / M.Sc Chemistry");
    setJobLastDate("2026-11-30");
    setJobOpenings(2);
    setJobStatus("OPEN");
    setJobDescription("Lead clinical research and regulatory compliance tasks within our GMP pharmaceutical hub.");
    setJobRequirements("Bachelor or Master degree in related field\nMinimum 2 years industrial experience\nKnowledge of cGMP and standard testing protocols");
    setJobBenefits("Competitive compensation with annual performance bonus\nComprehensive health insurance\nCareer advancement opportunities");
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobRole(job.role || "");
    setJobDepartment(job.department);
    setJobLocation(job.location);
    setJobType(job.employmentType);
    setJobExperience(job.experienceRange);
    setJobSalary(job.salaryRange || "");
    setJobEducation(job.educationalCriteria || "");
    setJobLastDate(job.lastDateToApply || "");
    setJobOpenings(job.openingsCount || 1);
    setJobStatus(job.status === "HIDDEN" ? "HIDDEN" : "OPEN");
    setJobDescription(job.description || "");
    setJobRequirements((job.requirements || []).join("\n"));
    setJobBenefits((job.benefits || []).join("\n"));
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    const reqs = jobRequirements.split("\n").map((r) => r.trim()).filter(Boolean);
    const bens = jobBenefits.split("\n").map((b) => b.trim()).filter(Boolean);
    const slug = jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingJob) {
      dataStore.updateJob(editingJob.id, {
        title: jobTitle,
        slug,
        role: jobRole,
        department: jobDepartment,
        location: jobLocation,
        employmentType: jobType,
        experienceRange: jobExperience,
        salaryRange: jobSalary,
        educationalCriteria: jobEducation,
        lastDateToApply: jobLastDate,
        openingsCount: Number(jobOpenings) || 1,
        status: jobStatus,
        description: jobDescription,
        requirements: reqs,
        benefits: bens,
      });
    } else {
      dataStore.createJob({
        title: jobTitle,
        slug,
        role: jobRole,
        department: jobDepartment,
        location: jobLocation,
        employmentType: jobType,
        experienceRange: jobExperience,
        salaryRange: jobSalary,
        educationalCriteria: jobEducation,
        lastDateToApply: jobLastDate,
        openingsCount: Number(jobOpenings) || 1,
        status: jobStatus,
        description: jobDescription,
        requirements: reqs,
        benefits: bens,
      });
    }
    setIsJobModalOpen(false);
  };

  const handleToggleHideJob = (id: string, title: string, currentStatus: string) => {
    const newStatus = currentStatus === "OPEN" ? "HIDDEN" : "OPEN";
    if (confirm(`Do you want to ${newStatus === "HIDDEN" ? "HIDE" : "UNHIDE/PUBLISH"} post "${title}"?`)) {
      dataStore.toggleHideJob(id);
    }
  };

  const handleDeleteJob = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete job vacancy "${title}"? This cannot be undone.`)) {
      dataStore.deleteJob(id);
    }
  };

  // Filtered Applications (Always New to Old from dataStore.getApplications)
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "ALL" || app.status === stageFilter;
    const matchesJob = jobFilter === "ALL" || app.jobTitle === jobFilter;
    return matchesSearch && matchesStage && matchesJob;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Careers &amp; Recruitment Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish job vacancy advertisements, manage candidate applications in real-time, and notify applicants via HR contact.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateJob}
            className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job Vacancy</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "applications"
              ? "border-[#0A1B8F] text-[#0A1B8F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
          {applications.filter((a) => a.status === "NEW").length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
              {applications.filter((a) => a.status === "NEW").length} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("postings")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "postings"
              ? "border-[#0A1B8F] text-[#0A1B8F]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Vacancies &amp; Advertisements ({jobs.length})</span>
        </button>
      </div>

      {/* TAB 1: CANDIDATE APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, phone or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-transparent outline-none w-full text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none text-slate-700 font-medium"
              >
                <option value="ALL">All Stages</option>
                <option value="NEW">New Applications</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="ACCEPTED">Accepted / Shortlisted</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 outline-none text-slate-700 font-medium max-w-[200px]"
              >
                <option value="ALL">All Positions</option>
                {Array.from(new Set(applications.map((a) => a.jobTitle))).map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Grid / Table and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Applications List (Top to Bottom, Newest First) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Applications ({filteredApplications.length}) &bull; Ordered Newest to Oldest
                </span>
                <span className="text-[11px] text-slate-400">Click any row to view &amp; notify candidate</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Position</th>
                      <th className="py-3.5 px-4">Education &amp; Exp</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4">Stage</th>
                      <th className="py-3.5 px-4 text-right">HR Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          selectedApp?.id === app.id ? "bg-blue-50/70" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 block">{app.name}</span>
                            {app.status === "NEW" && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="New Application" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{app.phone}</span>
                            <span>&bull;</span>
                            <span className="truncate max-w-[120px]">{app.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {app.jobTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold text-slate-700">{app.education || "Graduate"}</div>
                          <div className="text-[10px] text-slate-400">{app.experienceYears || "0"} Exp</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Today"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === "HIRED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : app.status === "REJECTED"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : app.status === "ACCEPTED"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : app.status === "INTERVIEW"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenHrModal(app);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all"
                            title="Send HR Notification via WhatsApp / Contact Number"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Notify</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-xs">No candidate applications found.</p>
                          <p className="text-[11px] text-slate-400 mt-1">Applications submitted by candidates on the public careers page will appear here immediately.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Selected Candidate Review & HR Actions */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5 sticky top-20">
              {selectedApp ? (
                <>
                  <div className="flex items-start justify-between pb-3 border-b">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-base">{selectedApp.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            selectedApp.status === "HIRED"
                              ? "bg-emerald-100 text-emerald-800"
                              : selectedApp.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : selectedApp.status === "ACCEPTED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {selectedApp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedApp.jobTitle}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteApplication(selectedApp.id, selectedApp.name)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Application Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Candidate Quick Contact Card */}
                  <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{selectedApp.phone}</span>
                      </div>
                      <a
                        href={`tel:${selectedApp.phone}`}
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
                      >
                        Call
                      </a>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[170px]">{selectedApp.email}</span>
                      </div>
                      <a
                        href={`mailto:${selectedApp.email}`}
                        className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100"
                      >
                        Email
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200/60">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      <span><strong>Education:</strong> {selectedApp.education || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      <span><strong>Experience:</strong> {selectedApp.experienceYears || "Fresh"}</span>
                    </div>

                    {selectedApp.currentLocation && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>Location:</strong> {selectedApp.currentLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Candidate Statement / Cover Note */}
                  {selectedApp.coverNote && (
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-slate-800 block text-[11px]">Candidate Statement:</span>
                      <p className="text-slate-600 leading-relaxed italic text-[11px]">{selectedApp.coverNote}</p>
                    </div>
                  )}

                  {/* HR Notification Button Banner */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Direct HR Notification</span>
                      {selectedApp.hrContacted && (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Contacted
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Send official acceptance, interview invitation or hiring decision to candidate via WhatsApp or Call.
                    </p>
                    <button
                      onClick={() => handleOpenHrModal(selectedApp)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send HR Notification Now</span>
                    </button>
                  </div>

                  {/* Recruitment Stage Progression */}
                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-bold text-slate-700 block">Update Candidate Stage:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: "Accept / Shortlist", value: "ACCEPTED" },
                        { label: "Mark Hired", value: "HIRED" },
                        { label: "Interview Round", value: "INTERVIEW" },
                        { label: "Screening", value: "SCREENING" },
                        { label: "Reject Candidate", value: "REJECTED" },
                        { label: "Reset to New", value: "NEW" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleStatusChange(selectedApp.id, item.value as JobApplication["status"])}
                          className={`py-2 px-2 rounded-xl font-bold transition-all text-[11px] cursor-pointer text-center ${
                            selectedApp.status === item.value
                              ? item.value === "HIRED"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : item.value === "REJECTED"
                                ? "bg-red-600 text-white shadow-xs"
                                : item.value === "ACCEPTED"
                                ? "bg-[#0A1B8F] text-white shadow-xs"
                                : "bg-amber-600 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <User className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold text-xs text-slate-600">No Candidate Selected</p>
                  <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto">
                    Select any applicant from the list on the left to review details and trigger HR notifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOB VACANCIES & ADVERTISEMENTS */}
      {activeTab === "postings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-3xl border p-6 space-y-4 shadow-xs relative transition-all ${
                  job.status === "HIDDEN" ? "border-slate-300/80 bg-slate-50/50 opacity-80" : "border-slate-200/80"
                }`}
              >
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0A1B8F] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {job.department}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {job.status === "HIDDEN" ? (
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Title & Role */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{job.title}</h3>
                  {job.role && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{job.role}</p>
                  )}
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Salary:</strong> {job.salaryRange || "Competitive / Commensurate"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate"><strong>Education:</strong> {job.educationalCriteria || "Any Graduate"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span><strong>Experience:</strong> {job.experienceRange}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span><strong>Last Date:</strong> {job.lastDateToApply || "Open until filled"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.location} &bull; {job.employmentType} ({job.openingsCount} openings)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Toggle Hide / Unhide */}
                    <button
                      onClick={() => handleToggleHideJob(job.id, job.title, job.status)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        job.status === "HIDDEN"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title={job.status === "HIDDEN" ? "Unhide this job" : "Hide this job from candidate view"}
                    >
                      {job.status === "HIDDEN" ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Unhide</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>

                    {/* Edit Job */}
                    <button
                      onClick={() => handleOpenEditJob(job)}
                      className="p-2 rounded-xl text-xs font-bold bg-blue-50 text-[#0A1B8F] hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit job details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Delete Job */}
                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    className="p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                    title="Delete Job Post permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-xs">No job vacancy posts created yet.</p>
                <button
                  onClick={handleOpenCreateJob}
                  className="mt-3 text-xs text-[#0A1B8F] font-bold underline"
                >
                  Create your first job advertisement
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: POST / EDIT JOB VACANCY */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {editingJob ? "Edit Job Vacancy Advertisement" : "Post New Job Vacancy Advertisement"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify designation, educational criteria, compensation, and application deadline.
                </p>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Post Title / Designation *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Formulation Scientist"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role / Department Specifics *</label>
                  <input
                    type="text"
                    required
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Lead R&D Formulation Chemist"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={jobDepartment}
                    onChange={(e) => setJobDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="R&D & Innovation">R&D & Innovation</option>
                    <option value="Quality & Compliance">Quality & Compliance</option>
                    <option value="Operations & Logistics">Operations & Logistics</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Employment Type *</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Openings Count</label>
                  <input
                    type="number"
                    min={1}
                    value={jobOpenings}
                    onChange={(e) => setJobOpenings(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Salary / Compensation *</label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. ₹12,00,000 - ₹18,00,000 PA / Negotiable"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Experience Required *</label>
                  <input
                    type="text"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    placeholder="e.g. 3-5 Years / Freshers Welcome"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Educational Criteria *</label>
                  <input
                    type="text"
                    required
                    value={jobEducation}
                    onChange={(e) => setJobEducation(e.target.value)}
                    placeholder="e.g. B.Pharm / M.Pharm / M.Sc Chemistry"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Last Date of Applying *</label>
                  <input
                    type="date"
                    required
                    value={jobLastDate}
                    onChange={(e) => setJobLastDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Job Hub Location *</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Guwahati / Agartala, India"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Publish Status</label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-bold"
                  >
                    <option value="OPEN">OPEN (Visible on public career site)</option>
                    <option value="HIDDEN">HIDDEN (Draft / Hide from public view)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">About Post / Role Description *</label>
                <textarea
                  rows={3}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Outline key responsibilities and impact of this role..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Key Requirements (1 per line)</label>
                  <textarea
                    rows={3}
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Benefits &amp; Perks (1 per line)</label>
                  <textarea
                    rows={3}
                    value={jobBenefits}
                    onChange={(e) => setJobBenefits(e.target.value)}
                    placeholder="Competitive compensation&#10;Health Insurance coverage&#10;Relocation support"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  {editingJob ? "Save Changes" : "Publish Vacancy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HR DIRECT NOTIFICATION DIALOG */}
      {isHrModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b">
              <div>
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>HR Candidate Notification</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send notification directly to candidate contact number ({selectedApp.phone}) or email ({selectedApp.email}).
                </p>
              </div>
              <button
                onClick={() => setIsHrModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Message Template:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: "INTERVIEW", label: "Interview Call" },
                  { id: "SHORTLIST", label: "Shortlisted" },
                  { id: "HIRED", label: "Hired / Offer" },
                  { id: "REJECT", label: "Regret / Reject" },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => generateHrMessage(selectedApp, tpl.id as any)}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer text-center ${
                      hrTemplateType === tpl.id
                        ? "bg-[#0A1B8F] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Message Box */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Notification Message Content:</label>
              <textarea
                rows={7}
                value={hrCustomMessage}
                onChange={(e) => setHrCustomMessage(e.target.value)}
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono leading-relaxed"
              />
            </div>

            {/* Candidate Number Preview */}
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Target Candidate Contact: {selectedApp.phone}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">{selectedApp.name}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(hrCustomMessage);
                  setHrCopied(true);
                  setTimeout(() => setHrCopied(false), 2000);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {hrCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{hrCopied ? "Copied to Clipboard!" : "Copy Text"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
