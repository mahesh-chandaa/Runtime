import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Briefcase, 
  FileText, 
  MoreVertical, 
  Play, 
  Trash2, 
  Infinity,
  Share2
} from "lucide-react";
import { CandidateProfile } from "../types";

export interface SessionCardItem {
  id: string;
  date: string;
  company: string;
  role: string;
  tags: string[];
  status: "ready" | "in_progress" | "ended";
  usageText: string;
  logoType?: "unify" | "hexaware" | "avoke" | "virtusa" | "google" | "meta" | "amazon" | "default";
  logoBg?: string;
  notes?: string;
  transcriptSample?: { speaker: string; text: string; time: string }[];
}

export const INITIAL_CALL_SESSIONS: SessionCardItem[] = [
  {
    id: "cs-1",
    date: "AUG 25, 2026",
    company: "Unify",
    role: "L1 Support Engineer",
    tags: ["Interview", "Transcript"],
    status: "ready",
    usageText: "No usage yet",
    logoType: "unify",
    logoBg: "from-blue-600 to-indigo-600",
    transcriptSample: [
      { speaker: "Interviewer", text: "Can you walk us through how you troubleshoot an unresponsive network client?", time: "00:15" },
      { speaker: "Candidate", text: "I start with the OSI physical and transport layer isolation, checking DHCP leases, DNS resolution, and TCP handshake latency...", time: "00:45" }
    ]
  },
  {
    id: "cs-2",
    date: "AUG 24, 2026",
    company: "Hexaware Technologies",
    role: "AI Software Engineer",
    tags: ["Interview", "Transcript"],
    status: "ready",
    usageText: "No usage yet",
    logoType: "hexaware",
    logoBg: "from-blue-700 to-cyan-700",
    transcriptSample: [
      { speaker: "Interviewer", text: "How do you handle rate-limiting and fallback orchestration when calling LLM endpoints?", time: "01:10" },
      { speaker: "Candidate", text: "We implement token-bucket throttling combined with exponential jitter backoff, routing non-critical prompts to lightweight local models.", time: "01:50" }
    ]
  },
  {
    id: "cs-3",
    date: "JUL 3, 2026",
    company: "Avoke Tech",
    role: "Playwright Automation Engineer",
    tags: ["Interview", "Transcript"],
    status: "ready",
    usageText: "No usage yet",
    logoType: "avoke",
    logoBg: "from-purple-600 to-pink-600",
    transcriptSample: [
      { speaker: "Interviewer", text: "What strategy do you use for flaky element selectors in distributed CI runs?", time: "02:00" },
      { speaker: "Candidate", text: "I prioritize user-facing role locators (getByRole, getByTestId) and configure automatic retries with web-first assertions.", time: "02:40" }
    ]
  },
  {
    id: "cs-4",
    date: "JUN 25, 2026",
    company: "Virtusa",
    role: "Automation Test Engineer",
    tags: ["Interview", "Transcript"],
    status: "ready",
    usageText: "No usage yet",
    logoType: "virtusa",
    logoBg: "from-cyan-600 to-teal-600",
    transcriptSample: [
      { speaker: "Interviewer", text: "Explain your framework architecture for cross-browser testing across mobile and desktop.", time: "00:30" },
      { speaker: "Candidate", text: "We use a modular Page Object Model with TypeScript, parallel worker sharding in Docker containers, and Allure reporting.", time: "01:15" }
    ]
  }
];

interface CallSessionsViewProps {
  sessions: SessionCardItem[];
  onStartSession: (session: SessionCardItem) => void;
  onCreateSessionClick: () => void;
  onViewTranscript: (session: SessionCardItem) => void;
  onDeleteSession: (id: string) => void;
  candidateProfile: CandidateProfile | null;
}

export const CallSessionsView: React.FC<CallSessionsViewProps> = ({
  sessions,
  onStartSession,
  onCreateSessionClick,
  onViewTranscript,
  onDeleteSession,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "ended">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "active" ? s.status === "ready" || s.status === "in_progress" :
      s.status === "ended";

    const matchesSearch = 
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const renderCompanyIcon = (logoType?: string) => {
    if (logoType === "hexaware") {
      return (
        <div className="w-5 h-5 rounded-md bg-[#1044A5] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm">
          ⬡
        </div>
      );
    }
    if (logoType === "virtusa") {
      return (
        <div className="w-5 h-5 rounded-full bg-[#0085CA] flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-sm">
          ✦
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 bg-[#0d0f12] text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-sans">
            Call Sessions
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-mono">
              <Infinity className="w-3.5 h-3.5" />
              Unlimited Free Access
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Prepare for calls and review past sessions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a
            id="download-source-zip-btn"
            href="/runtime_realtek_source_code.tar.gz"
            download="runtime_realtek_source_code.tar.gz"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            title="Download complete Runtime Realtek source archive"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Project (.tar.gz)</span>
          </a>

          <button
            id="create-session-main-btn"
            onClick={onCreateSessionClick}
            className="px-5 py-2.5 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] active:scale-95 text-white font-bold text-sm shadow-lg shadow-[#10a37f]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Session</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-4 border-b border-white/10 text-sm">
        <div className="flex items-center gap-6">
          {(["all", "active", "ended"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold capitalize transition-colors relative ${
                activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 pb-3 font-medium">
          {filteredSessions.length} {filteredSessions.length === 1 ? "Session" : "Sessions"}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 py-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description"
            className="w-full bg-[#16181e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl bg-[#16181e] border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Sort sessions"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-[#16181e] border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#14161c] hover:bg-[#181a22] border border-[#232731] hover:border-[#353a48] rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-medium mb-2">
                  <span className="uppercase tracking-wider text-[11px]">
                    {session.date}
                  </span>
                  
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === session.id ? null : session.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === session.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-[#1a1d25] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                        <button
                          onClick={() => {
                            onStartSession(session);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/10 flex items-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Start Live Call</span>
                        </button>
                        <button
                          onClick={() => {
                            onViewTranscript(session);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/10 flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Transcript</span>
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button
                          onClick={() => {
                            onDeleteSession(session.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Session</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  {renderCompanyIcon(session.logoType)}
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {session.company}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 font-medium mb-3">
                  {session.role}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#20242e] text-slate-300 text-xs font-medium border border-white/5">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    <span>Interview</span>
                  </span>
                  
                  <button
                    onClick={() => onViewTranscript(session)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#20242e] hover:bg-[#282d3a] text-slate-300 text-xs font-medium border border-white/5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>Transcript</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span className={`w-2 h-2 rounded-full ${
                      session.status === "ended" ? "bg-slate-400" : "bg-emerald-400 animate-pulse"
                    }`} />
                    <span>{session.status === "ended" ? "Completed" : "Ready to Start"}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {session.usageText}
                  </span>
                </div>

                <button
                  onClick={() => onStartSession(session)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Start Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#14161c] hover:bg-[#181a22] border border-[#232731] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-mono text-slate-400 w-28 shrink-0">
                  {session.date}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {renderCompanyIcon(session.logoType)}
                    <span className="font-bold text-sm text-white">{session.company}</span>
                    <span className="text-xs text-slate-400">• {session.role}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{session.usageText}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => onViewTranscript(session)}
                  className="px-3 py-1.5 rounded-lg bg-[#20242e] hover:bg-[#282d3a] text-slate-300 text-xs font-medium border border-white/5 transition-colors"
                >
                  Transcript
                </button>
                <button
                  onClick={() => onStartSession(session)}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all"
                >
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};