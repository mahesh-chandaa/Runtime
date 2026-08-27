import React, { useState } from "react";
import { CandidateProfile } from "../types";
import { 
  Sparkles, 
  X, 
  Briefcase, 
  Phone, 
  Info, 
  ChevronDown, 
  FileText, 
  Plus, 
  MessageSquare, 
  Bot, 
  Globe, 
  Check
} from "lucide-react";

export interface SessionConfig {
  sessionType: "interview" | "regular_call";
  company: string;
  role: string;
  description: string;
  selectedResume: string;
  selectedDocuments: string[];
  customInstructions: string;
  answerPreference: string;
  model: string;
  language: string;
  autoAnswer: boolean;
  saveTranscript: boolean;
  stealthMode?: "pip_window" | "ghost_overlay" | "in_app";
  audioSource?: "dual_loopback" | "mic_only";
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: any) => void;
  candidateProfile?: CandidateProfile | null;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  candidateProfile,
}) => {
  const [sessionType, setSessionType] = useState<"interview" | "regular_call">("interview");
  const [company, setCompany] = useState(candidateProfile?.targetCompany || "");
  const [description, setDescription] = useState(
    "Software Engineer versed in Python, SQL, and AWS with deep microservices background..."
  );
  const [role, setRole] = useState(candidateProfile?.targetRole || "Software Engineer");

  // Context Selectors
  const [selectedResume, setSelectedResume] = useState("Sangisetti_Dhanush_resume.pdf");
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["couchbase.pdf", "Interview Data.pdf"]);
  const [customInstructions, setCustomInstructions] = useState(
    "Always structure technical answers with problem statement, trade-offs, architecture choices, and concrete code/algorithms. Use STAR format for behavioral prompts."
  );

  // Dropdown open states
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showDocsDropdown, setShowDocsDropdown] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAnswerPrefDropdown, setShowAnswerPrefDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Output Settings
  const [answerPreference, setAnswerPreference] = useState("STAR Format & Architecture");
  const [model, setModel] = useState("GPT-5.6 Luna");
  const [language, setLanguage] = useState("English");

  // Behavior
  const [autoAnswer, setAutoAnswer] = useState(true);
  const [saveTranscript, setSaveTranscript] = useState(true);

  // URL extraction state
  const [showUrlImport, setShowUrlImport] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  if (!isOpen) return null;

  const handleUrlFill = () => {
    if (!urlInput.trim()) return;
    if (urlInput.toLowerCase().includes("google")) {
      setCompany("Google");
      setRole("Senior Distributed Systems Engineer");
      setDescription("Lead architect for global scale RPC services, Spanner consistency models, and multi-region Kubernetes clusters.");
    } else if (urlInput.toLowerCase().includes("amazon")) {
      setCompany("Amazon");
      setRole("Principal Solutions Architect");
      setDescription("High availability multi-tier AWS deployments, DynamoDB partition keys, and asynchronous event mesh.");
    } else {
      setCompany("Virtusa");
      setRole("Senior Automation Engineer");
      setDescription("Designing scalable test frameworks with TypeScript, Playwright, CI/CD pipeline integration, and cloud browsers.");
    }
    setShowUrlImport(false);
    setUrlInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      sessionType,
      company: company.trim() || "Unify",
      role: role.trim() || "L1 Support Engineer",
      description,
      selectedResume,
      selectedDocuments: selectedDocs,
      customInstructions,
      answerPreference,
      model,
      language,
      autoAnswer,
      saveTranscript,
      stealthMode: "ghost_overlay",
      audioSource: "dual_loopback"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#14161c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => {
          e.stopPropagation();
          setShowResumeDropdown(false);
          setShowDocsDropdown(false);
          setShowAnswerPrefDropdown(false);
          setShowModelDropdown(false);
          setShowLangDropdown(false);
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Create Session
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          
          {/* Section: Session Type */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2.5">
              Session Type
              <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-help" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSessionType("interview")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-xs transition-all cursor-pointer ${
                  sessionType === "interview"
                    ? "bg-[#182321] border-emerald-500 text-white shadow-sm"
                    : "bg-[#1c1f28] border-white/10 text-slate-400 hover:text-white hover:bg-[#232733]"
                }`}
              >
                <Briefcase className={`w-4 h-4 ${sessionType === "interview" ? "text-emerald-400" : "text-slate-400"}`} />
                <span>Interview</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType("regular_call")}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-xs transition-all cursor-pointer ${
                  sessionType === "regular_call"
                    ? "bg-[#182321] border-emerald-500 text-white shadow-sm"
                    : "bg-[#1c1f28] border-white/10 text-slate-400 hover:text-white hover:bg-[#232733]"
                }`}
              >
                <Phone className={`w-4 h-4 ${sessionType === "regular_call" ? "text-emerald-400" : "text-slate-400"}`} />
                <span>Regular Call</span>
              </button>
            </div>
          </div>

          {/* Section: Company with URL autofill */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                Company
                <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
              </label>

              <button
                type="button"
                onClick={() => setShowUrlImport(!showUrlImport)}
                className="text-emerald-400 hover:text-emerald-300 font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill fields from Interview Post URL →</span>
              </button>
            </div>

            {showUrlImport && (
              <div className="mb-3 p-3 bg-[#1a1e28] border border-emerald-500/30 rounded-xl flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://linkedin.com/jobs/view/... or greenhouse url"
                  className="flex-1 bg-[#12141a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleUrlFill}
                  className="px-3 py-1.5 rounded-lg bg-[#10a37f] hover:bg-[#0e8e6e] text-white font-bold text-xs cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme..."
              className="w-full bg-[#1c1f28] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-medium"
            />
          </div>

          {/* Section: Interview Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              Interview Description
              <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Software Engineer versed in Python, SQL, and AWS..."
              className="w-full bg-[#1c1f28] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-sans"
            />
          </div>

          {/* Section: Context (Pill Buttons) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Context
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Resume Selector Pill */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[140px] truncate">{selectedResume}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showResumeDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-[#181b24] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                    {[
                      "Sangisetti_Dhanush_resume.pdf",
                      "Gowtham_Pentela.pdf",
                      "Mahesh_Chanda_Senior_Couchbase.pdf",
                      "Dhanush_Network_Engineer_Vodafone.pdf",
                      "JawaharBabu_Resume.pdf"
                    ].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => {
                          setSelectedResume(res);
                          setShowResumeDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white flex items-center justify-between"
                      >
                        <span className="truncate">{res}</span>
                        {selectedResume === res && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents Multi Selector Pill */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowDocsDropdown(!showDocsDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {selectedDocs.length > 0 ? `+ ${selectedDocs.length} Documents` : "+ Documents"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showDocsDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-[#181b24] border border-white/10 rounded-xl shadow-2xl p-2 z-30 text-xs space-y-1">
                    {[
                      "couchbase.pdf",
                      "Interview Data.pdf",
                      "Introduction infosys.docx",
                      "IBM Architecture Notes",
                      "tech marine telemetry"
                    ].map((doc) => {
                      const isSelected = selectedDocs.includes(doc);
                      return (
                        <button
                          key={doc}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedDocs(selectedDocs.filter((d) => d !== doc));
                            } else {
                              setSelectedDocs([...selectedDocs, doc]);
                            }
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                            isSelected ? "bg-emerald-500/20 text-emerald-300" : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          <span className="truncate">{doc}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Instructions Pill */}
              <button
                type="button"
                onClick={() => setShowInstructionsModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Instructions ({customInstructions.length} chars)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Section: Output Settings */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Output Settings
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Answer Preferences */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowAnswerPrefDropdown(!showAnswerPrefDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Answer Preferences</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showAnswerPrefDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-[#181b24] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                    {[
                      "STAR Format & Architecture",
                      "Concise Bullet Points",
                      "Deep Technical Explanations",
                      "System Design Focus",
                      "Coding Walkthroughs"
                    ].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => {
                          setAnswerPreference(pref);
                          setShowAnswerPrefDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 flex items-center justify-between cursor-pointer"
                      >
                        <span>{pref}</span>
                        {answerPreference === pref && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Pill */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>{model}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showModelDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#181b24] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                    {[
                      "GPT-5.6 Luna",
                      "Gemini 2.5 Flash",
                      "Realtek Neural 4.0",
                      "Claude 3.7 Sonnet"
                    ].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setModel(m);
                          setShowModelDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 flex items-center justify-between cursor-pointer"
                      >
                        <span>{m}</span>
                        {model === m && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Pill */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#232733] border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showLangDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-[#181b24] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                    {["English", "Spanish", "German", "French", "Japanese"].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setLanguage(l);
                          setShowLangDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 flex items-center justify-between cursor-pointer"
                      >
                        <span>{l}</span>
                        {language === l && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Behavior */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Behavior
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAnswer}
                  onChange={(e) => setAutoAnswer(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1c1f28] border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  Auto Answer (Beta)
                  <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveTranscript}
                  onChange={(e) => setSaveTranscript(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1c1f28] border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  Save Transcript
                  <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                </span>
              </label>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-[#10a37f]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Session</span>
            </button>
          </div>
        </form>

        {/* Modal for Custom Instructions */}
        {showInstructionsModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14161c] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Custom Copilot Instructions
                </h3>
                <button onClick={() => setShowInstructionsModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={7}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Specific instructions for how the AI copilot should answer questions..."
                className="w-full bg-[#1c1f28] border border-white/10 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-emerald-500/50"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInstructionsModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] text-white font-bold text-xs cursor-pointer"
                >
                  Save Instructions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};