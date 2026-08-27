import React, { useState } from "react";
import { 
  FileText, 
  Briefcase, 
  Video, 
  MessageSquareQuote, 
  Sun, 
  Monitor, 
  LogOut, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeft,
  Infinity,
  Check
} from "lucide-react";
import { UserProfile } from "../types";

export type SidebarTab = 
  | "call_sessions" 
  | "cvs_resumes" 
  | "documents" 
  | "tutorials" 
  | "support_chat" 
  | "copilot_live";

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  userProfile: UserProfile;
  onOpenAuthModal?: () => void;
  onLaunchStealthHUD?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  runningSessionCompany?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  onOpenAuthModal,
  onLaunchStealthHUD,
  isCollapsed = false,
  onToggleCollapse,
  runningSessionCompany,
}) => {
  const [themeOption, setThemeOption] = useState<"Auto" | "Dark" | "Light">("Auto");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <aside 
      className={`bg-[#101216] border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-20 shrink-0 select-none ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div 
            onClick={() => onSelectTab("call_sessions")}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Runtime Realtek Workspace"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xs font-black tracking-tighter">RT</span>
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight font-sans">
                  Runtime
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Realtek
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Live Running Call Notification */}
        {runningSessionCompany && !isCollapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-cyan-300">Live Call Active</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[110px]">{runningSessionCompany}</span>
              </div>
            </div>
            <button
              onClick={() => onSelectTab("copilot_live")}
              className="px-2 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-extrabold transition-all"
            >
              Resume
            </button>
          </div>
        )}

        {/* Workspace Nav Items */}
        <div className="px-3 pt-5">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2 font-mono">
              Workspace
            </div>
          )}

          <nav className="space-y-1">
            <button
              id="sidebar-call-sessions-btn"
              onClick={() => onSelectTab("call_sessions")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "call_sessions"
                  ? "bg-[#1d2027] text-white shadow-sm border border-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title="Call Sessions"
            >
              <div className="flex items-center gap-0.5 w-4 h-4 justify-center">
                <span className="w-0.5 h-3 bg-emerald-400 rounded-full" />
                <span className="w-0.5 h-4 bg-emerald-400 rounded-full" />
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
              </div>
              {!isCollapsed && <span>Call Sessions</span>}
            </button>

            <button
              id="sidebar-resumes-btn"
              onClick={() => onSelectTab("cvs_resumes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "cvs_resumes"
                  ? "bg-[#1d2027] text-white shadow-sm border border-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title="CVs & Resumes"
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>CVs & Resumes</span>}
            </button>

            <button
              id="sidebar-documents-btn"
              onClick={() => onSelectTab("documents")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "documents"
                  ? "bg-[#1d2027] text-white shadow-sm border border-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title="Documents"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>Documents</span>}
            </button>
          </nav>
        </div>

        {/* Support Nav Items */}
        <div className="px-3 pt-6">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2 font-mono">
              Support
            </div>
          )}

          <nav className="space-y-1">
            <button
              id="sidebar-tutorials-btn"
              onClick={() => onSelectTab("tutorials")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "tutorials"
                  ? "bg-[#1d2027] text-white shadow-sm border border-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title="Tutorials"
            >
              <Video className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>Tutorials</span>}
            </button>

            <button
              id="sidebar-support-chat-btn"
              onClick={() => onSelectTab("support_chat")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "support_chat"
                  ? "bg-[#1d2027] text-white shadow-sm border border-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title="Support Chat"
            >
              <MessageSquareQuote className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>Support Chat</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Footer & User Profile */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>Theme</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>{themeOption}</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            )}
          </button>

          {isThemeMenuOpen && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#1a1d25] border border-white/10 rounded-xl p-1 shadow-2xl z-30 text-xs">
              {(["Auto", "Dark", "Light"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setThemeOption(opt);
                    setIsThemeMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/10"
                >
                  <span>{opt}</span>
                  {themeOption === opt && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onLaunchStealthHUD}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
        >
          <Monitor className="w-4 h-4 text-slate-400" />
          {!isCollapsed && <span>Open Desktop App</span>}
        </button>

        <button
          onClick={onOpenAuthModal}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          {!isCollapsed && <span>Log Out</span>}
        </button>

        <div 
          onClick={onOpenAuthModal}
          className="pt-2 mt-2 border-t border-white/5 flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
            S
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">
                {userProfile.email.toLowerCase()}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <Infinity className="w-3 h-3" />
                <span>Unlimited Free Plan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};