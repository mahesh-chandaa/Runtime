export type AppMode = 
  | "copilot"
  | "mock"
  | "coding"
  | "knowledge"
  | "cheatsheet"
  | "history";

export type AnswerStyle = "star" | "concise" | "technical" | "bullet";

export interface TranscriptItem {
  id: string;
  speaker: "interviewer" | "candidate" | "system";
  text: string;
  timestamp: string;
}

export interface StarBreakdown {
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
}

export interface CopilotAnswer {
  id: string;
  questionDetected: string;
  category: string;
  quickPunch: string;
  bulletPoints: string[];
  teleprompterScript: string;
  starBreakdown?: StarBreakdown;
  proTip?: string;
  avoidWarning?: string;
  keyMetricsToMention?: string[];
  timestamp: string;
  style: AnswerStyle;
}

export interface CandidateProfile {
  candidateName: string;
  currentRole: string;
  yearsOfExperience: string;
  summary: string;
  topSkills: string[];
  keyProjects: {
    title: string;
    company: string;
    techStack: string[];
    metricsAchieved: string;
    starSituation?: string;
    starResult?: string;
  }[];
  elevatorPitch30s: string;
  elevatorPitch90s: string;
  strongestTopics: string[];
  rawResumeText?: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
}

export interface CodingSolution {
  id: string;
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  problemSummary: string;
  constraints: string[];
  codeSolution: string;
  codeLanguage: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityExplanation?: string;
  speakingPoints: string[];
  edgeCases: string[];
  alternativeApproaches?: string;
  timestamp: string;
  imagePreview?: string;
}

export interface MockQuestion {
  question: string;
  category: string;
  contextRationale: string;
  expectedKeyPoints: string[];
  interviewerTone?: string;
  hintsIfStuck?: string[];
}

export interface MockScorecard {
  overallScore: number;
  verdict: string;
  scores: {
    technicalDepth: number;
    communicationClarity: number;
    starStructure: number;
    confidencePacing: number;
  };
  strengths: string[];
  areasToImprove: string[];
  fillerWordsFeedback: string;
  modelAnswer: string;
  coachingTip: string;
}

export interface MockInterviewSession {
  id: string;
  date: string;
  track: string;
  company: string;
  seniority: string;
  totalQuestions: number;
  completedQuestions: number;
  overallAverageScore: number;
  rounds: {
    questionNumber: number;
    question: MockQuestion;
    candidateAnswer: string;
    scorecard?: MockScorecard;
    durationSeconds: number;
  }[];
}

export interface StarStory {
  theme: string;
  storyTitle: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyKeywords: string[];
}

export interface CheatSheetData {
  stories: StarStory[];
  predictedQuestions: {
    question: string;
    category: string;
    recommendedAnswerOutline: string;
  }[];
  questionsToAskInterviewer: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isGoogleLinked: boolean;
  subscriptionTier: "Free Tier" | "Pro Pass" | "Enterprise VIP";
  creditHoursRemaining: number;
  connectedAt: string;
  lastLoginAt: string;
  syncToCloud: boolean;
  webPortalUrl: string;
}

export interface TranscriptEntry {
  id?: string;
  speaker: "Interviewer" | "Candidate" | "You" | "System" | string;
  text: string;
  time: string;
  category?: string;
  quickPunch?: string;
  bulletPoints?: string[];
  teleprompterScript?: string;
  starBreakdown?: StarBreakdown;
}

export interface SessionCardItem {
  id: string;
  date: string;
  company: string;
  role: string;
  tags: string[];
  status: "ready" | "in_progress" | "ended";
  usageText: string;
  logoType?: "unify" | "hexaware" | "avoke" | "virtusa" | "google" | "meta" | "amazon" | "microsoft" | "default";
  logoBg?: string;
  notes?: string;
  durationMinutes?: number;
  questionsCount?: number;
  endedAt?: string;
  transcriptSample?: TranscriptEntry[];
  selectedResume?: string;
  selectedDocuments?: string[];
  customInstructions?: string;
  description?: string;
}

export interface ManagedSession {
  id: string;
  title: string;
  company: string;
  role: string;
  track: string;
  status: "active" | "completed" | "scheduled" | "draft";
  createdAt: string;
  durationMinutes: number;
  questionsCount: number;
  avgScore?: number;
  device: string;
  notes?: string;
  cloudSynced: boolean;
}