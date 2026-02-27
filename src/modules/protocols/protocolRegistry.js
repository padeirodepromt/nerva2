// src/modules/protocols/protocolRegistry.js
// Registry V1: SideChat e outros hosts usam a mesma interface.

const adapters = new Map();

export function registerProtocolAdapter(key, adapterFactory) {
  adapters.set(key, adapterFactory);
}

export function createProtocolAdapter(key, deps) {
  const factory = adapters.get(key);
  if (!factory) throw new Error(`Protocol adapter not found: ${key}`);
  return factory(deps);
}