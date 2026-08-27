import React, { useState, useEffect, useRef } from "react";
import { CopilotAnswer, CandidateProfile } from "../types";
import { generateCopilotAnswer, analyzeScreenCapture } from "../services/api";
import { 
  EyeOff, 
  X, 
  Mic, 
  MicOff, 
  Zap, 
  Layers, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Sparkles,
  Flame,
  Key,
  Copy,
  Check,
  ShieldCheck,
  Camera,
  Code2,
  Lock,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  Volume2,
  FileCode,
  Laptop
} from "lucide-react";

interface StealthFloatingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  candidateProfile: CandidateProfile | null;
  liveTranscript: string;
  isListening: boolean;
  onToggleListening: () => void;
  onOpenDesktopInstallModal?: () => void;
}

export const StealthFloatingWidget: React.FC<StealthFloatingWidgetProps> = ({
  isOpen,
  onClose,
  candidateProfile,
  liveTranscript,
  isListening,
  onToggleListening,
  onOpenDesktopInstallModal,
}) => {
  const [opacity, setOpacity] = useState(90);
  const [isMinimized, setIsMinimized] = useState(false); // Small Icon Hide Mode
  const [position, setPosition] = useState<"top-right" | "bottom-right" | "top-left" | "top-center">("top-right");
  const [typedInput, setTypedInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<CopilotAnswer | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPanicDisguise, setShowPanicDisguise] = useState(false);
  const [activeTab, setActiveTab] = useState<"teleprompter" | "code" | "settings">("teleprompter");

  // Dragging support for floating widget
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [customCoord, setCustomCoord] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  // Auto answer generation when new transcript arrives
  useEffect(() => {
    if (liveTranscript && liveTranscript.length > 25 && !isLoading && !activeAnswer) {
      const timer = setTimeout(() => {
        handleQuickAnswer(liveTranscript);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [liveTranscript]);

  const handleQuickAnswer = async (q?: string) => {
    const question = q || typedInput || liveTranscript;
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const resumeContext = candidateProfile
        ? `Candidate Name: ${candidateProfile.candidateName}\nSkills: ${candidateProfile.topSkills.join(", ")}\nProjects: ${candidateProfile.keyProjects.map(p => p.title).join(", ")}`
        : undefined;

      const result = await generateCopilotAnswer({
        question,
        resumeContext,
        jobDescription: candidateProfile?.jobDescription,
        role: candidateProfile?.targetRole || "Software Engineer",
        company: candidateProfile?.targetCompany || "Tech Company",
        answerStyle: "bullet",
      });

      setActiveAnswer({
        ...result,
        id: "stealth-" + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        style: "bullet",
      });
    } catch (err) {
      console.error("Stealth answer error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Panic disguise: Realtek Audio Driver properties camouflage
  if (showPanicDisguise) {
    return (
      <div 
        className="fixed top-8 right-8 z-50 w-80 bg-[#1e222b] border border-[#3b4252] rounded-xl shadow-2xl p-4 text-xs text-slate-300 font-sans select-none"
        onDoubleClick={() => setShowPanicDisguise(false)}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-white text-xs">Realtek High Definition Audio Properties</span>
          </div>
          <button 
            onClick={() => setShowPanicDisguise(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Driver Provider:</span>
            <span className="text-white">Realtek Semiconductor</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Driver Date:</span>
            <span className="text-white">8/26/2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Driver Version:</span>
            <span className="text-white">6.0.9234.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Device Status:</span>
            <span className="text-emerald-400">This device is working properly.</span>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-white/10 flex justify-end">
          <button 
            onClick={() => setShowPanicDisguise(false)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-200 text-[10px]"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // 1. SMALL ICON HIDE MODE (Click to expand)
  if (isMinimized) {
    return (
      <div
        id="stealth-mini-hide-icon"
        onClick={() => setIsMinimized(false)}
        className="fixed top-6 right-6 z-50 group cursor-pointer animate-in fade-in zoom-in-95 duration-200"
        title="Click to expand Runtime Realtek AI Teleprompter (Undetected)"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0e1117]/90 hover:bg-[#141822] border border-emerald-500/50 shadow-2xl backdrop-blur-xl transition-all group-hover:scale-105 group-hover:border-emerald-400">
          
          {/* Pulsing Audio/Stealth Wave */}
          <div className="flex items-center gap-0.5 h-3.5">
            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="w-1 h-3.5 bg-cyan-400 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 font-sans flex items-center gap-1">
              RT Stealth
            </span>
            <span className="text-[8px] text-slate-400 font-mono">
              {isListening ? "Mic On • Hidden" : "Hidden (Click)"}
            </span>
          </div>

          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </div>
      </div>
    );
  }

  const positionClasses = {
    "top-right": "top-6 right-6",
    "bottom-right": "bottom-6 right-6",
    "top-left": "top-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
  };

  // 2. EXPANDED STEALTH AI TELEPROMPTER HUD
  return (
    <div
      id="stealth-ghost-overlay"
      className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-3xl border border-emerald-500/40 backdrop-blur-2xl w-96 max-w-[92vw] ${
        positionClasses[position]
      }`}
      style={{
        backgroundColor: `rgba(10, 14, 22, ${Math.max(0.35, opacity / 100)})`,
      }}
    >
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between cursor-move select-none bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent rounded-t-3xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 font-sans">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            Runtime Realtek Ghost HUD
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
            {opacity}%
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          {/* Small Icon Hide Mode button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:text-emerald-400 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1 text-[10px] cursor-pointer"
            title="Switch to Small Icon Hide Mode (See your screen)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="text-[9px] hidden sm:inline">Hide Mode</span>
          </button>

          {/* Panic disguise button */}
          <button
            onClick={() => setShowPanicDisguise(true)}
            className="p-1 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            title="Instant Panic Camouflage"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            title="Close Ghost Overlay"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen Sharing Invisibility Status Banner */}
      <div className="px-3.5 py-1.5 bg-cyan-500/10 border-b border-white/5 flex items-center justify-between text-[10px] text-cyan-300 font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Anti-Capture Active: Zoom • Teams • Webex</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 shrink-0">
          Undetected
        </span>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3 text-xs text-white">
        
        {/* Opacity & Position Controls Bar */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span>Glass Opacity:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-20 accent-emerald-400 h-1 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1">
            {(["top-left", "top-center", "top-right", "bottom-right"] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono transition-all cursor-pointer ${
                  position === pos 
                    ? "bg-emerald-500 text-slate-950 font-bold" 
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {pos === "top-left" ? "TL" : pos === "top-center" ? "TC" : pos === "top-right" ? "TR" : "BR"}
              </button>
            ))}
          </div>
        </div>

        {/* Live Question / Prompt Input Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleListening}
            className={`p-2 rounded-xl border flex-shrink-0 transition-all cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
            title="Toggle Live Audio Transcription"
          >
            {isListening ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
          </button>

          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuickAnswer();
            }}
            placeholder={liveTranscript ? `Detected: "${liveTranscript.slice(0, 28)}..."` : "Ask question or speak into mic..."}
            className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />

          <button
            onClick={() => handleQuickAnswer()}
            disabled={isLoading || (!typedInput && !liveTranscript)}
            className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold disabled:opacity-50 hover:from-emerald-600 hover:to-cyan-600 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            title="Generate Instant AI Answer"
          >
            {isLoading ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>

        {/* Live Answer Section */}
        {activeAnswer ? (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            
            {/* Quick Opening Hook */}
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-200 text-[11px] leading-snug">
              <span className="font-extrabold text-emerald-300 block text-[9px] uppercase tracking-wider mb-0.5 font-mono">
                1. Immediate Opening Hook:
              </span>
              "{activeAnswer.quickPunch}"
            </div>

            {/* Glance Bullet Points */}
            <div className="space-y-1.5 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1 font-mono">
                2. Key Talking Points:
              </span>
              {activeAnswer.bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-200">
                  <span className="text-cyan-400 font-bold">•</span>
                  <p className="leading-snug">{bp}</p>
                </div>
              ))}
            </div>

            {/* Full Spoken Script */}
            {activeAnswer.teleprompterScript && (
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1 font-mono">
                  3. Full Teleprompter Script:
                </span>
                {activeAnswer.teleprompterScript}
              </div>
            )}

            {/* Actions: Copy & Minimize */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeAnswer.teleprompterScript || activeAnswer.quickPunch);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied Script!" : "Copy Answer"}</span>
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition-all cursor-pointer"
              >
                Hide Mode
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-[11px] space-y-2">
            <p>Ready for question. Speak or type above to generate real-time teleprompter answers.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 transition-colors cursor-pointer"
              >
                Switch to Small Icon Hide Mode
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};