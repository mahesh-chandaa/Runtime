import React, { useState, useEffect, useRef } from "react";
import { CandidateProfile, UserProfile } from "./types";
import { Sidebar, SidebarTab } from "./components/Sidebar";
import { CallSessionsView, SessionCardItem, INITIAL_CALL_SESSIONS } from "./components/CallSessionsView";
import { ResumesView } from "./components/ResumesView";
import { DocumentsView } from "./components/DocumentsView";
import { TutorialsView } from "./components/TutorialsView";
import { SupportChatView } from "./components/SupportChatView";
import { TranscriptModal } from "./components/TranscriptModal";
import { LiveCopilot } from "./components/LiveCopilot";
import { StealthFloatingWidget } from "./components/StealthFloatingWidget";
import { GoogleAuthSessionModal } from "./components/GoogleAuthSessionModal";
import { CreateSessionModal, SessionConfig } from "./components/CreateSessionModal";
import { LiveAudioTranscriber } from "./utils/speech";

const DEFAULT_PROFILE: CandidateProfile = {
  candidateName: "Alex Chen",
  currentRole: "Senior Full Stack & Distributed Systems Engineer",
  yearsOfExperience: "6+ Years",
  summary: "Senior software engineer with deep expertise in scalable microservices, low-latency APIs, event-driven architectures (Kafka, Redis), and high-performance React frontends.",
  topSkills: [
    "TypeScript", "React", "Node.js", "Express", "Distributed Systems",
    "System Design", "Kafka", "PostgreSQL", "Redis", "AWS", "Docker"
  ],
  keyProjects: [
    {
      title: "Real-Time Event Ingestion Engine",
      description: "Designed a distributed event stream consumer using Kafka and Node.js workers, reducing p99 message lag from 450ms to 95ms.",
      technologies: ["Kafka", "TypeScript", "Node.js", "Redis", "Docker"],
      metricsOrImpact: "Handled 120,000 events/sec with 99.99% reliability"
    }
  ],
  elevatorPitch30s: "I'm a Senior Full-Stack Engineer with over 6 years of experience building high-throughput microservices and real-time cloud architectures.",
  elevatorPitch90s: "I specialize in low-latency systems and distributed backend pipelines.",
  strongestTopics: ["System Design", "Microservices", "State Architecture", "Database Indexing"],
  targetRole: "Senior Full Stack Engineer",
  targetCompany: "Unify",
};

const DEFAULT_USER_PROFILE: UserProfile = {
  userId: "usr_rt_01",
  name: "Sidddarth",
  email: "Sidddarthabhi7@gmail.com",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sidddarthabhi7@gmail.com",
  isGoogleLinked: true,
  subscriptionTier: "Free Tier",
  creditHoursRemaining: 99999,
  connectedAt: "Aug 25, 2026",
  lastLoginAt: "Just now",
  syncToCloud: true,
  webPortalUrl: "https://runtimerealtek.ai/session/live-sync",
};

export default function App() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("call_sessions");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [callSessions, setCallSessions] = useState<SessionCardItem[]>(() => {
    try {
      const saved = localStorage.getItem("runtime_realtek_call_sessions");
      return saved ? JSON.parse(saved) : INITIAL_CALL_SESSIONS;
    } catch {
      return INITIAL_CALL_SESSIONS;
    }
  });

  const [activeSessionCard, setActiveSessionCard] = useState<SessionCardItem | null>(null);
  const [transcriptModalSession, setTranscriptModalSession] = useState<SessionCardItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStealthOpen, setIsStealthOpen] = useState(false);
  const [isSessionExpanded, setIsSessionExpanded] = useState(true);

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(() => {
    try {
      const saved = localStorage.getItem("runtime_realtek_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("runtime_realtek_user_profile");
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);

  const transcriberRef = useRef<LiveAudioTranscriber | null>(null);

  const saveCallSessions = (updated: SessionCardItem[]) => {
    setCallSessions(updated);
    try {
      localStorage.setItem("runtime_realtek_call_sessions", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const handleUpdateProfile = (profile: CandidateProfile) => {
    setCandidateProfile(profile);
    try {
      localStorage.setItem("runtime_realtek_profile", JSON.stringify(profile));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    try {
      localStorage.setItem("runtime_realtek_user_profile", JSON.stringify(updatedUser));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const handleStartSession = (session: SessionCardItem) => {
    setActiveSessionCard(session);
    if (candidateProfile) {
      handleUpdateProfile({
        ...candidateProfile,
        targetCompany: session.company,
        targetRole: session.role,
      });
    }
    setSidebarTab("copilot_live");
    setIsSessionExpanded(true);
  };

  const handleCreateNewSessionFromConfig = (config: SessionConfig) => {
    const newSession: SessionCardItem = {
      id: `cs-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      company: config.company,
      role: config.role,
      tags: ["Interview", "Transcript"],
      status: "ready",
      usageText: "No usage yet",
      logoType: "default",
      logoBg: "from-blue-600 to-indigo-600",
    };

    const updated = [newSession, ...callSessions];
    saveCallSessions(updated);
    handleStartSession(newSession);
  };

  const handleDeleteSession = (id: string) => {
    const updated = callSessions.filter((s) => s.id !== id);
    saveCallSessions(updated);
    if (activeSessionCard?.id === id) {
      setActiveSessionCard(null);
    }
  };

  const handleToggleListening = async () => {
    if (isListening) {
      if (transcriberRef.current) {
        transcriberRef.current.stop();
      }
      setIsListening(false);
      setAudioLevel(0);
    } else {
      try {
        if (!transcriberRef.current) {
          transcriberRef.current = new LiveAudioTranscriber(
            (transcript, isFinal) => {
              setLiveTranscript(transcript);
            },
            (level) => {
              setAudioLevel(level);
            },
            (error) => {
              console.error("Transcription error:", error);
            }
          );
        }
        await transcriberRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Audio error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 flex flex-row selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden font-sans">
      <Sidebar
        currentTab={sidebarTab}
        onSelectTab={(tab) => setSidebarTab(tab)}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLaunchStealthHUD={() => setIsStealthOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        runningSessionCompany={activeSessionCard?.company || null}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#0d0f12] relative overflow-y-auto min-h-screen">
        {sidebarTab === "call_sessions" && (
          <CallSessionsView
            sessions={callSessions}
            onStartSession={handleStartSession}
            onCreateSessionClick={() => setIsCreateModalOpen(true)}
            onViewTranscript={(s) => setTranscriptModalSession(s)}
            onDeleteSession={handleDeleteSession}
            candidateProfile={candidateProfile}
          />
        )}

        {sidebarTab === "cvs_resumes" && (
          <ResumesView
            candidateProfile={candidateProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {sidebarTab === "documents" && <DocumentsView />}
        {sidebarTab === "tutorials" && <TutorialsView />}
        {sidebarTab === "support_chat" && <SupportChatView />}

        {sidebarTab === "copilot_live" && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <button
                onClick={() => setSidebarTab("call_sessions")}
                className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>← Back to Call Sessions</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {activeSessionCard?.company || "Live Session"} ({activeSessionCard?.role || "Software Engineer"})
              </span>
            </div>

            <LiveCopilot
              candidateProfile={candidateProfile}
              isListening={isListening}
              onToggleListening={handleToggleListening}
              liveTranscript={liveTranscript}
              audioLevel={audioLevel}
              onOpenStealth={() => setIsStealthOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              isSessionExpanded={isSessionExpanded}
              onToggleExpandSession={() => setIsSessionExpanded(!isSessionExpanded)}
            />
          </div>
        )}
      </div>

      <TranscriptModal
        session={transcriptModalSession}
        onClose={() => setTranscriptModalSession(null)}
        onStartCall={handleStartSession}
      />

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStartSession={handleCreateNewSessionFromConfig}
        candidateProfile={candidateProfile}
      />

      <StealthFloatingWidget
        isOpen={isStealthOpen}
        onClose={() => setIsStealthOpen(false)}
        liveTranscript={liveTranscript}
        isListening={isListening}
        onToggleListening={handleToggleListening}
      />

      <GoogleAuthSessionModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        profile={userProfile}
        onUpdateProfile={handleUpdateUserProfile}
        sessions={callSessions.map((c) => ({
          id: c.id,
          title: `${c.company} - ${c.role}`,
          company: c.company,
          role: c.role,
          track: "Technical & STAR",
          status: c.status === "ended" ? "completed" : "active",
          createdAt: c.date,
          durationMinutes: 45,
          questionsCount: 8,
          device: "Web Desktop",
          cloudSynced: true,
        }))}
        onAddSession={(sess) => {
          const newCard: SessionCardItem = {
            id: sess.id,
            date: "TODAY",
            company: sess.company,
            role: sess.role,
            tags: ["Interview", "Transcript"],
            status: "ready",
            usageText: "No usage yet",
          };
          saveCallSessions([newCard, ...callSessions]);
        }}
        onDeleteSession={handleDeleteSession}
        onSelectSession={(sess) => {
          const matched = callSessions.find((c) => c.id === sess.id);
          if (matched) {
            handleStartSession(matched);
          }
        }}
      />
    </div>
  );
}