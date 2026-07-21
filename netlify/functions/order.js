import { corsHeaders, fruitfyHeaders, getFruitfyConfig, jsonResponse } from './_shared/fruitfy.js';

const getOrderId = (event) => {
  const pathParts = (event.path ?? '').split('/').filter(Boolean);
  const rawOrderId = pathParts[pathParts.length - 1] ?? '';
  return decodeURIComponent(rawOrderId);
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, message: 'Method not allowed' });
  }

  const { token, storeId, apiUrl } = getFruitfyConfig();

  if (!token || !storeId) {
    return jsonResponse(500, {
      success: false,
      message: 'Configuração Fruitfy ausente. Defina FRUITFY_TOKEN e FRUITFY_STORE_ID na Netlify.',
    });
  }

  try {
    const orderId = getOrderId(event);

    if (!orderId || orderId === 'order') {
      return jsonResponse(400, { success: false, message: 'ID do pedido inválido.' });
    }

    const response = await fetch(`${apiUrl}/api/order/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: fruitfyHeaders(token, storeId),
    });

    const responseData = await response.json().catch(() => null);
    return jsonResponse(
      response.status,
      responseData ?? { success: false, message: 'Resposta inválida da Fruitfy.' },
    );
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      message: 'Falha ao consultar status do pedido na Fruitfy.',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
