import { AnswerStyle, CandidateProfile, CodingSolution, CopilotAnswer, MockQuestion, MockScorecard, CheatSheetData } from "../types";

export async function generateCopilotAnswer(params: {
  question: string;
  resumeContext?: string;
  supportDocsContext?: string;
  customInstructions?: string;
  jobDescription?: string;
  answerStyle?: AnswerStyle;
  role?: string;
  company?: string;
  language?: string;
  transcriptHistory?: { speaker: string; text: string }[];
}): Promise<Omit<CopilotAnswer, "id" | "timestamp" | "style">> {
  const res = await fetch("/api/gemini/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to generate answer");
  }
  const result = await res.json();
  return result.data;
}

export async function analyzeScreenSnippet(params: {
  imageBase64: string;
  mimeType?: string;
  contextText?: string;
  language?: string;
}): Promise<CodingSolution> {
  const res = await fetch("/api/gemini/analyze-screen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to analyze screen capture");
  }
  const result = await res.json();
  return {
    ...result.data,
    id: "sol-" + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    imagePreview: params.imageBase64,
  };
}

export async function parseCandidateResume(params: {
  rawText?: string;
  fileBase64?: string;
  mimeType?: string;
}): Promise<CandidateProfile> {
  const res = await fetch("/api/gemini/parse-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to parse resume");
  }
  const result = await res.json();
  return {
    ...result.data,
    rawResumeText: params.rawText,
  };
}

export async function generateMockQuestion(params: {
  track?: string;
  company?: string;
  seniority?: string;
  interviewType?: string;
  questionIndex?: number;
  totalQuestions?: number;
  previousQuestions?: any[];
  resumeContext?: string;
  jobDescription?: string;
}): Promise<MockQuestion> {
  const res = await fetch("/api/gemini/mock/generate-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to generate mock question");
  }
  const result = await res.json();
  return result.data;
}

export async function evaluateMockAnswer(params: {
  question: string;
  candidateAnswer: string;
  category?: string;
  role?: string;
  company?: string;
  seniority?: string;
  resumeContext?: string;
}): Promise<MockScorecard> {
  const res = await fetch("/api/gemini/mock/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to evaluate answer");
  }
  const result = await res.json();
  return result.data;
}

export async function generateCheatSheet(params: {
  resumeText?: string;
  targetRole?: string;
  targetCompany?: string;
}): Promise<CheatSheetData> {
  const res = await fetch("/api/gemini/cheatsheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to generate cheat sheet");
  }
  const result = await res.json();
  return result.data;
}