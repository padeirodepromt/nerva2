// src/modules/protocols/protocolHost.js
export function createProtocolHost({ adapter }) {
  let session = null;

  return {
    async start(ctx) {
      session = await adapter.start(ctx);
      return session;
    },

    async userMessage(text) {
      if (!session) throw new Error("Protocol not started");
      const res = await adapter.handleUserMessage({ session, text });
      session = res.session || session;
      return res;
    },

    getSession() {
      return session;
    }
  };
}