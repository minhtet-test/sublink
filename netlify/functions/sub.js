const fetch = require('node-fetch');

exports.handler = async (event) => {
    const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
    const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

    // URL မရှိရင် Error ပေးဖို့ သတ်မှတ်ခြင်း
    if (!REDIS_URL || !REDIS_TOKEN) {
        return { 
            statusCode: 500, 
            body: "Server Error: Redis credentials are not configured in Netlify settings." 
        };
    }

    // ၁။ GET Request
    if (event.httpMethod === "GET") {
        const id = event.queryStringParameters.id;
        if (!id) return { statusCode: 400, body: "Error: ID missing" };

        try {
            const response = await fetch(`${REDIS_URL}/get/${id}`, {
                headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
            });
            const data = await response.json();
            return {
                statusCode: 200,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*" 
                },
                body: data.result || "Config not found"
            };
        } catch (err) {
            return { statusCode: 500, body: "Redis GET Error: " + err.message };
        }
    }

    // ၂။ POST Request
    if (event.httpMethod === "POST") {
        try {
            const configData = event.body;
            const shortId = Math.random().toString(36).substring(2, 8);

            const response = await fetch(`${REDIS_URL}/set/${shortId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
                body: configData
            });
            
            return {
                statusCode: 200,
                body: JSON.stringify({ id: shortId })
            };
        } catch (err) {
            return { statusCode: 500, body: "Redis SET Error: " + err.message };
        }
    }
};
