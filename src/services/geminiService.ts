import { Product } from '../types';

/**
 * Service Gemini AI - Assistant Shopping
 * Version corrigée pour éviter erreur 400
 */

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

    // Préparer le contexte avec les MEILLEURS produits seulement (top 5)
    const topProducts = products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const productList = topProducts
      .map(p => `${p.name} (${p.price} XOF, ⭐${p.rating}/5)`)
      .join(', ');

    // PROMPT SIMPLIFIÉ mais professionnel
    const prompt = `Tu es l'assistant shopping d'AfriMarket, marketplace africaine.

Produits disponibles: ${productList}

Question: "${query}"

Réponds SIMPLEMENT:
- En français, professionnel mais amical
- Si question produit: recommande 1-2 produits avec prix exact
- Si question livraison: "AfriMarket livre 20 pays africains en 48-72h"
- Si question paiement: "Orange Money, MTN, Wave, Moov, Free Money - 100% sécurisé"
- Si hors-contexte: "Je suis spécialisé en shopping, comment puis-je vous aider?"
- Max 100 mots, sois concis`;

    console.log('Envoi requête Gemini...');

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
            maxOutputTokens: 200,
            temperature: 0.7,
          },
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API Gemini (status ' + response.status + '):', errorText);
      
      if (response.status === 400) {
        return "⚠️ Erreur de requête. Veuillez reformuler votre question.";
      }
      if (response.status === 401) {
        return "❌ Clé API invalide. Veuillez contacter le support.";
      }
      if (response.status === 429) {
        return "⏳ Trop de requêtes. Attendez quelques secondes puis réessayez.";
      }
      
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.warn('Pas de contenu dans la réponse Gemini');
      return "Je n'ai pas pu générer une réponse. Veuillez reformuler.";
    }

    console.log('Réponse Gemini reçue ✓');
    return textContent;

  } catch (error) {
    console.error('Erreur Service Gemini:', error);
    return "😕 Je n'ai pas pu traiter votre demande. Veuillez réessayer.";
  }
};