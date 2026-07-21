const FRUITFY_API_URL = process.env.FRUITFY_API_URL ?? 'https://api.fruitfy.io';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export const getFruitfyConfig = () => ({
  apiUrl: FRUITFY_API_URL,
  token: process.env.FRUITFY_TOKEN ?? '',
  storeId: process.env.FRUITFY_STORE_ID ?? '',
  productId: process.env.FRUITFY_PRODUCT_ID ?? '',
});

export const jsonResponse = (statusCode, payload, extraHeaders = {}) => ({
  statusCode,
  headers: { ...corsHeaders, ...extraHeaders },
  body: JSON.stringify(payload),
});

export const fruitfyHeaders = (token, storeId) => ({
  Authorization: `Bearer ${token}`,
  'Store-Id': storeId,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Accept-Language': 'pt_BR',
});
