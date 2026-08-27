import React, { useState } from "react";
import { 
  Monitor, 
  Download, 
  ShieldCheck, 
  EyeOff, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  X, 
  Lock, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  ExternalLink,
  Laptop,
  Flame,
  Radio
} from "lucide-react";

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLiveStealthHUD: () => void;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  onLaunchLiveStealthHUD,
}) => {
  const [selectedOS, setSelectedOS] = useState<"windows" | "mac" | "linux">("windows");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTestScreenSharingActive, setIsTestScreenSharingActive] = useState(false);
  const [simulatedPlatform, setSimulatedPlatform] = useState<"zoom" | "teams" | "webex" | "meet">("zoom");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <div 
        className="bg-[#111318] border border-[#232834] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#141720] via-[#161a24] to-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Monitor className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Runtime Realtek Desktop Client
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  v2.4.0 Stealth
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Native invisible overlay for Zoom, Microsoft Teams, Webex, and Google Meet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* 1. OS Tabs & Primary Download Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Select Your Operating System
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Anti-Detection Verified
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Windows Tab */}
              <button
                onClick={() => setSelectedOS("windows")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedOS === "windows"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10"
                    : "bg-[#161820] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  ⊞
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Windows</div>
                  <div className="text-[10px] text-slate-400">10 / 11 (64-bit)</div>
                </div>
              </button>

              {/* macOS Tab */}
              <button
                onClick={() => setSelectedOS("mac")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedOS === "mac"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10"
                    : "bg-[#161820] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-500/20 text-slate-200 flex items-center justify-center font-bold">
                  
                </div>
                <div>
                  <div className="font-bold text-xs text-white">macOS</div>
                  <div className="text-[10px] text-slate-400">Apple Silicon / Intel</div>
                </div>
              </button>

              {/* Linux Tab */}
              <button
                onClick={() => setSelectedOS("linux")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedOS === "linux"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10"
                    : "bg-[#161820] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  🐧
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Linux</div>
                  <div className="text-[10px] text-slate-400">.AppImage / .deb</div>
                </div>
              </button>
            </div>
          </div>

          {/* Download & Installation Action Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161922] to-[#12141a] border border-[#262c3b] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  {selectedOS === "windows" && "Runtime Realtek for Windows (.exe / .msi)"}
                  {selectedOS === "mac" && "Runtime Realtek for macOS Universal (.dmg)"}
                  {selectedOS === "linux" && "Runtime Realtek for Linux (.AppImage)"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                  Build 2026.8.26
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-lg">
                Includes real-time speech recognizer, Small Icon Hide Mode, hardware accelerated ghost HUD, and direct Task Manager disguise (`realtek_hd_audio.exe`).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onLaunchLiveStealthHUD();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Launch Web HUD Now</span>
              </button>

              <a
                href="/runtime_realtek_source_code.tar.gz"
                download="RuntimeRealtek_Setup_v2.4.tar.gz"
                className="px-5 py-2.5 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-[#10a37f]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Desktop Installer</span>
              </a>
            </div>
          </div>

          {/* 2. Stealth & Screen Share Invisibility Architecture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Screen-Sharing Invisibility Engine (Zero-Capture Technology)
                </h3>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">
                100% Invisible to Attendees
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Feature 1: Window Capture Exclusion */}
              <div className="p-4 rounded-2xl bg-[#151820] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <EyeOff className="w-4 h-4" />
                  <span>Hardware Bypass</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Uses native OS <code className="text-cyan-300 bg-white/5 px-1 py-0.5 rounded font-mono">SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)</code> on Windows and Quartz Window Level filtering on macOS.
                </p>
              </div>

              {/* Feature 2: Task Manager Camouflage */}
              <div className="p-4 rounded-2xl bg-[#151820] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>Task Manager Disguise</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The process appears as <code className="text-cyan-300 bg-white/5 px-1 py-0.5 rounded font-mono">realtek_hd_audio.exe</code> ("Realtek High Definition Audio Engine"), drawing standard background driver power.
                </p>
              </div>

              {/* Feature 3: Small Icon Hide Mode */}
              <div className="p-4 rounded-2xl bg-[#151820] border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Small Icon Hide Mode</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Minimizes into a discrete micro-pill or stealth audio badge. A single click or pressing <kbd className="bg-white/10 px-1 py-0.5 rounded text-[10px] text-white">Alt + Space</kbd> instantly unfolds the answer HUD.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Interactive Screen-Sharing Simulator */}
          <div className="p-4 rounded-2xl bg-[#0f1116] border border-cyan-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Live Screen Share Anti-Capture Simulator
                </span>
                <p className="text-[11px] text-slate-400">
                  Verify how your screen looks to interviewers on meeting software vs what only you see.
                </p>
              </div>

              {/* Platform Selector */}
              <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1">
                {(["zoom", "teams", "webex", "meet"] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setSimulatedPlatform(plat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      simulatedPlatform === plat
                        ? "bg-cyan-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen Simulation Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Left: What Candidate Sees (With Ghost Teleprompter) */}
              <div className="p-3.5 rounded-xl bg-[#161a24] border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 mb-2 font-mono">
                  <span>✓ YOUR SCREEN (CANDIDATE VIEW)</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Visible to You</span>
                </div>
                
                <div className="bg-[#0b0d12] rounded-lg p-3 border border-white/10 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-white/5">
                    <span>Interview Problem: System Design</span>
                    <span className="text-[9px] text-emerald-400">Teleprompter Active</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-[10px] font-sans">
                    <span className="font-bold text-emerald-300 block mb-0.5">Runtime Realtek Ghost Answer:</span>
                    "We partition the queue using Kafka topic partitions keyed by user ID to guarantee FIFO order..."
                  </div>
                </div>
              </div>

              {/* Right: What Interviewer Sees (Zoom Screen Capture Excluded) */}
              <div className="p-3.5 rounded-xl bg-[#161a24] border border-cyan-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-2 font-mono">
                  <span>🛡️ {simulatedPlatform.toUpperCase()} ATTENDEES VIEW</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Clean Stream</span>
                </div>

                <div className="bg-[#0b0d12] rounded-lg p-3 border border-white/10 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-white/5">
                    <span>Interview Problem: System Design</span>
                    <span className="text-[9px] text-slate-500">Normal Desktop</span>
                  </div>
                  <div className="p-3 rounded bg-white/[0.02] border border-white/5 text-slate-500 text-[10px] italic flex items-center justify-center h-14">
                    [Clean candidate screen, no floating overlay detected]
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Global Keyboard Shortcuts Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Desktop Stealth Hotkeys
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-[#151820] border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400">Expand / Hide HUD</span>
                <span className="text-xs font-bold text-white font-mono mt-1">Alt + Space</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#151820] border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400">Toggle Stealth Mic</span>
                <span className="text-xs font-bold text-emerald-400 font-mono mt-1">Alt + M</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#151820] border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400">Screen Snipping OCR</span>
                <span className="text-xs font-bold text-cyan-400 font-mono mt-1">Alt + C</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#151820] border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400">Panic Camouflage</span>
                <span className="text-xs font-bold text-rose-400 font-mono mt-1">Alt + Q</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-[#0e1015]">
          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Session Stream</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchLiveStealthHUD();
              }}
              className="px-4 py-2 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Open Floating Hide Mode Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};