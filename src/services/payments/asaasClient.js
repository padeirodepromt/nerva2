/* src/services/payments/asaasClient.js
   desc: Asaas Client V1 (Thin Wrapper)
   env : ASAAS_API_URL, ASAAS_API_KEY
*/

import axios from "axios";

const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

function assertConfigured() {
  if (!ASAAS_API_KEY) {
    const err = new Error("ASAAS_API_KEY missing");
    err.code = "ASAAS_NOT_CONFIGURED";
    throw err;
  }
}

function headers() {
  return {
    access_token: ASAAS_API_KEY,
    "Content-Type": "application/json"
  };
}

export const asaasClient = {
  baseUrl: ASAAS_API_URL,

  async get(path, params = {}) {
    assertConfigured();
    const url = `${ASAAS_API_URL}${path}`;
    const res = await axios.get(url, { params, headers: headers() });
    return res.data;
  },

  async post(path, body = {}) {
    assertConfigured();
    const url = `${ASAAS_API_URL}${path}`;
    const res = await axios.post(url, body, { headers: headers() });
    return res.data;
  },

  async put(path, body = {}) {
    assertConfigured();
    const url = `${ASAAS_API_URL}${path}`;
    const res = await axios.put(url, body, { headers: headers() });
    return res.data;
  },

  async del(path) {
    assertConfigured();
    const url = `${ASAAS_API_URL}${path}`;
    const res = await axios.delete(url, { headers: headers() });
    return res.data;
  },

  // Helpers comuns
  async findCustomerByEmail(email) {
    if (!email) return null;
    const data = await this.get("/customers", { email });
    const found = Array.isArray(data?.data) ? data.data[0] : null;
    return found || null;
  },

  async createCustomer({ name, email, cpfCnpj }) {
    return this.post("/customers", { name, email, cpfCnpj });
  }
};