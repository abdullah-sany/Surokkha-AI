import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import { z } from "zod";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  storage: multer.memoryStorage()
});

// Configure Gemini
let ai: GoogleGenAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  } else {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

// Zod Schema for input validation
const analyzeSchema = z.object({
  situationText: z.string().min(1, "Please provide a description of your concern."),
  language: z.enum(["en", "bn"]).optional().default("en"),
});

const responseSchema = z.object({
  language: z.enum(["bn", "en"]),
  safetyLevel: z.enum(["GREEN", "YELLOW", "ORANGE", "RED"]),
  summary: z.string(),
  careGuidance: z.string(),
  suggestedSpecialists: z.array(z.object({
    name: z.string(),
    reason: z.string()
  })),
  warningSigns: z.array(z.string()),
  emergencyEscalation: z.object({
    required: z.boolean(),
    message: z.string()
  }),
  importantNotes: z.array(z.string())
});

app.post("/api/specialist-guide/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    const parseResult = analyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || "Invalid input data" });
    }

    const { situationText, language } = parseResult.data;
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    const prompt = `
You are a cautious AI-powered healthcare navigation assistant.
You help users understand:
- General urgency
- Appropriate healthcare level
- Healthcare professional categories that may be relevant
- Important warning signs

STRICT RULES:
1. Never diagnose.
2. Never claim certainty.
3. Never prescribe medication.
4. Never provide medication dosage.
5. Never recommend starting or stopping medication.
6. Never claim an image confirms a disease.
7. Prefer cautious language.
8. If information is incomplete, acknowledge uncertainty.
9. If warning signs suggest possible emergency, prioritize emergency guidance.
10. Recommend healthcare professional categories only.
11. Do not invent medical facts.
12. Respond in the dominant language of the user (or the language specified).
13. Use clear, understandable language.
14. Return structured JSON only.

User Information:
"${situationText}"

Respond in ${language === 'bn' ? 'Bangla' : 'English'}.
`;

    const contents: any[] = [
      {
        role: "user",
        parts: [
          { text: prompt }
        ]
      }
    ];

    if (req.file) {
      contents[0].parts.push({
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      });
    }

    const genAiSchema = {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING, enum: ["bn", "en"] },
        safetyLevel: { type: Type.STRING, enum: ["GREEN", "YELLOW", "ORANGE", "RED"] },
        summary: { type: Type.STRING },
        careGuidance: { type: Type.STRING },
        suggestedSpecialists: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["name", "reason"]
          }
        },
        warningSigns: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        emergencyEscalation: {
          type: Type.OBJECT,
          properties: {
            required: { type: Type.BOOLEAN },
            message: { type: Type.STRING }
          },
          required: ["required", "message"]
        },
        importantNotes: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: [
        "language",
        "safetyLevel",
        "summary",
        "careGuidance",
        "suggestedSpecialists",
        "warningSigns",
        "emergencyEscalation",
        "importantNotes"
      ]
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model,
        contents,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: genAiSchema
        }
      });
    } catch (error: any) {
      const isQuotaError = error.status === 429 || error.status === 'RESOURCE_EXHAUSTED' || 
        (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
      
      if (isQuotaError) {
        console.warn(`Quota exceeded for ${model}, falling back to gemini-3.5-flash...`);
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: genAiSchema
          }
        });
      } else {
        throw error;
      }
    }

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response.text);
    } catch (e) {
      throw new Error("Failed to parse AI response as JSON");
    }

    const validatedResponse = responseSchema.safeParse(parsedResponse);
    if (!validatedResponse.success) {
      console.error("Schema validation failed", validatedResponse.error);
      throw new Error("AI produced an invalid structured response. Please try again.");
    }

    res.json(validatedResponse.data);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "The AI service encountered an error. Please try again later." });
  }
});

app.post("/api/specialist-guide/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const audioPart = {
      inlineData: {
        mimeType: req.file.mimetype,
        data: req.file.buffer.toString("base64")
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: { parts: [audioPart, { text: "Transcribe this audio. Return only the transcription, nothing else." }] }
    });

    res.json({ text: response.text?.trim() || "" });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
});

// Prescription OCR & Analysis Zod Schema
const prescriptionResponseZodSchema = z.object({
  doctorInfo: z.object({
    name: z.string().nullable().optional(),
    specialty: z.string().nullable().optional(),
  }),
  patientInfo: z.object({
    name: z.string().nullable().optional(),
    age: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
  }),
  detectedMedicines: z.array(
    z.object({
      rawTextFound: z.string().default(""),
      possibleName: z.string(),
      confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
      dosage: z.string().default(""),
      timing: z.string().default(""),
      duration: z.string().default(""),
      purpose: z.string().default(""),
    })
  ).default([]),
  suggestedTests: z.array(
    z.object({
      testName: z.string(),
      note: z.string().default(""),
    })
  ).default([]),
  hasUnreadableSections: z.boolean().default(false),
  overallAnalysis: z.string(),
  disclaimer: z.string(),
});

app.post("/api/prescription/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "The AI service is temporarily unavailable. Please try again later." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "অনুগ্রহ করে প্রেসক্রিপশনের একটি ছবি আপলোড করুন (Please upload an image of the prescription)." });
    }

    const additionalNotes = req.body?.notes || "";

    const prompt = `
You are an expert AI Medical Specialist and OCR Processor for "SUROKKHA AI" (সুরক্ষায় এআই), an intelligent healthcare ecosystem. Your primary task is to read, transcribe, and analyze doctor prescriptions (both handwritten and printed) from images.

### Objectives:
1. Extract all readable details: Doctor details, Patient details, Medicines, Dosage, Duration, Instructions, and Suggested Clinical Tests.
2. Translate complex medical terms and instructions into clear, empathetic Bengali (বাংলা).
3. Evaluate reading confidence. NEVER guess or hallucinate an unreadable medicine name.

### Strict Safety & Accuracy Rules:
- Medicine Names: Keep standard English spelling for medicine/drug names to avoid misinterpretation (e.g., "Tab. Napa Extra 500mg/65mg", "Cap. Seclo 20mg", "Tab. Monas 10mg", "Syp. Tofen").
- Ambiguity/Unclear Text: If any medicine or dosage is blurry or ambiguous, set "confidence" to "LOW", label the name as "অস্পষ্ট/Unclear", and provide an explicit warning in the purpose/note.
- Dosage Translation: Convert dosage shorthand into easy Bengali (e.g., "1+0+1 after food" -> "১+০+১ (সকালে ও রাতে, খাওয়ার পর)", "1+1+1" -> "১+১+১ (সকালে, দুপুরে ও রাতে)", "0+0+1 before sleep" -> "০+০+১ (রাতে শোবার আগে)", "1/2 tab" -> "আধা (১/২) ট্যাবলেট").
- Safety Disclaimer: Always attach the standard SUROKKHA AI medical disclaimer:
"সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত একটি কম্পিউটার-জেনারেটেড রূপান্তর। ভুল ওষুধ সেবন রোধে ওষুধ কেনার আগে অবশ্যই রেজিস্টার্ড ফার্মাসিস্ট বা ডাক্তারের কাছে প্রেসক্রিপশনটি মিলিয়ে নিন।"

${additionalNotes ? `Additional Patient / User Notes: "${additionalNotes}"` : ""}

Output must be strictly valid JSON according to the schema.
`;

    const contents: any[] = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: req.file.buffer.toString("base64"),
              mimeType: req.file.mimetype
            }
          }
        ]
      }
    ];

    const genAiSchema = {
      type: Type.OBJECT,
      properties: {
        doctorInfo: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            specialty: { type: Type.STRING, nullable: true }
          },
          required: ["name", "specialty"]
        },
        patientInfo: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            age: { type: Type.STRING, nullable: true },
            date: { type: Type.STRING, nullable: true }
          },
          required: ["name", "age", "date"]
        },
        detectedMedicines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rawTextFound: { type: Type.STRING },
              possibleName: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
              dosage: { type: Type.STRING },
              timing: { type: Type.STRING },
              duration: { type: Type.STRING },
              purpose: { type: Type.STRING }
            },
            required: ["rawTextFound", "possibleName", "confidence", "dosage", "timing", "duration", "purpose"]
          }
        },
        suggestedTests: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              testName: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["testName", "note"]
          }
        },
        hasUnreadableSections: { type: Type.BOOLEAN },
        overallAnalysis: { type: Type.STRING },
        disclaimer: { type: Type.STRING }
      },
      required: [
        "doctorInfo",
        "patientInfo",
        "detectedMedicines",
        "suggestedTests",
        "hasUnreadableSections",
        "overallAnalysis",
        "disclaimer"
      ]
    };

    let response;
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    try {
      response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: genAiSchema
        }
      });
    } catch (error: any) {
      console.warn("Error with primary model for prescription analysis, trying fallback...", error);
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: genAiSchema
        }
      });
    }

    if (!response.text) {
      throw new Error("Empty response from AI for prescription OCR");
    }

    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (err) {
      console.error("JSON parse error:", response.text);
      throw new Error("Failed to parse prescription OCR response as JSON");
    }

    const validated = prescriptionResponseZodSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Prescription schema validation error:", validated.error);
      // Ensure required fallback disclaimer
      return res.json({
        ...parsed,
        disclaimer: parsed.disclaimer || "সতর্কতা: এটি সুরক্ষায় এআই (SUROKKHA AI) দ্বারা প্রস্তুতকৃত একটি কম্পিউটার-জেনারেটেড রূপান্তর। ভুল ওষুধ সেবন রোধে ওষুধ কেনার আগে অবশ্যই রেজিস্টার্ড ফার্মাসিস্ট বা ডাক্তারের কাছে প্রেসক্রিপশনটি মিলিয়ে নিন।"
      });
    }

    res.json(validated.data);
  } catch (error: any) {
    console.error("Prescription Analysis Error:", error);
    res.status(500).json({ 
      error: isNaN(error?.message) && error?.message ? error.message : "প্রেসক্রিপশনটি প্রসেস করার সময় সমস্যা হয়েছে। অনুগ্রহ করে পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন।" 
    });
  }
});

const medicalSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  language: z.enum(["en", "bn"]).optional().default("en"),
  context: z.string().optional()
});

app.post("/api/medical-resources/search", async (req, res) => {
  try {
    const parseResult = medicalSearchSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error:
          parseResult.error.issues[0]?.message ||
          "Invalid search input"
      });
    }

    const { query, language, context } = parseResult.data;

    /*
     * ---------------------------------------------------------
     * MEDICAL RESOURCE SEARCH ONLY
     * ---------------------------------------------------------
     * If Gemini is unavailable or quota is exhausted,
     * return trusted official medical portals instead of 500.
     */

    const fallbackResources = {
      query,
      summary:
        language === "bn"
          ? "লাইভ মেডিক্যাল সার্চ বর্তমানে সাময়িকভাবে unavailable। নিচে বিশ্বস্ত সরকারি ও আন্তর্জাতিক স্বাস্থ্য সংস্থার অফিসিয়াল রিসোর্স দেওয়া হলো। নির্দিষ্ট স্বাস্থ্য সমস্যার জন্য সংশ্লিষ্ট পোর্টালে তথ্য যাচাই করুন এবং প্রয়োজনে নিবন্ধিত চিকিৎসকের পরামর্শ নিন।"
          : "Live medical search is temporarily unavailable. Below are official resources from trusted public-health and medical organizations. Please verify information through the relevant portal and consult a qualified healthcare professional when appropriate.",
      links: [
        {
          title: "World Health Organization (WHO) — Health Topics",
          uri: "https://www.who.int/health-topics",
          domain: "who.int"
        },
        {
          title: "Directorate General of Health Services (DGHS) Bangladesh",
          uri: "https://dghs.gov.bd/",
          domain: "dghs.gov.bd"
        },
        {
          title: "ICDDR,B — Centre for Health and Population Research",
          uri: "https://www.icddrb.org/",
          domain: "icddrb.org"
        },
        {
          title: "NHS UK — Health A to Z & Conditions",
          uri: "https://www.nhs.uk/conditions/",
          domain: "nhs.uk"
        },
        {
          title: "CDC — Health Topics",
          uri: "https://www.cdc.gov/health-topics.html",
          domain: "cdc.gov"
        },
        {
          title: "Mayo Clinic — Diseases & Conditions",
          uri: "https://www.mayoclinic.org/diseases-conditions",
          domain: "mayoclinic.org"
        },
        {
          title: "MedlinePlus — Trusted Health Information (NIH)",
          uri: "https://medlineplus.gov/",
          domain: "medlineplus.gov"
        }
      ],
      searchQueries: []
    };

    // Gemini client unavailable → fallback only for this feature.
    if (!ai) {
      console.warn(
        "Gemini is unavailable for Medical Resource Search. Using fallback resources."
      );

      return res.json(fallbackResources);
    }

    const prompt = `
You are an authoritative medical resource navigator grounded with Google Search.

The user is seeking verified, authoritative health resources, medical guidelines, and portal links regarding:

"${query}"

${context ? `Clinical Context / Patient Concern: ${context}` : ""}

Please search Google for authoritative, verified medical organizations, public health portals, and clinical guidelines (such as World Health Organization (WHO), DGHS Bangladesh (dghs.gov.bd), ICDDR,B (icddrb.org), NHS UK (nhs.uk), CDC (cdc.gov), Mayo Clinic (mayoclinic.org), MedlinePlus (medlineplus.gov), or reputable hospital portals).

Instructions:

1. Provide a concise, helpful 2-3 paragraph synthesis in ${
      language === "bn" ? "Bangla (বাংলা)" : "English"
    } explaining key evidence-based information, recommended precautions, when to see a specialist, and reputable institutional guidelines.

2. Emphasize trusted public health guidance (e.g., WHO, DGHS Bangladesh, NHS, CDC).

3. Keep the tone empathetic, professional, and clear.
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingMeta =
        response.candidates?.[0]?.groundingMetadata as any;

      const groundingChunks =
        groundingMeta?.groundingChunks || [];

      const webSearchQueries =
        groundingMeta?.webSearchQueries || [];

      const links: Array<{
        title: string;
        uri: string;
        domain: string;
      }> = [];

      const seenUrls = new Set<string>();

      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          const uri = chunk.web.uri;

          if (!seenUrls.has(uri)) {
            seenUrls.add(uri);

            let domain = "";

            try {
              domain = new URL(uri).hostname.replace(
                /^www\./,
                ""
              );
            } catch {
              // Ignore malformed URLs.
            }

            links.push({
              title:
                chunk.web.title ||
                domain ||
                "Verified Health Resource",
              uri,
              domain
            });
          }
        }
      }

      /*
       * Gemini worked, but Google Search Grounding did not
       * return usable links.
       */
      if (links.length === 0) {
        return res.json({
          query,
          summary: response.text || fallbackResources.summary,
          links: fallbackResources.links,
          searchQueries: webSearchQueries
        });
      }

      // Normal successful live-search response.
      return res.json({
        query,
        summary: response.text || "",
        links,
        searchQueries: webSearchQueries
      });

    } catch (error: any) {
      console.error(
        "Medical Resource Search Error:",
        error
      );

      /*
       * IMPORTANT:
       * Gemini 429 / quota errors are handled ONLY here.
       * We do NOT return HTTP 500 for this feature.
       */

      const message = String(error?.message || "").toLowerCase();

      const isQuotaError =
        error?.status === 429 ||
        error?.status === "RESOURCE_EXHAUSTED" ||
        message.includes("429") ||
        message.includes("quota") ||
        message.includes("resource_exhausted");

      if (isQuotaError) {
        console.warn(
          "Gemini quota exceeded for Medical Resource Search. Using fallback resources."
        );
      } else {
        console.warn(
          "Medical Resource Search failed. Using fallback resources."
        );
      }

      return res.json(fallbackResources);
    }

  } catch (error: any) {
    console.error(
      "Medical Resource Search Route Error:",
      error
    );

    return res.status(500).json({
      error: "Failed to process medical resource search."
    });
  }
});


// Create Vite server in middleware mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
