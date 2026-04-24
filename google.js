/**
 * LIBERTYNODE - MEGAPACK GOOGLE WORKSPACE (Vol. 1)
 * 25 Módulos estudiados para automatización corporativa.
 * Requiere un Access Token de Google con los scopes adecuados.
 */

(function() {
    console.log("☁️ [MegaPack Workspace] Iniciando carga de 25 módulos empresariales...");

    // Paleta oficial de Google
    const cGmail = "#EA4335";   // Rojo
    const cSheets = "#34A853";  // Verde
    const cDrive = "#FBBC04";   // Amarillo
    const cCal = "#4285F4";     // Azul
    const cDocs = "#4688F1";    // Azul Docs

    const gWorkspace = {

        // ==========================================
        // 🔴 GMAIL (Correos y Alertas)
        // ==========================================

        "g_gmail_trigger": {
            id: "g_gmail_trigger", type: "trigger", title: "Nuevo Email", icon: "📧", color: cGmail, inputs: 0, outputs: 1,
            fields: [
                { id: "token", label: "Access Token", type: "password" },
                { id: "query", label: "Filtro (ej: is:unread from:jefe@)", type: "text", placeholder: "is:unread" }
            ],
            generateCode: (data) => `// 📧 Trigger: Monitor de Gmail (Polling)
let lastHistoryId = "0";
setInterval(async () => {
    try {
        const res = await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${data.query}\`, {
            headers: { Authorization: \`Bearer ${data.token}\` }
        });
        const d = await res.json();
        if (d.messages && d.messages.length > 0) {
            const msgId = d.messages[0].id;
            // Acá podrías guardar el msgId para no repetirlo
            const msgRes = await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages/\${msgId}\`, {
                headers: { Authorization: \`Bearer ${data.token}\` }
            });
            const emailData = await msgRes.json();
            await ejecutarFlujo(emailData);
        }
    } catch(e) {}
}, 10000);
async function ejecutarFlujo(emailData) {`
        },

        "g_gmail_send": {
            id: "g_gmail_send", type: "action", title: "Enviar Correo", icon: "📤", color: cGmail, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Access Token", type: "password" },
                { id: "to", label: "Destinatario", type: "text" },
                { id: "subject", label: "Asunto", type: "text" },
                { id: "body", label: "Mensaje (Texto/HTML)", type: "textarea" }
            ],
            generateCode: (data) => `    // 📤 Acción: Enviar Email (Gmail)
    const rawEmail = btoa(\`To: ${data.to}\\nSubject: ${data.subject}\\nContent-Type: text/html; charset=utf-8\\n\\n${data.body}\`).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
    await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw: rawEmail })
    });`
        },

        "g_gmail_read": {
            id: "g_gmail_read", type: "action", title: "Leer Correo", icon: "📖", color: cGmail, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "msgId", label: "ID del Mensaje", type: "text" }
            ],
            generateCode: (data) => `    // 📖 Acción: Obtener datos del Email
    const resMail = await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages/${data.msgId}\`, {
        headers: { Authorization: \`Bearer ${data.token}\` }
    });
    const correoCompleto = await resMail.json();`
        },

        "g_gmail_mark_read": {
            id: "g_gmail_mark_read", type: "action", title: "Marcar Leído", icon: "👁️", color: cGmail, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "msgId", label: "ID del Mensaje", type: "text" }
            ],
            generateCode: (data) => `    // 👁️ Acción: Quitar etiqueta UNREAD
    await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages/${data.msgId}/modify\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ removeLabelIds: ["UNREAD"] })
    });`
        },

        "g_gmail_trash": {
            id: "g_gmail_trash", type: "action", title: "Mover a Papelera", icon: "🗑️", color: cGmail, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "msgId", label: "ID del Mensaje", type: "text" }
            ],
            generateCode: (data) => `    // 🗑️ Acción: Papelera Gmail
    await fetch(\`https://gmail.googleapis.com/gmail/v1/users/me/messages/${data.msgId}/trash\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\` }
    });`
        },

        // ==========================================
        // 🟢 GOOGLE SHEETS (Bases de datos)
        // ==========================================

        "g_sheets_append": {
            id: "g_sheets_append", type: "action", title: "Añadir Fila", icon: "➕", color: cSheets, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "sheetId", label: "ID del Documento", type: "text" },
                { id: "range", label: "Rango (ej: Hoja1!A:C)", type: "text" },
                { id: "values", label: "Valores JSON Array (ej: [\"A\", \"B\"])", type: "text" }
            ],
            generateCode: (data) => `    // ➕ Acción: Insertar fila en Sheets
    await fetch(\`https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.range}:append?valueInputOption=USER_ENTERED\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [ ${data.values} ] })
    });`
        },

        "g_sheets_get": {
            id: "g_sheets_get", type: "action", title: "Leer Rango", icon: "👀", color: cSheets, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "sheetId", label: "ID del Documento", type: "text" },
                { id: "range", label: "Rango (ej: Hoja1!A1:D10)", type: "text" }
            ],
            generateCode: (data) => `    // 👀 Acción: Leer datos de Sheets
    const resSheets = await fetch(\`https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.range}\`, {
        headers: { Authorization: \`Bearer ${data.token}\` }
    });
    const sheetData = await resSheets.json();`
        },

        "g_sheets_update": {
            id: "g_sheets_update", type: "action", title: "Actualizar Celda", icon: "✏️", color: cSheets, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "sheetId", label: "ID del Doc", type: "text" },
                { id: "range", label: "Rango exacto (ej: Hoja1!B2)", type: "text" },
                { id: "value", label: "Nuevo Valor", type: "text" }
            ],
            generateCode: (data) => `    // ✏️ Acción: Actualizar Sheet
    await fetch(\`https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.range}?valueInputOption=USER_ENTERED\`, {
        method: "PUT", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [[ "${data.value}" ]] })
    });`
        },

        "g_sheets_clear": {
            id: "g_sheets_clear", type: "action", title: "Limpiar Rango", icon: "🧹", color: cSheets, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "sheetId", label: "ID del Doc", type: "text" },
                { id: "range", label: "Rango a limpiar (ej: Hoja1!A2:Z)", type: "text" }
            ],
            generateCode: (data) => `    // 🧹 Acción: Limpiar Sheets
    await fetch(\`https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.range}:clear\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\` }
    });`
        },

        "g_sheets_create": {
            id: "g_sheets_create", type: "action", title: "Crear Excel", icon: "📄", color: cSheets, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "title", label: "Título del Documento", type: "text" }
            ],
            generateCode: (data) => `    // 📄 Acción: Crear nuevo Spreadsheet
    const resCreateSheet = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ properties: { title: "${data.title}" } })
    });
    const newSheet = await resCreateSheet.json();`
        },

        // ==========================================
        // 🟡 GOOGLE DRIVE (Archivos)
        // ==========================================

        "g_drive_list": {
            id: "g_drive_list", type: "action", title: "Buscar Archivos", icon: "🔎", color: cDrive, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "query", label: "Query (ej: name contains 'factura')", type: "text" }
            ],
            generateCode: (data) => `    // 🔎 Acción: Buscar en Drive
    const resDrive = await fetch(\`https://www.googleapis.com/drive/v3/files?q=\${encodeURIComponent("${data.query}")}\`, {
        headers: { Authorization: \`Bearer ${data.token}\` }
    });
    const driveFiles = await resDrive.json();`
        },

        "g_drive_create_folder": {
            id: "g_drive_create_folder", type: "action", title: "Crear Carpeta", icon: "📁", color: cDrive, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "name", label: "Nombre de la Carpeta", type: "text" }
            ],
            generateCode: (data) => `    // 📁 Acción: Crear Carpeta en Drive
    const resFolder = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "${data.name}", mimeType: "application/vnd.google-apps.folder" })
    });
    const newFolder = await resFolder.json();`
        },

        "g_drive_upload_text": {
            id: "g_drive_upload_text", type: "action", title: "Subir Archivo TXT", icon: "📤", color: cDrive, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "name", label: "Nombre (ej: log.txt)", type: "text" },
                { id: "content", label: "Contenido", type: "textarea" }
            ],
            generateCode: (data) => `    // 📤 Acción: Subir texto a Drive
    const metadata = { name: "${data.name}" };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', new Blob([\`${data.content}\`], {type: 'text/plain'}));
    
    await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\` }, body: form
    });`
        },

        "g_drive_delete": {
            id: "g_drive_delete", type: "action", title: "Eliminar Archivo", icon: "🔥", color: cDrive, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "fileId", label: "ID del Archivo", type: "text" }
            ],
            generateCode: (data) => `    // 🔥 Acción: Eliminar de Drive
    await fetch(\`https://www.googleapis.com/drive/v3/files/${data.fileId}\`, {
        method: "DELETE", headers: { Authorization: \`Bearer ${data.token}\` }
    });`
        },

        "g_drive_copy": {
            id: "g_drive_copy", type: "action", title: "Copiar Archivo", icon: "📑", color: cDrive, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "fileId", label: "ID a copiar", type: "text" },
                { id: "newName", label: "Nombre de la copia", type: "text" }
            ],
            generateCode: (data) => `    // 📑 Acción: Duplicar en Drive
    await fetch(\`https://www.googleapis.com/drive/v3/files/${data.fileId}/copy\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "${data.newName}" })
    });`
        },

        // ==========================================
        // 🔵 GOOGLE CALENDAR (Eventos)
        // ==========================================

        "g_cal_create": {
            id: "g_cal_create", type: "action", title: "Crear Evento", icon: "📅", color: cCal, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "summary", label: "Título", type: "text" },
                { id: "dateStart", label: "Inicio (ISO 8601)", type: "text", placeholder: "2026-05-28T09:00:00-03:00" },
                { id: "dateEnd", label: "Fin (ISO 8601)", type: "text", placeholder: "2026-05-28T10:00:00-03:00" }
            ],
            generateCode: (data) => `    // 📅 Acción: Agendar Evento
    const eventBody = {
        summary: "${data.summary}",
        start: { dateTime: "${data.dateStart}" },
        end: { dateTime: "${data.dateEnd}" }
    };
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify(eventBody)
    });`
        },

        "g_cal_list": {
            id: "g_cal_list", type: "action", title: "Próximos Eventos", icon: "🗓️", color: cCal, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "max", label: "Cantidad máxima", type: "number", placeholder: "10" }
            ],
            generateCode: (data) => `    // 🗓️ Acción: Listar agenda
    const timeMin = new Date().toISOString();
    const resCal = await fetch(\`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=\${timeMin}&maxResults=${data.max}&orderBy=startTime&singleEvents=true\`, {
        headers: { Authorization: \`Bearer ${data.token}\` }
    });
    const upcomingEvents = await resCal.json();`
        },

        "g_cal_delete": {
            id: "g_cal_delete", type: "action", title: "Cancelar Evento", icon: "❌", color: cCal, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "eventId", label: "ID del Evento", type: "text" }
            ],
            generateCode: (data) => `    // ❌ Acción: Borrar Evento
    await fetch(\`https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.eventId}\`, {
        method: "DELETE", headers: { Authorization: \`Bearer ${data.token}\` }
    });`
        },

        "g_cal_update": {
            id: "g_cal_update", type: "action", title: "Actualizar Evento", icon: "🔄", color: cCal, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "eventId", label: "ID del Evento", type: "text" },
                { id: "desc", label: "Nueva Descripción", type: "textarea" }
            ],
            generateCode: (data) => `    // 🔄 Acción: Parchear Evento
    await fetch(\`https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.eventId}\`, {
        method: "PATCH", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ description: \`${data.desc}\` })
    });`
        },

        // ==========================================
        // 🔵 GOOGLE DOCS (Textos formales)
        // ==========================================

        "g_docs_create": {
            id: "g_docs_create", type: "action", title: "Crear Documento", icon: "📝", color: cDocs, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "title", label: "Título", type: "text" }
            ],
            generateCode: (data) => `    // 📝 Acción: Crear Google Doc
    const resDoc = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ title: "${data.title}" })
    });
    const newDoc = await resDoc.json();`
        },

        "g_docs_insert": {
            id: "g_docs_insert", type: "action", title: "Insertar Texto", icon: "✍️", color: cDocs, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "docId", label: "ID del Documento", type: "text" },
                { id: "text", label: "Texto a insertar", type: "textarea" }
            ],
            generateCode: (data) => `    // ✍️ Acción: Escribir en Doc
    const requests = [{ insertText: { location: { index: 1 }, text: \`${data.text}\\n\` } }];
    await fetch(\`https://docs.googleapis.com/v1/documents/${data.docId}:batchUpdate\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ requests })
    });`
        },

        "g_docs_replace": {
            id: "g_docs_replace", type: "action", title: "Buscar y Reemplazar", icon: "🔍", color: cDocs, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "docId", label: "ID del Doc", type: "text" },
                { id: "find", label: "Texto a buscar", type: "text", placeholder: "{{NOMBRE}}" },
                { id: "replace", label: "Reemplazo", type: "text" }
            ],
            generateCode: (data) => `    // 🔍 Acción: Template Replace
    const reqReplace = [{ replaceAllText: { containsText: { text: "${data.find}", matchCase: true }, replaceText: "${data.replace}" } }];
    await fetch(\`https://docs.googleapis.com/v1/documents/${data.docId}:batchUpdate\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ requests: reqReplace })
    });`
        },

        // ==========================================
        // ⚙️ UTILIDADES DE GOOGLE
        // ==========================================

        "g_util_get_token": {
            id: "g_util_get_token", type: "action", title: "Refrescar Token", icon: "🔑", color: "#9ca3af", inputs: 1, outputs: 1,
            fields: [
                { id: "clientId", label: "Client ID", type: "text" },
                { id: "clientSecret", label: "Client Secret", type: "password" },
                { id: "refreshToken", label: "Refresh Token", type: "password" }
            ],
            generateCode: (data) => `    // 🔑 Acción: Autenticación OAuth2 Offline
    const resAuth = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: \`client_id=${data.clientId}&client_secret=${data.clientSecret}&refresh_token=${data.refreshToken}&grant_type=refresh_token\`
    });
    const authData = await resAuth.json();
    const tokenGoogle = authData.access_token; // Variable lista para usar en los demás nodos`
        },

        "g_util_translate": {
            id: "g_util_translate", type: "action", title: "Google Translate", icon: "🌎", color: "#9ca3af", inputs: 1, outputs: 1,
            fields: [
                { id: "apiKey", label: "API Key (GCP)", type: "password" },
                { id: "target", label: "Idioma (ej: en, es, pt)", type: "text" },
                { id: "text", label: "Texto a traducir", type: "textarea" }
            ],
            generateCode: (data) => `    // 🌎 Acción: Traducir texto
    const resTrans = await fetch(\`https://translation.googleapis.com/language/translate/v2?key=${data.apiKey}\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: \`${data.text}\`, target: "${data.target}" })
    });
    const translationData = await resTrans.json();
    const textoTraducido = translationData.data.translations[0].translatedText;`
        },
        
        "g_tasks_create": {
            id: "g_tasks_create", type: "action", title: "Crear Tarea", icon: "✅", color: cCal, inputs: 1, outputs: 1,
            fields: [
                { id: "token", label: "Token", type: "password" },
                { id: "taskListId", label: "ID de la Lista", type: "text", placeholder: "@default" },
                { id: "title", label: "Tarea", type: "text" }
            ],
            generateCode: (data) => `    // ✅ Acción: Añadir a Google Tasks
    await fetch(\`https://tasks.googleapis.com/tasks/v1/lists/${data.taskListId}/tasks\`, {
        method: "POST", headers: { Authorization: \`Bearer ${data.token}\`, "Content-Type": "application/json" },
        body: JSON.stringify({ title: "${data.title}" })
    });`
        }
    };

    // ==========================================
    // INYECCIÓN EN EL MOTOR PRINCIPAL
    // ==========================================
    Object.keys(gWorkspace).forEach(id => {
        window.LibertyModules[id] = gWorkspace[id];
        
        // Lo mandamos al Sidebar categorizado visualmente por los colores
        if (window.UI && typeof window.UI.addModuleToSidebar === 'function') {
            window.UI.addModuleToSidebar(id);
        }
    });

    console.log("✅ [MegaPack Workspace] ¡25 módulos inyectados! API de Google lista.");
})();
