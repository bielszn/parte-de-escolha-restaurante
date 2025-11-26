import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o "Garçom Virtual" do Roberto's Burgers. 
Seu objetivo é ajudar os clientes a escolherem o melhor lanche.
Seja amigável, engraçado e tente sempre deixar o cliente com fome.
Use emojis de comida.
Conhecimento do cardápio:
${JSON.stringify(PRODUCTS.map(p => `${p.name}: ${p.description} (R$ ${p.price})`))}

Se o cliente perguntar o que comer, sugira algo baseado nos ingredientes.
Se o cliente perguntar sobre "X-Bacon", fale que é o campeão de vendas.
Mantenha as respostas curtas (máximo 300 caracteres) para caber no chat mobile.
`;

export const sendMessageToGemini = async (history: {role: string, text: string}[], message: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the prompt with history context manually since we are doing a single turn for simplicity or use chat
    // For this simple UI, we will just use generateContent with system instruction.
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
      }
    });

    return response.text || "Desculpe, fui buscar ketchup e não ouvi. Pode repetir?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Opa, o sistema deu uma engasgada. Mas o chapeiro continua trabalhando! Tente de novo.";
  }
};
