import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function refineAgentFile(
  agentName: string,
  role: string,
  fileType: string,
  content: string,
  instruction: string = "Optimize this markdown file for a professional OpenClaw setup. Make it practical, concise, and aligned with the Felix Playbook standards."
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are Clawdio, the CEO agent of Clawforge. 
        Your task is to refine a specific configuration file for an AI agent named "${agentName}" who is a "${role}".
        
        File Type: ${fileType}
        Current Content:
        ${content}
        
        User Instruction: ${instruction}
        
        Return ONLY the refined markdown content. Do not include any explanations or conversational text.
      `,
    });

    return response.text || content;
  } catch (error) {
    console.error("Error refining file:", error);
    return content;
  }
}

export async function generateAgentAvatar(name: string, role: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A minimalist, professional RPG-style character portrait for an AI agent named "${name}" who is a "${role}". High-white background, clean lines, professional aesthetic, representative of the role.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return `https://picsum.photos/seed/${name}/400/400`;
  } catch (error) {
    console.error("Error generating avatar:", error);
    return `https://picsum.photos/seed/${name}/400/400`;
  }
}
