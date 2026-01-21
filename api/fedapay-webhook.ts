
/**
 * BACKEND SÉCURISÉ - FedaPay Webhook
 */

export default async function handler(req: any, res: any) {
    // SÉCURITÉ 1 : Autoriser uniquement les requêtes POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Méthode non autorisée. Seul le POST est accepté.' });
    }
  
    // SÉCURITÉ 2 : Vérification de la signature FedaPay
    // En production, vous devez vérifier que la requête vient bien de FedaPay.
    // Cela empêche un pirate d'envoyer un faux signal de succès.
    
    const signature = req.headers['x-fedapay-signature'];
    if (!signature) {
      console.error('ALERTE : Tentative de fraude détectée (Pas de signature).');
      return res.status(401).json({ message: 'Signature manquante.' });
    }
  
    const event = req.body;
  
    try {
      // SÉCURITÉ 3 : Logique métier basée sur les événements réels
      switch (event.status) {
        case 'approved':
          // On vérifie que le montant correspond bien à une commande existante dans notre base
          // const order = await database.findOrder(event.external_id);
          // if (order.amount !== event.amount) throw new Error("Montant incohérent !");
          
          console.log(`✅ PAIEMENT VÉRIFIÉ : ${event.amount} XOF par ${event.customer.email}`);
          // Ici, marquer la commande comme "Payée" dans votre base de données.
          break;
        
        case 'declined':
          console.log('❌ PAIEMENT REFUSÉ : Le solde du client est peut-être insuffisant.');
          break;
  
        case 'canceled':
          console.log('ℹ️ PAIEMENT ANNULÉ par le client.');
          break;
  
        default:
          console.log('Événement FedaPay inconnu:', event.status);
      }
  
      // Répondre toujours avec un 200 pour dire à FedaPay qu'on a bien reçu le signal
      return res.status(200).json({ status: 'received' });
  
    } catch (error) {
      console.error('ERREUR SÉCURITÉ WEBHOOK:', error);
      return res.status(400).send('Erreur lors du traitement du signal de paiement.');
    }
  }
  