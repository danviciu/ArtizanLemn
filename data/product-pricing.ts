export type ProductPriceConfig =
  | {
      type: "fixed";
      basePrice: number;
      pricingUnit?: "item" | "linear_meter";
      standardHeightMeters?: number;
    }
  | {
      type: "on_request";
    };

export type ProductSizeOption = {
  id: string;
  label: string;
  priceDelta: number;
};

export type ProductSizeConfig = {
  fieldLabel: string;
  options: ProductSizeOption[];
};

const bedSizeOptions: ProductSizeOption[] = [
  { id: "140x200", label: "Standard (200 x 140 cm)", priceDelta: 0 },
  { id: "160x200", label: "200 x 160 cm", priceDelta: 300 },
  { id: "180x200", label: "200 x 180 cm", priceDelta: 600 },
];

const tableSizeOptions: ProductSizeOption[] = [
  { id: "standard", label: "Standard (200 x 90 cm)", priceDelta: 0 },
  { id: "plus-20", label: "+20 cm lungime", priceDelta: 400 },
  { id: "plus-40", label: "+40 cm lungime", priceDelta: 800 },
];

const sizeConfigByCategory: Record<string, ProductSizeConfig> = {
  paturi: {
    fieldLabel: "Dimensiune compatibila:",
    options: bedSizeOptions,
  },
  mese: {
    fieldLabel: "Dimensiune blat:",
    options: tableSizeOptions,
  },
};

const priceConfigBySlug: Record<string, ProductPriceConfig> = {
  "pat-bogdan": { type: "fixed", basePrice: 5900 },
  "pat-daniela": { type: "fixed", basePrice: 5700 },
  "pat-florin": { type: "fixed", basePrice: 4900 },
  "pat-mihai": { type: "fixed", basePrice: 4700 },
  "blat-stejar-tohanita": { type: "on_request" },
  "masa-artizan-lemn": { type: "fixed", basePrice: 6500 },
  "masa-ciresu": { type: "fixed", basePrice: 5800 },
  "masa-coman": { type: "fixed", basePrice: 5400 },
  "masa-cu-banci-h": { type: "fixed", basePrice: 6900 },
  "masa-din-cires": { type: "fixed", basePrice: 4900 },
  "masa-din-paleti": { type: "fixed", basePrice: 2200 },
  "masa-lemn-profesionala": { type: "fixed", basePrice: 6200 },
  "biblioteca-bucur": { type: "on_request" },
  "raft-tip-montesori": { type: "fixed", basePrice: 890 },
  "bucatarie-rustica-dan": { type: "on_request" },
  "bucatarie-rustica-eleganta-comandau": { type: "on_request" },
  "dulap-de-baie-comandau": { type: "fixed", basePrice: 2900 },
  "dulap-de-baie-dana": { type: "fixed", basePrice: 2600 },
  "dulap-de-baie-daniela": { type: "fixed", basePrice: 2800 },
  "dulap-de-baie-phila": { type: "fixed", basePrice: 4490 },
  "dulap-de-baie-ramona": { type: "fixed", basePrice: 3100 },
  "riflaj-panou": {
    type: "fixed",
    basePrice: 950,
    pricingUnit: "linear_meter",
    standardHeightMeters: 2,
  },
  "riflaj-scara": { type: "on_request" },
  "scara-adela": { type: "on_request" },
  "scara-bela": { type: "on_request" },
  "scara-bogdan": { type: "on_request" },
  "scara-lorand": { type: "on_request" },
  "scara-podul": { type: "on_request" },
  "foisor-paul": { type: "on_request" },
  "intrare-cu-copertina-moderna": { type: "on_request" },
  "intrare-cu-detalii-arhitecturale": { type: "on_request" },
  "intrare-cu-element-rustice": { type: "on_request" },
  "intrare-profesionala-casa": { type: "on_request" },
  "intrare-si-fereastra-eleganta": { type: "on_request" },
  "poarta-stejar-radu": { type: "on_request" },
  "usa-din-lemn": { type: "on_request" },
  "cartea-in-suport-diagonal": { type: "fixed", basePrice: 449 },
  "cutie-lemn-detaliata": { type: "fixed", basePrice: 349 },
  "cutie-lemn-eleganta": { type: "fixed", basePrice: 249 },
  "cutie-lemn-profesionala": { type: "fixed", basePrice: 249 },
  "ghiveci-stejar-ania": { type: "fixed", basePrice: 349 },
  "prezentare-suport-telefon": { type: "fixed", basePrice: 249 },
  "suport-lemn-lustruit": { type: "fixed", basePrice: 349 },
  "bar-rustic-din-lemn": { type: "on_request" },
  "dulap-lemn-profesionist": { type: "fixed", basePrice: 5900 },
  "tavan-cu-grinzi-ornamentale": { type: "on_request" },
};

export function getProductSizeConfig(category: string): ProductSizeConfig | null {
  return sizeConfigByCategory[category] ?? null;
}

export function getSizeOptionById(category: string, optionId?: string | null) {
  const sizeConfig = getProductSizeConfig(category);
  if (!sizeConfig) {
    return null;
  }

  if (!optionId) {
    return sizeConfig.options[0] ?? null;
  }

  return (
    sizeConfig.options.find((option) => option.id === optionId) ??
    sizeConfig.options[0] ??
    null
  );
}

export function getProductPriceConfig(slug: string): ProductPriceConfig {
  return priceConfigBySlug[slug] ?? { type: "on_request" };
}

export function getProductUnitPrice(
  slug: string,
  category: string,
  optionId?: string | null,
) {
  const priceConfig = getProductPriceConfig(slug);
  if (priceConfig.type === "on_request") {
    return null;
  }

  const sizeOption = getSizeOptionById(category, optionId);
  const delta = sizeOption?.priceDelta ?? 0;
  return priceConfig.basePrice + delta;
}

export function formatRon(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}
