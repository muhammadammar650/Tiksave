exports.handler = async function(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    const targetUrl = event.queryStringParameters?.url || (event.body ? JSON.parse(event.body).url : null);
    const filename = event.queryStringParameters?.filename || 'Viralora_Media.mp4';

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: 'Missing target url parameter'
        };
    }

    try {
        const response = await fetch(decodeURIComponent(targetUrl), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://www.tiktok.com/',
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: `Upstream error: ${response.status}`
            };
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        return {
            statusCode: 200,
            isBase64Encoded: true,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Allow-Origin': '*'
            },
            body: base64
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: 'Proxy error: ' + err.message
        };
    }
};
