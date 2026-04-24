/**
 * LIBERTYNODE - MEGAPACK TELEGRAM (v1.0)
 * 10 Módulos exclusivos para control total de bots.
 */

(function() {
    console.log("✈️ [MegaPack Telegram] Iniciando carga de módulos...");

    const tgColor = "#24A1DE"; // Azul oficial de Telegram

    const tgModulos = {
        // ==========================================
        // 📥 TRIGGERS (DISPARADORES)
        // ==========================================

        // 1. Escuchar Nuevos Mensajes (Long Polling Local)
        "tg_trigger_message": {
            id: "tg_trigger_message", type: "trigger", title: "Recibir Mensaje", icon: "📬", color: tgColor, inputs: 0, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password", placeholder: "12345:ABCDE..." }
            ],
            generateCode: (data) => {
                return `// 📬 Trigger: Escuchando mensajes de Telegram en tiempo real
let tgLastUpdateId = 0;
const botToken = "${data.botToken}";

console.log("✈️ Bot de Telegram iniciado. Esperando mensajes...");
setInterval(async () => {
    try {
        const res = await fetch(\`https://api.telegram.org/bot\${botToken}/getUpdates?offset=\${tgLastUpdateId + 1}&timeout=10\`);
        const data = await res.json();
        if (data.ok && data.result.length > 0) {
            for (let update of data.result) {
                tgLastUpdateId = update.update_id;
                if (update.message) {
                    const msgData = update.message;
                    console.log(\`[TG] Nuevo mensaje de \${msgData.from.first_name}: \${msgData.text}\`);
                    
                    // Dispara el resto del flujo pasando el mensaje como variable
                    await ejecutarFlujo(msgData);
                }
            }
        }
    } catch (err) { /* Silenciamos errores de red temporales */ }
}, 3000);

async function ejecutarFlujo(msgData) {
`; // Recordá que el Engine cierra esta llave al final del proceso
            }
        },

        // ==========================================
        // 📤 ACTIONS (ACCIONES)
        // ==========================================

        // 2. Enviar Mensaje de Texto
        "tg_action_send_text": {
            id: "tg_action_send_text", type: "action", title: "Enviar Texto", icon: "💬", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat (Destino)", type: "text", placeholder: "ej: msgData.chat.id" },
                { id: "text", label: "Mensaje", type: "textarea", placeholder: "Hola desde LibertyNode!" }
            ],
            generateCode: (data) => {
                return `    // 💬 Acción: Enviar Mensaje TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/sendMessage\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, text: \`${data.text}\`, parse_mode: "HTML" })
    });`;
            }
        },

        // 3. Enviar Imagen por URL
        "tg_action_send_photo": {
            id: "tg_action_send_photo", type: "action", title: "Enviar Foto", icon: "🖼️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat", type: "text" },
                { id: "photoUrl", label: "URL de la Imagen", type: "text" },
                { id: "caption", label: "Texto al pie (Opcional)", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 🖼️ Acción: Enviar Foto TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/sendPhoto\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, photo: "${data.photoUrl}", caption: \`${data.caption}\` })
    });`;
            }
        },

        // 4. Enviar Botones Interactivos (Inline Keyboard)
        "tg_action_send_buttons": {
            id: "tg_action_send_buttons", type: "action", title: "Enviar Botones", icon: "🎛️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat", type: "text" },
                { id: "text", label: "Pregunta/Mensaje", type: "text" },
                { id: "btn1Text", label: "Botón 1 (Texto)", type: "text" },
                { id: "btn1Data", label: "Botón 1 (Data oculta)", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 🎛️ Acción: Enviar Botones Inline TG
    const kb = { inline_keyboard: [[ { text: "${data.btn1Text}", callback_data: "${data.btn1Data}" } ]] };
    await fetch(\`https://api.telegram.org/bot${data.botToken}/sendMessage\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, text: \`${data.text}\`, reply_markup: kb })
    });`;
            }
        },

        // 5. Editar un mensaje existente
        "tg_action_edit_msg": {
            id: "tg_action_edit_msg", type: "action", title: "Editar Mensaje", icon: "✏️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat", type: "text" },
                { id: "msgId", label: "ID del Mensaje a editar", type: "text" },
                { id: "newText", label: "Nuevo Texto", type: "textarea" }
            ],
            generateCode: (data) => {
                return `    // ✏️ Acción: Editar Mensaje TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/editMessageText\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, message_id: ${data.msgId}, text: \`${data.newText}\` })
    });`;
            }
        },

        // 6. Eliminar un mensaje
        "tg_action_delete_msg": {
            id: "tg_action_delete_msg", type: "action", title: "Eliminar Mensaje", icon: "🗑️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat", type: "text" },
                { id: "msgId", label: "ID del Mensaje a borrar", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 🗑️ Acción: Eliminar Mensaje TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/deleteMessage\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, message_id: ${data.msgId} })
    });`;
            }
        },

        // 7. Banear Usuario del Grupo
        "tg_action_ban": {
            id: "tg_action_ban", type: "action", title: "Banear Usuario", icon: "🔨", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Grupo", type: "text" },
                { id: "userId", label: "ID del Usuario a banear", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 🔨 Acción: Banear Usuario TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/banChatMember\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, user_id: ${data.userId} })
    });`;
            }
        },

        // 8. Desbanear Usuario
        "tg_action_unban": {
            id: "tg_action_unban", type: "action", title: "Desbanear Usuario", icon: "🕊️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Grupo", type: "text" },
                { id: "userId", label: "ID del Usuario a liberar", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 🕊️ Acción: Desbanear Usuario TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/unbanChatMember\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, user_id: ${data.userId}, only_if_banned: true })
    });`;
            }
        },

        // 9. Simular "Escribiendo..." (Chat Action)
        "tg_action_typing": {
            id: "tg_action_typing", type: "action", title: "Estado Escribiendo...", icon: "⌨️", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat", type: "text" }
            ],
            generateCode: (data) => {
                return `    // ⌨️ Acción: Simular estado escribiendo TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/sendChatAction\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, action: "typing" })
    });`;
            }
        },

        // 10. Fijar Mensaje (Pin)
        "tg_action_pin_msg": {
            id: "tg_action_pin_msg", type: "action", title: "Fijar Mensaje", icon: "📌", color: tgColor, inputs: 1, outputs: 1,
            fields: [
                { id: "botToken", label: "Token del Bot", type: "password" },
                { id: "chatId", label: "ID del Chat/Grupo", type: "text" },
                { id: "msgId", label: "ID del Mensaje a fijar", type: "text" }
            ],
            generateCode: (data) => {
                return `    // 📌 Acción: Fijar Mensaje TG
    await fetch(\`https://api.telegram.org/bot${data.botToken}/pinChatMessage\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ${data.chatId}, message_id: ${data.msgId}, disable_notification: false })
    });`;
            }
        }
    };

    // ==========================================
    // INYECCIÓN EN EL MOTOR PRINCIPAL
    // ==========================================
    Object.keys(tgModulos).forEach(id => {
        window.LibertyModules[id] = tgModulos[id];
        
        // Lo mandamos al Sidebar de la interfaz gráfica
        if (window.UI && typeof window.UI.addModuleToSidebar === 'function') {
            window.UI.addModuleToSidebar(id);
        }
    });

    console.log("✅ [MegaPack Telegram] ¡10 módulos inyectados y listos para la acción!");
})();