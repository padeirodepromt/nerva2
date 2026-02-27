// src/modules/protocols/registerAdapters.js
import { registerProtocolAdapter } from "./protocolRegistry";
import { createBrandCodeFlorAdapter } from "@/modules/brandcode/brandcode.protocolAdapter";

export function registerAllProtocolAdapters() {
  registerProtocolAdapter("brandcode_flor", () => createBrandCodeFlorAdapter());
}