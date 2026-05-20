const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Sert le fichier index.html

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral';

const SYSTEM_PROMPT = `Tu es un expert biblique, théologien et historien.
Tu réponds aux questions sur la Bible avec précision, en citant les versets (livre, chapitre, verset).
Tu es bienveillant, humble et pédagogue. Si tu ne sais pas, tu dis "Je ne sais pas".`;

app.post('/api/bible', async (req, res) => {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: 'Question vide' });
    }
    
    console.log(`📖 Question: ${question}`);
    
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: `${SYSTEM_PROMPT}\n\nQuestion de l'utilisateur: ${question}\n\nRéponse détaillée avec versets:`,
            stream: false,
            options: {
                temperature: 0.7,
                max_tokens: 1000
            }
        });
        
        let reponse = response.data.response;
        console.log(`✅ Réponse envoyée (${reponse.length} caractères)`);
        
        res.json({ reponse: reponse });
    } catch (error) {
        console.error('Erreur Ollama:', error.message);
        res.status(500).json({ error: 'Service indisponible' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📖 Expert Biblique IA - http://localhost:${PORT}`);
    console.log(`⚠️  Laissez ce terminal ouvert !`);
});
