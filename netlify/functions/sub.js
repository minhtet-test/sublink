const fetch = require('node-fetch');

// ⚠️ အဆင့် (၄) မှာ ဒါတွေကို Netlify မှာ သွားထည့်ရမှာပါ
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

exports.handler = async (event) => {
    // ၁။ GET Request: ID နဲ့ Config ပြန်ထုတ်ပေးခြင်း
    if (event.httpMethod === "GET") {
        const id = event.queryStringParameters.id;
        if (!id) return { statusCode: 400, body: "Error: ID missing" };

        const response = await fetch(`${REDIS_URL}/get/${id}`, {
            headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
        });
        const data = await response.json();

        if (!data.result) return { statusCode: 404, body: "Config not found" };

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: data.result // JSON config ကို ပြန်ပို့ပေးမယ်
        };
    }

    // ၂။ POST Request: Python ဆီကနေ Config သိမ်းဆည်းခြင်း
    if (event.httpMethod === "POST") {
        try {
            const configData = event.body; // JSON string
            const shortId = Math.random().toString(36).substring(2, 8); // 6 နေရာ ID ဆောက်မယ်

            await fetch(`${REDIS_URL}/set/${shortId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
                body: configData
            });

            return {
                statusCode: 200,
                body: JSON.stringify({ id: shortId })
            };
        } catch (err) {
            return { statusCode: 500, body: err.toString() };
        }
    }
};
