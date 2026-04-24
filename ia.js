/**
 * LIBERTYNODE - MEGAPACK INTELIGENCIA ARTIFICIAL (v1.0)
 * Integración con Gemini, OpenAI, Claude y utilidades cognitivas.
 */

(function() {
    console.log("🧠 [MegaPack AI] Iniciando carga de módulos neuronales...");

    const cAI = "#8b5cf6"; // Violeta futurista para todo lo que sea IA

    const aiModules = {

        // ==========================================
        // 🧠 GOOGLE GEMINI (Multimodal ultrarrápido)
        // ==========================================

        "ai_gemini_chat": {
            id: "ai_gemini_chat", type: "action", title: "Gemini 1.5 Pro", icon: "✨", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "API Key (Google Studio)", type: "password" },
                { id: "prompt", label: "Instrucción (Prompt)", type: "textarea", placeholder: "Resume este texto..." }
            ],
            generateCode: (data) => `    // ✨ Acción: Consultar a Google Gemini
    const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${data.apiKey}", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: \`${data.prompt}\` }] }] })
    });
    const geminiData = await geminiRes.json();
    const respuestaGemini = geminiData.candidates[0].content.parts[0].text;
    console.log("Gemini respondió:", respuestaGemini);`
        },

        "ai_gemini_vision": {
            id: "ai_gemini_vision", type: "action", title: "Gemini Vision", icon: "👁️", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "API Key", type: "password" },
                { id: "prompt", label: "Pregunta sobre la imagen", type: "text", placeholder: "¿Qué circuito es este?" },
                { id: "mimeType", label: "Tipo (ej: image/jpeg)", type: "text", placeholder: "image/jpeg" },
                { id: "base64", label: "Imagen en Base64", type: "text", placeholder: "Variable con el base64" }
            ],
            generateCode: (data) => `    // 👁️ Acción: Analizar imagen con Gemini Vision
    const geminiVisRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${data.apiKey}", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [
                { text: \`${data.prompt}\` },
                { inline_data: { mime_type: "${data.mimeType}", data: ${data.base64} } }
            ]}]
        })
    });
    const geminiVisData = await geminiVisRes.json();
    const analisisImagen = geminiVisData.candidates[0].content.parts[0].text;`
        },

        // ==========================================
        // 🤖 OPENAI (ChatGPT, DALL-E, Whisper)
        // ==========================================

        "ai_openai_chat": {
            id: "ai_openai_chat", type: "action", title: "ChatGPT (GPT-4o)", icon: "💬", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "OpenAI API Key", type: "password" },
                { id: "system", label: "Rol del Sistema", type: "text", placeholder: "Eres un ingeniero biomédico experto..." },
                { id: "prompt", label: "Mensaje del Usuario", type: "textarea" }
            ],
            generateCode: (data) => `    // 💬 Acción: Consultar a OpenAI GPT-4o
    const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", 
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer ${data.apiKey}\` },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: \`${data.system}\` },
                { role: "user", content: \`${data.prompt}\` }
            ]
        })
    });
    const oaiData = await oaiRes.json();
    const respuestaGPT = oaiData.choices[0].message.content;`
        },

        "ai_openai_json": {
            id: "ai_openai_json", type: "action", title: "Extraer Datos (JSON)", icon: "📋", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "OpenAI API Key", type: "password" },
                { id: "schema", label: "Estructura JSON deseada", type: "text", placeholder: "{ nombre: '', edad: 0 }" },
                { id: "text", label: "Texto desordenado", type: "textarea" }
            ],
            generateCode: (data) => `    // 📋 Acción: Extracción forzada a JSON con OpenAI
    const jsonRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", 
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer ${data.apiKey}\` },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: \`Extrae la información del usuario. Debes responder estrictamente en este formato JSON: ${data.schema}\` },
                { role: "user", content: \`${data.text}\` }
            ]
        })
    });
    const jsonData = await jsonRes.json();
    const datosExtraidos = JSON.parse(jsonData.choices[0].message.content);`
        },

        "ai_openai_dalle": {
            id: "ai_openai_dalle", type: "action", title: "Generar Imagen", icon: "🎨", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "OpenAI API Key", type: "password" },
                { id: "prompt", label: "Descripción de la imagen", type: "textarea", placeholder: "Un robot soldando una placa Arduino, estilo cyberpunk..." }
            ],
            generateCode: (data) => `    // 🎨 Acción: Generar imagen con DALL-E 3
    const imgRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST", 
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer ${data.apiKey}\` },
        body: JSON.stringify({
            model: "dall-e-3",
            prompt: \`${data.prompt}\`,
            n: 1,
            size: "1024x1024"
        })
    });
    const imgData = await imgRes.json();
    const urlImagenGenerada = imgData.data[0].url;`
        },

        "ai_openai_tts": {
            id: "ai_openai_tts", type: "action", title: "Texto a Voz (TTS)", icon: "🗣️", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "OpenAI API Key", type: "password" },
                { id: "voice", label: "Voz (alloy, echo, fable, onyx, nova, shimmer)", type: "text", placeholder: "nova" },
                { id: "text", label: "Texto a narrar", type: "textarea" }
            ],
            generateCode: (data) => `    // 🗣️ Acción: Generar Audio a partir de texto
    const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST", 
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer ${data.apiKey}\` },
        body: JSON.stringify({
            model: "tts-1",
            voice: "${data.voice}",
            input: \`${data.text}\`
        })
    });
    const audioBlob = await ttsRes.blob();
    // (Este blob se puede enviar luego por Telegram o guardar en Drive)`
        },

        // ==========================================
        // 🧠 ANTHROPIC (Claude 3)
        // ==========================================

        "ai_anthropic_claude": {
            id: "ai_anthropic_claude", type: "action", title: "Claude 3 (Opus/Sonnet)", icon: "🧠", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "Anthropic API Key", type: "password" },
                { id: "model", label: "Modelo", type: "text", placeholder: "claude-3-sonnet-20240229" },
                { id: "prompt", label: "Instrucción", type: "textarea", placeholder: "Analiza el siguiente código fuente..." }
            ],
            generateCode: (data) => `    // 🧠 Acción: Consultar a Anthropic Claude 3
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", 
        headers: { 
            "Content-Type": "application/json", 
            "x-api-key": "${data.apiKey}",
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "${data.model}",
            max_tokens: 1024,
            messages: [{ role: "user", content: \`${data.prompt}\` }]
        })
    });
    const claudeData = await claudeRes.json();
    const respuestaClaude = claudeData.content[0].text;`
        },

        // ==========================================
        // ⚖️ LOGICA COGNITIVA (Clasificadores)
        // ==========================================

        "ai_sentiment_router": {
            id: "ai_sentiment_router", type: "action", title: "Analizador de Tono", icon: "🎭", color: cAI, inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "OpenAI API Key", type: "password" },
                { id: "text", label: "Texto a analizar", type: "text", placeholder: "ej: msgData.text" }
            ],
            generateCode: (data) => `    // 🎭 Acción: Clasificador de sentimientos rápido
    const sentRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": \`Bearer ${data.apiKey}\` },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Clasifica el texto en una sola palabra: POSITIVO, NEGATIVO, URGENTE o NEUTRAL." },
                { role: "user", content: \`${data.text}\` }
            ],
            temperature: 0
        })
    });
    const sentData = await sentRes.json();
    const sentimiento = sentData.choices[0].message.content.trim().toUpperCase();
    console.log("El tono del mensaje es:", sentimiento);`
        }
    };

    // INYECCIÓN EN EL MOTOR
    Object.keys(aiModules).forEach(id => {
        window.LibertyModules[id] = aiModules[id];
        if (window.UI && typeof window.UI.addModuleToSidebar === 'function') {
            window.UI.addModuleToSidebar(id);
        }
    });

    console.log("✅ [MegaPack AI] Todos los modelos están en línea.");
})();
