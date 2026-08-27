import React, { useState } from "react";
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  User, 
  Bot, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ChevronDown,
  ArrowDownToLine,
  FileJson,
  MessageSquare
} from "lucide-react";
import { SessionCardItem, TranscriptEntry } from "../types";

interface TranscriptModalProps {
  session: SessionCardItem | null;
  onClose: () => void;
  onStartCall: (session: SessionCardItem) => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  session,
  onClose,
  onStartCall,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "interviewer" | "candidate">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!session) return null;

  const defaultTranscripts: TranscriptEntry[] = [
    {
      id: "tr-1",
      speaker: "Interviewer",
      text: `Welcome to the interview for the ${session.role} position at ${session.company}. Could you give us a brief introduction of your background?`,
      time: "00:05",
      category: "Introduction",
    },
    {
      id: "tr-2",
      speaker: "Candidate",
      text: "Thank you! Over the past several years, I've specialized in full-stack engineering and distributed systems, delivering high-throughput microservices and scalable web architectures.",
      time: "00:35",
      quickPunch: "I specialize in resilient distributed architectures and scalable full-stack platforms.",
      bulletPoints: [
        "Built microservices handling 4M+ daily active users",
        "Decreased p99 database query latency by 42%",
        "Led cross-functional architecture and sprint deliveries"
      ],
      teleprompterScript: "Thank you! Over the past several years, I've specialized in full-stack engineering and distributed systems, delivering high-throughput microservices and scalable web architectures."
    }
  ];

  const transcripts: TranscriptEntry[] = (session.transcriptSample && session.transcriptSample.length > 0)
    ? session.transcriptSample
    : defaultTranscripts;

  const filteredTranscripts = transcripts.filter((t) => {
    const isInterviewer = t.speaker.toLowerCase().includes("interviewer");
    const isCandidate = t.speaker.toLowerCase().includes("candidate") || t.speaker.toLowerCase().includes("you");

    if (activeFilter === "interviewer" && !isInterviewer) return false;
    if (activeFilter === "candidate" && !isCandidate) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = t.text.toLowerCase().includes(q);
      const matchSpeaker = t.speaker.toLowerCase().includes(q);
      const matchScript = t.teleprompterScript?.toLowerCase().includes(q);
      const matchBullets = t.bulletPoints?.some((b) => b.toLowerCase().includes(q));
      return matchText || matchSpeaker || matchScript || matchBullets;
    }

    return true;
  });

  const questionCount = transcripts.filter((t) => t.speaker.toLowerCase().includes("interviewer")).length;
  const answerCount = transcripts.filter((t) => t.speaker.toLowerCase().includes("candidate") || t.speaker.toLowerCase().includes("you")).length;

  const handleCopyFormattedText = () => {
    const formatted = `=====================================================\nINTERVIEW TRANSCRIPT REPORT: ${session.company} - ${session.role}\nDate: ${session.date}\nTotal Dialogue Turns: ${transcripts.length} (Questions: ${questionCount}, Answers: ${answerCount})\n=====================================================\n\n` +
      transcripts
        .map((t, idx) => {
          let str = `[#${idx + 1}] [${t.time}] ${t.speaker.toUpperCase()}:\n${t.text}`;
          if (t.quickPunch) {
            str += `\n→ Spoken Hook: "${t.quickPunch}"`;
          }
          if (t.bulletPoints && t.bulletPoints.length > 0) {
            str += `\n→ Talking Points:\n  • ${t.bulletPoints.join("\n  • ")}`;
          }
          return str;
        })
        .join("\n\n-----------------------------------------------------\n\n");

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const formatted = `=====================================================\nINTERVIEW TRANSCRIPT REPORT: ${session.company} - ${session.role}\nDate: ${session.date}\nTotal Questions: ${questionCount} | Total Answers: ${answerCount}\nRecorded by Runtime Realtek Real-Time Interview Copilot\n=====================================================\n\n` +
      transcripts
        .map((t, idx) => {
          let str = `[#${idx + 1}] [${t.time}] ${t.speaker.toUpperCase()}:\n${t.text}`;
          if (t.quickPunch) {
            str += `\n→ Spoken Hook: "${t.quickPunch}"`;
          }
          if (t.bulletPoints && t.bulletPoints.length > 0) {
            str += `\n→ Key Points:\n  • ${t.bulletPoints.join("\n  • ")}`;
          }
          return str;
        })
        .join("\n\n-----------------------------------------------------\n\n");

    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.company.replace(/\s+/g, "_")}_Interview_Transcript_${session.date.replace(/[\s,]+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadJson = () => {
    const data = {
      company: session.company,
      role: session.role,
      date: session.date,
      totalQuestions: questionCount,
      totalAnswers: answerCount,
      notes: session.notes,
      transcript: transcripts,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.company.replace(/\s+/g, "_")}_transcript.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#111318] border border-[#262c3b] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-sans relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#141720] via-[#161a24] to-[#12141c]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <span>{session.company}</span>
                  <span className="text-xs text-slate-400 font-normal font-mono">• {session.role}</span>
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  Saved Transcript
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                <span>{session.date}</span>
                <span>•</span>
                <span className="text-cyan-300 font-semibold">{questionCount} Questions Asked</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">{answerCount} Answers Given</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#161922] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={handleDownloadTxt}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/10 hover:text-white text-left transition-colors cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download as TXT (.txt)</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/10 hover:text-white text-left transition-colors cursor-pointer"
                  >
                    <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JSON Data</span>
                  </button>
                </div>
              )}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyFormattedText}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copied ? "Copied All!" : "Copy Report"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 border-b border-white/10 bg-[#0e1015] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-[#161922] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "all" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              All Dialogue ({transcripts.length})
            </button>
            <button
              onClick={() => setActiveFilter("interviewer")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "interviewer" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Questions Asked ({questionCount})
            </button>
            <button
              onClick={() => setActiveFilter("candidate")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "candidate" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Answers Given ({answerCount})
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversation keywords..."
              className="w-full bg-[#161922] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Transcript Dialogue Feed */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTranscripts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No dialogue entries match your filter or search.</p>
            </div>
          ) : (
            filteredTranscripts.map((t, idx) => {
              const isInterviewer = t.speaker.toLowerCase().includes("interviewer");

              return (
                <div
                  key={t.id || idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isInterviewer
                      ? "bg-cyan-500/[0.04] border-cyan-500/25 shadow-sm"
                      : "bg-[#141822] border-emerald-500/25 shadow-sm ml-0 sm:ml-4"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isInterviewer 
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {isInterviewer ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      <span className={`text-xs font-extrabold uppercase tracking-wide font-sans ${
                        isInterviewer ? "text-cyan-300" : "text-emerald-300"
                      }`}>
                        {isInterviewer ? "👤 Interviewer Question" : "🟢 Candidate / Teleprompter Answer"}
                      </span>

                      {t.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-mono border border-white/5">
                          {t.category}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.time}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {t.text}
                  </p>

                  {t.quickPunch && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-300 block mb-0.5 font-mono">
                        ⚡ Immediate Opening Hook Used:
                      </span>
                      "{t.quickPunch}"
                    </div>
                  )}

                  {t.bulletPoints && t.bulletPoints.length > 0 && (
                    <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-xs text-slate-300">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-mono">
                        Key Points Delivered:
                      </span>
                      {t.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0e1015] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Complete session history safely stored in local client database</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartCall(session);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resume / Launch Live Call</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};