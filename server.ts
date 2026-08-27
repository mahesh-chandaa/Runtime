import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Set process title for OS task managers
if (typeof process !== "undefined" && process.title) {
  process.title = "Runtime Realtek";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. Using empty key, calls will fail if not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Real-time Live Interview Answer Generation (Runtime Realtek Core Engine)
app.post("/api/gemini/answer", async (req, res) => {
  try {
    const {
      question,
      resumeContext,
      supportDocsContext,
      customInstructions,
      jobDescription,
      answerStyle = "star", // 'star' | 'concise' | 'technical' | 'bullet'
      role = "Software Engineer",
      company = "Tech Company",
      language = "en",
      transcriptHistory = [],
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getAI();

    const systemInstruction = `You are Runtime Realtek — the world's most advanced real-time Job Interview Assistant & Teleprompter.
Your job is to listen to the interviewer's live question and instantly provide the candidate with the highest-scoring, articulate, and natural-sounding response.

Candidate Background & Profile:
${resumeContext ? `Resume Context: ${resumeContext}` : "Assume a highly qualified candidate."}

${supportDocsContext ? `=== IMPORTANT SUPPORT DOCUMENTS & PROJECT DETAILS PROVIDED FOR THIS INTERVIEW ===\n${supportDocsContext}\n========================================================================` : ""}

${customInstructions ? `=== CANDIDATE'S CUSTOM INTERVIEW INSTRUCTIONS & PREFERENCES ===\n${customInstructions}\n=============================================================` : ""}

Target Position:
Role: ${role} at ${company}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Interview Conversation History (recent):
${transcriptHistory.slice(-4).map((h: any) => `${h.speaker}: ${h.text}`).join("\n")}

Style requested: ${answerStyle.toUpperCase()}
Language: ${language}

CRITICAL RULES FOR REAL-TIME RESPONSES:
1. Real-time readability: The candidate is looking at your output WHILE SPEAKING on a live video interview.
2. Ground responses strictly in the provided Resume, Support Documents (e.g. your introduction and project details), and Custom Instructions! If the question asks for an introduction ("tell me about yourself"), project breakdown, architecture design, or past experience, pull directly from the support documents and resume.
3. Natural speech phrasing: Provide full conversational sentences that sound genuine, confident, and human (no robotic jargon or memorized-sounding buzzwords).
4. If behavioral: Use the STAR method (Situation, Task, Action, Result) with realistic metrics and specific actions from the support docs/resume.
5. If technical/system design: State the high-level approach first, mention trade-offs, architecture components, data flow, and key constraints.
6. Provide:
   - "quickPunch": A 1-sentence opening hook the candidate can say immediately to buy time and sound composed.
   - "bulletPoints": 3 to 5 rapid scannable bullet points for instant glance.
   - "teleprompterScript": The full spoken script formatted with bold words for emphasis.
   - "proTip": 1 actionable tactic or edge case to mention to stand out as a top 1% candidate.
   - "avoidWarning": 1 common trap or pitfall to strictly avoid mentioning.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Interviewer just asked: "${question}"\n\nGenerate the optimal real-time answer right now.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionDetected: { type: Type.STRING, description: "Cleaned up version of the question" },
            category: { type: Type.STRING, description: "Category like Behavioral, System Design, Coding, Leadership, Culture Fit, Experience" },
            quickPunch: { type: Type.STRING, description: "Immediate 1-sentence opening hook" },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 high impact bullet points",
            },
            teleprompterScript: { type: Type.STRING, description: "Full spoken response formatted for natural reading" },
            starBreakdown: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
            },
            proTip: { type: Type.STRING, description: "Expert insight to mention" },
            avoidWarning: { type: Type.STRING, description: "Trap to avoid" },
            keyMetricsToMention: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Relevant numbers or metrics (e.g., '35% latency reduction', '4M DAU')",
            },
          },
          required: ["questionDetected", "category", "quickPunch", "bulletPoints", "teleprompterScript"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error generating interview answer:", error);
    res.status(500).json({ error: error.message || "Failed to generate answer" });
  }
});

// 3. Screen / OCR / Coding Problem Solver (Multimodal Vision)
app.post("/api/gemini/analyze-screen", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", contextText = "", language = "python" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const ai = getAI();

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const promptText = `You are Runtime Realtek's live coding & screen solver during a technical interview.
Analyze this screenshot from a coding assessment / whiteboard / LeetCode / HackerRank / System Design interview.

Target Programming Language: ${language}
Additional Candidate Context / notes: ${contextText}

Extract and solve:
1. Problem Title & Statement: Accurately read the problem, input/output formats, constraints, and examples.
2. Optimal Solution: Provide the most optimal, production-ready, clean code in ${language} with clean comments and edge-case handling.
3. Complexity Analysis: Exact Time Complexity and Space Complexity with Big-O notation and clear mathematical justification.
4. Spoken Walkthrough Guide: 4-5 step-by-step speaking points so the candidate can smoothly explain their thought process out loud to the interviewer while typing.
5. Edge Cases to Mention: 3 subtle edge cases (e.g. empty arrays, negative numbers, overflow, cycle detection).
6. Alternative Approaches: 1 brute force or sub-optimal approach and why your chosen solution is better.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemTitle: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: "Easy, Medium, Hard" },
            problemSummary: { type: Type.STRING },
            constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
            codeSolution: { type: Type.STRING, description: "Clean code snippet" },
            codeLanguage: { type: Type.STRING },
            timeComplexity: { type: Type.STRING },
            spaceComplexity: { type: Type.STRING },
            complexityExplanation: { type: Type.STRING },
            speakingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "What to say to the interviewer while writing this code",
            },
            edgeCases: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternativeApproaches: { type: Type.STRING },
          },
          required: ["problemTitle", "problemSummary", "codeSolution", "timeComplexity", "spaceComplexity", "speakingPoints"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error analyzing screen:", error);
    res.status(500).json({ error: error.message || "Failed to analyze screen capture" });
  }
});

// 4. Resume & Job Description Parser & Knowledge Grounding
app.post("/api/gemini/parse-resume", async (req, res) => {
  try {
    const { rawText, fileBase64, mimeType = "application/pdf" } = req.body;

    const ai = getAI();

    let parts: any[] = [];
    if (fileBase64) {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
      parts.push({
        text: "Extract and structure all details from this resume document into a comprehensive candidate profile for interview grounding.",
      });
    } else if (rawText) {
      parts.push({
        text: `Extract and structure the following candidate resume text for interview copilot grounding:\n\n${rawText}`,
      });
    } else {
      return res.status(400).json({ error: "Either rawText or fileBase64 is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING },
            currentRole: { type: Type.STRING },
            yearsOfExperience: { type: Type.STRING },
            summary: { type: Type.STRING },
            topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  metricsAchieved: { type: Type.STRING },
                  starSituation: { type: Type.STRING },
                  starResult: { type: Type.STRING },
                },
                required: ["title", "metricsAchieved"],
              },
            },
            elevatorPitch30s: { type: Type.STRING, description: "30-second crisp self introduction" },
            elevatorPitch90s: { type: Type.STRING, description: "Comprehensive 90-second 'Tell me about yourself'" },
            strongestTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["candidateName", "topSkills", "keyProjects", "elevatorPitch30s"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error parsing resume:", error);
    res.status(500).json({ error: error.message || "Failed to parse resume" });
  }
});

// 5. Mock Interview: Generate Question
app.post("/api/gemini/mock/generate-question", async (req, res) => {
  try {
    const {
      track = "Fullstack Software Engineering",
      company = "General Tech",
      seniority = "Senior",
      interviewType = "Behavioral & Technical Mixed",
      questionIndex = 1,
      totalQuestions = 5,
      previousQuestions = [],
      resumeContext = "",
      jobDescription = "",
    } = req.body;

    const ai = getAI();

    const prompt = `You are a Lead Hiring Manager & Principal Interviewer conducting an official ${seniority} ${track} interview at ${company}.
Current Question: ${questionIndex} of ${totalQuestions}.
Interview Format: ${interviewType}.

Candidate Background:
${resumeContext || "Senior Engineer with modern fullstack, distributed systems, and team leadership experience."}

Job Description / Role Requirements:
${jobDescription || `Senior ${track} at ${company}`}

Previous Questions Asked in this session:
${previousQuestions.map((q: any, i: number) => `${i + 1}. [${q.category}] ${q.question}`).join("\n") || "None yet."}

Generate the next realistic, challenging, and high-signal interview question appropriate for question #${questionIndex}.
Make it authentic to ${company}'s actual interview style.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            category: { type: Type.STRING, description: "e.g. System Design, Coding, Behavioral/STAR, Architecture, Culture" },
            contextRationale: { type: Type.STRING, description: "Why the interviewer is asking this question" },
            expectedKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What a top candidate should cover" },
            interviewerTone: { type: Type.STRING, description: "Curious, inquisitive, analytical, conversational" },
            hintsIfStuck: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["question", "category", "contextRationale", "expectedKeyPoints"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error generating mock question:", error);
    res.status(500).json({ error: error.message || "Failed to generate question" });
  }
});

// 6. Mock Interview: Evaluate Candidate Answer & Detailed Scorecard
app.post("/api/gemini/mock/evaluate", async (req, res) => {
  try {
    const {
      question,
      candidateAnswer,
      category = "Technical",
      role = "Software Engineer",
      company = "Tech",
      seniority = "Senior",
      resumeContext = "",
    } = req.body;

    if (!candidateAnswer || !candidateAnswer.trim()) {
      return res.status(400).json({ error: "Candidate answer is required" });
    }

    const ai = getAI();

    const prompt = `You are an elite Tech Interview Bar Raiser evaluating a candidate's verbal response for a ${seniority} ${role} role at ${company}.

Question Asked: "${question}"
Category: ${category}
Candidate's Spoken Answer:
"${candidateAnswer}"

${resumeContext ? `Candidate Resume Context: ${resumeContext}` : ""}

Evaluate rigorously yet constructively with realistic FAANG / Top-Tier hiring bar standards. Provide:
1. Overall Score (0-100)
2. Score breakdown:
   - Technical Depth & Accuracy (0-100)
   - Communication Clarity & Structure (0-100)
   - STAR & Concrete Impact (0-100)
   - Confidence & Delivery (0-100)
3. Verdict: 'Strong Hire', 'Hire', 'Lean Hire', 'Lean No Hire', or 'No Hire'
4. Strengths: 3 specific positive aspects
5. Areas to Improve: 3 high-leverage tweaks
6. Filler Words / Hesitation analysis: identify any filler phrases or rambling
7. Gold Standard Model Answer: The perfect ~90-second response the candidate should study and emulate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                technicalDepth: { type: Type.INTEGER },
                communicationClarity: { type: Type.INTEGER },
                starStructure: { type: Type.INTEGER },
                confidencePacing: { type: Type.INTEGER },
              },
              required: ["technicalDepth", "communicationClarity", "starStructure", "confidencePacing"],
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
            fillerWordsFeedback: { type: Type.STRING },
            modelAnswer: { type: Type.STRING },
            coachingTip: { type: Type.STRING },
          },
          required: ["overallScore", "verdict", "scores", "strengths", "areasToImprove", "modelAnswer", "coachingTip"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate answer" });
  }
});

// 7. Cheat Sheet & Story Bank Generator
app.post("/api/gemini/cheatsheet", async (req, res) => {
  try {
    const { resumeText, targetRole = "Full Stack Engineer", targetCompany = "Tech" } = req.body;

    const ai = getAI();

    const prompt = `Generate an interview cheat sheet and custom behavioral story bank for a candidate interviewing for ${targetRole} at ${targetCompany}.
Candidate Resume/Background:
${resumeText || "Senior software engineer with 5+ years building distributed applications, React, TypeScript, Node.js, AWS, and system design."}

Generate:
1. 5 Master Behavioral Stories (STAR format) tailored to the 5 most common themes:
   - Leadership / Taking Ownership
   - Overcoming a Tough Technical Challenge / Outage
   - Resolving Conflict with a Colleague or PM
   - Disagreeing with Technical Direction & Committing
   - Delivering Under Tight Deadlines
2. 5 Company-Specific Predicted Questions with instant talking bullets for ${targetCompany}.
3. 5 Smart Reverse-Interview Questions to ask the hiring manager at the end of the call.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  theme: { type: Type.STRING },
                  storyTitle: { type: Type.STRING },
                  situation: { type: Type.STRING },
                  task: { type: Type.STRING },
                  action: { type: Type.STRING },
                  result: { type: Type.STRING },
                  keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["theme", "storyTitle", "situation", "task", "action", "result"],
              },
            },
            predictedQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  recommendedAnswerOutline: { type: Type.STRING },
                },
                required: ["question", "recommendedAnswerOutline"],
              },
            },
            questionsToAskInterviewer: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["stories", "predictedQuestions", "questionsToAskInterviewer"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error generating cheatsheet:", error);
    res.status(500).json({ error: error.message || "Failed to generate cheatsheet" });
  }
});

// 8. Server-side TTS generation (Optional fallback for realistic interviewer voice)
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.slice(0, 400) }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ success: true, audioBase64: base64Audio });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    console.warn("TTS API failed or unavailable, frontend will use Web Speech synthesis fallback:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 9. Source Code & Desktop Binary Archive Download Endpoint
app.get(["/runtime_realtek_source_code.tar.gz", "/api/download/archive"], (req, res) => {
  import("child_process").then(({ exec }) => {
    const archivePath = "/tmp/runtime_realtek_source_code.tar.gz";
    exec(
      `tar --exclude='./node_modules' --exclude='./dist' --exclude='./.git' -czf ${archivePath} -C ${process.cwd()} .`,
      (err) => {
        if (err) {
          console.error("Archive creation error:", err);
          return res.status(500).send("Could not create archive");
        }
        res.download(archivePath, "runtime_realtek_source_code.tar.gz");
      }
    );
  }).catch((err) => {
    res.status(500).send(err.message);
  });
});

// Setup Vite middleware for development vs static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Runtime Realtek Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Runtime Realtek Server:", err);
});