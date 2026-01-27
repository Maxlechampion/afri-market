import { Product } from '../types';

export const getAIAssistance = async (
  query: string,
  products: Product[]
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if (!apiKey) {
      console.warn('VITE_API_KEY non configurée');
      return "🤖 Assistant temporairement indisponible. Configuration API requise.";
    }

    const productContext = products
      .slice(0, 8)
      .map(p => `${p.name} (${p.price} XOF, ⭐${p.rating})`)
      .join('\n');

    const prompt = `Tu es un assistant shopping intelligent pour AfriMarket.
Tu aides les clients à trouver les meilleurs produits.

PRODUITS DISPONIBLES:
${productContext}

REQUÊTE CLIENT: "${query}"

Instructions:
- Réponds UNIQUEMENT en français
- Sois concis (max 150 mots)
- Si question produit, recommande basé sur options disponibles
- Sois amical et professionnel`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
            topP: 0.95,
          },
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu générer une réponse.";

  } catch (error) {
    console.error('Erreur Service Gemini:', error);
    return "😕 Je n'ai pas pu traiter votre demande. Essayez de reformuler.";
  }
};