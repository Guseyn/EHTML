import crypto from 'node:crypto';

export const payloadWithExpiration = (payload, minutesFromNow) => {
  const payloadWithExpiration = { ...payload };
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesFromNow);
  payloadWithExpiration.exp = date.getTime();
  return payloadWithExpiration;
};

export const base64UrlEncodeJSON = (json) => {
  return Buffer.from(JSON.stringify(json))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Optional: Remove padding if needed
};

export const generateSignature = (str, secret) => {
  return crypto
    .createHmac('sha256', secret)
    .update(str)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Optional: Remove padding if needed
};
