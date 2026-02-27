/* src/api/services/widgetRegistryService.js
   desc: Widget Registry Service V1 (Lego System)
   goal: Single source of truth for "what widgets exist" and "what they require".
   rule: Registry is code-first for now (no DB table yet). Easy to migrate later.
*/

// ⚙️ Registry (code-first)
// Later: migrate this to DB table "system_widgets" without changing callers.
const WIDGETS = [
  {
    widgetKey: 'brandcode',
    title: 'BrandCode',
    description: 'DNA vivo da marca, protocolo e governança (Flor).',
    category: 'Brand',
    icon: 'IconSankalpa',

    // Lego requirements
    requires: {
      // Installed in workspace (shop)
      userSystemKey: 'brand_code',
      // Optional agent hired (shop)
      agentKey: 'flor',
      // Enabled per project
      projectSystemKey: 'brand_code'
    },

    // Front mapping (kept as strings so the backend never imports React)
    ui: {
      route: '/brandcode',
      view: 'BrandCodeView',
      widgetComponent: 'BrandCodeDNAWidget'
    },

    billing: {
      // B: hired in Shop (workspace install), then enabled per-project
      hireType: 'workspace',
      enableType: 'project',
      monthlyPriceCents: 2000
    },
  }
];

const PRODUCTS = [
  {
    productKey: 'brandcode_pack',
    title: 'BrandCode Pack',
    description: 'Instala a Flor e habilita o sistema BrandCode no Prana.',
    category: 'Brand',
    icon: 'IconSankalpa',

    // What it installs
    installs: {
      userSystems: ['brand_code'],
      agents: ['flor'],
      widgets: ['brandcode']
    },

    billing: {
      monthlyPriceCents: 0,
      note: 'Cobrança acontece por projeto habilitado.'
    }
  }
];

export const WidgetRegistryService = {
  listWidgets() {
    return WIDGETS;
  },

  listProducts() {
    return PRODUCTS;
  },

  getProduct(productKey) {
    return PRODUCTS.find(p => p.productKey === productKey) || null;
  },

  getWidget(widgetKey) {
    return WIDGETS.find(w => w.widgetKey === widgetKey) || null;
  },

  // Convenience: widgets unlocked by a product
  listWidgetsForProduct(productKey) {
    const product = this.getProduct(productKey);
    if (!product) return [];
    return (product.installs?.widgets || [])
      .map((k) => this.getWidget(k))
      .filter(Boolean);
  }
};

export default WidgetRegistryService;