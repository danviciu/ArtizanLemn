import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const EXTENSION_PRIORITY = {
  ".png": 5,
  ".jpg": 4,
  ".jpeg": 3,
  ".webp": 2,
  ".avif": 1,
};

const EXPORT_IMAGE_MAX_WIDTH = 1920;
const EXPORT_WEBP_QUALITY = 82;

const ROLE_ORDER = {
  overall: 1,
  alternate: 2,
  context: 3,
  detail: 4,
};

const ROLE_FILE_LABEL = {
  overall: "ansamblu",
  alternate: "unghi",
  context: "ambient",
  detail: "detaliu",
};

const NOISE_TOKENS = new Set([
  "edit",
  "edited",
  "final",
  "export",
  "copy",
  "copie",
  "new",
  "nou",
  "randare",
  "render",
  "retusat",
  "retusata",
  "retusatata",
  "upscale",
  "upscaled",
  "versiune",
  "version",
  "v",
]);

const VARIANT_ALPHA_TOKENS = new Set(["a", "b", "c", "d"]);

const GROUP_STOPWORDS = new Set([
  "a",
  "ai",
  "al",
  "ale",
  "cu",
  "de",
  "din",
  "in",
  "la",
  "pe",
  "si",
  "sau",
  "un",
  "una",
]);

const TITLE_LOWER_WORDS = new Set([
  "a",
  "al",
  "ale",
  "cu",
  "de",
  "din",
  "in",
  "la",
  "si",
  "sau",
  "pe",
]);

const DETAIL_KEYWORDS = new Set([
  "detaliu",
  "detaliata",
  "detaliat",
  "close",
  "closeup",
  "macro",
  "finisaj",
  "imbinare",
  "textura",
]);

const CONTEXT_KEYWORDS = new Set([
  "ambient",
  "amenajare",
  "interior",
  "hol",
  "balcon",
  "veranda",
  "terasa",
  "panoramic",
  "priveliste",
  "mansarda",
]);

const ALT_KEYWORDS = new Set([
  "vedere",
  "lateral",
  "profil",
  "angle",
  "view",
  "alt",
  "varianta",
]);

const PRODUCT_HINT_TOKENS = new Set([
  "bar",
  "biblioteca",
  "blat",
  "bucatarie",
  "cutie",
  "dulap",
  "fereastra",
  "foisor",
  "ghiveci",
  "grinzi",
  "intrare",
  "jucarie",
  "marchiza",
  "masa",
  "pat",
  "poarta",
  "raft",
  "riflaj",
  "scara",
  "suport",
  "tavan",
  "usa",
]);

const EXTERIOR_KEYWORDS = new Set([
  "foisor",
  "marchiza",
  "poarta",
  "usa",
  "intrare",
  "fereastra",
  "terasa",
  "veranda",
]);

const DECORATIVE_KEYWORDS = new Set([
  "cutie",
  "suport",
  "ghiveci",
  "jucarie",
  "cadou",
]);

const CATEGORY_DEFINITIONS = {
  paturi: {
    name: "Paturi",
    description:
      "Paturi din lemn masiv cu structura stabila si proportii curate, realizate pe comanda.",
    usageLabel: "zona de dormitor",
    tag: "dormitor premium",
    suitableFor: [
      "Dormitoare matrimoniale",
      "Camere de oaspeti",
      "Proiecte rezidentiale premium",
    ],
    finishes: [
      "Finisaj mat orientat pe textura naturala",
      "Nuanta ajustata dupa paleta camerei",
    ],
  },
  mese: {
    name: "Mese si blaturi",
    description:
      "Mese si blaturi din lemn masiv pentru dining sau zone de lucru, realizate pe dimensiuni reale.",
    usageLabel: "zona de dining sau lucru",
    tag: "dining premium",
    suitableFor: [
      "Dining de familie",
      "Spatii horeca premium",
      "Amenajari rezidentiale personalizate",
    ],
    finishes: [
      "Ulei natural sau lac mat, dupa nivelul de uzura",
      "Protectie suplimentara pentru suprafete active",
    ],
  },
  biblioteci: {
    name: "Biblioteci si rafturi",
    description:
      "Biblioteci si rafturi personalizate pentru organizare, expunere si integrare armonioasa in interior.",
    usageLabel: "zone de living, lucru sau lectura",
    tag: "depozitare eleganta",
    suitableFor: [
      "Living cu depozitare deschisa",
      "Birouri rezidentiale",
      "Camere de copii sau lectura",
    ],
    finishes: [
      "Finisaj mat cu accent pe fibra lemnului",
      "Nuante calibrate dupa amenajarea existenta",
    ],
  },
  bucatarii: {
    name: "Bucatarii",
    description:
      "Mobilier de bucatarie realizat pe configuratia spatiului, cu atentie la functionalitate si finisaj.",
    usageLabel: "proiecte de bucatarie pe comanda",
    tag: "bucatarie custom",
    suitableFor: [
      "Bucatarii rezidentiale",
      "Case cu open-space",
      "Proiecte premium cu integrare completa",
    ],
    finishes: [
      "Finisaje rezistente la uzura zilnica",
      "Protectii adaptate zonelor cu umiditate",
    ],
  },
  "dulapuri-de-baie": {
    name: "Dulapuri de baie",
    description:
      "Dulapuri si corpuri pentru baie, executate pe cotele reale ale spatiului si tratate pentru umiditate.",
    usageLabel: "spatii de baie",
    tag: "rezistenta la umiditate",
    suitableFor: [
      "Bai rezidentiale compacte",
      "Amenajari premium cu depozitare integrata",
      "Nise sau colturi atipice",
    ],
    finishes: [
      "Finisaje usor de intretinut",
      "Protectie adaptata mediului umed",
    ],
  },
  riflaje: {
    name: "Riflaje",
    description:
      "Panouri riflate si accente verticale care ordoneaza vizual spatiul si aduc textura naturala.",
    usageLabel: "accente arhitecturale interioare",
    tag: "accent arhitectural",
    suitableFor: [
      "Living si holuri",
      "Case cu design contemporan",
      "Spatii comerciale premium",
    ],
    finishes: [
      "Finisaj mat orientat pe textura",
      "Nuante personalizabile la cerere",
    ],
  },
  scari: {
    name: "Scari",
    description:
      "Scari interioare din lemn realizate pe proiect, cu focus pe siguranta, proportii si detaliu.",
    usageLabel: "spatii pe mai multe niveluri",
    tag: "piesa structurala",
    suitableFor: [
      "Case cu etaj sau mansarda",
      "Interioare cu accent structural",
      "Proiecte rezidentiale premium",
    ],
    finishes: [
      "Finisaje rezistente la trafic",
      "Protectie pentru trepte si mana curenta",
    ],
  },
  "exterior-lemn": {
    name: "Elemente exterioare",
    description:
      "Porti, usi, marchize si structuri exterioare din lemn, realizate pe proiect si context arhitectural.",
    usageLabel: "zone exterioare sau de acces",
    tag: "executie exterior",
    suitableFor: [
      "Case individuale",
      "Intrari si fatade cu detalii din lemn",
      "Terase si zone acoperite",
    ],
    finishes: [
      "Protectie exterior rezistenta UV",
      "Tratamente pentru intemperii si variatii de temperatura",
    ],
  },
  "obiecte-decorative": {
    name: "Obiecte decorative",
    description:
      "Obiecte mici din lemn cu caracter artizanal, potrivite pentru detalii functionale sau cadouri.",
    usageLabel: "detalii decorative si functionale",
    tag: "detalii artizanale",
    suitableFor: [
      "Cadouri personalizate din lemn",
      "Accente pentru birou sau living",
      "Piese functionale de dimensiuni mici",
    ],
    finishes: [
      "Finisaj natural, orientat pe textura",
      "Protectie usoara stabilita dupa utilizare",
    ],
  },
  "piese-personalizate": {
    name: "Piese personalizate",
    description:
      "Lucrari unicat si proiecte speciale realizate in atelier, adaptate contextului fiecarui client.",
    usageLabel: "proiecte personalizate",
    tag: "solutie unicat",
    suitableFor: [
      "Proiecte rezidentiale cu cerinte speciale",
      "Amenajari care necesita adaptare completa",
      "Interventii artizanale punctuale",
    ],
    finishes: [
      "Finisaj stabilit dupa mostra si context",
      "Ajustari finale in functie de amplasare",
    ],
  },
};

const FOLDER_TO_CATEGORY = {
  bar: "piese-personalizate",
  biblioteca: "biblioteci",
  blaturi: "mese",
  bucatarie: "bucatarii",
  cadouri: "obiecte-decorative",
  "din-palet": "piese-personalizate",
  diverse: "piese-personalizate",
  "dulap-de-baie": "dulapuri-de-baie",
  foisoare: "exterior-lemn",
  jucarii: "obiecte-decorative",
  marchize: "exterior-lemn",
  mese: "mese",
  paturi: "paturi",
  porti: "exterior-lemn",
  rafturi: "biblioteci",
  riflaj: "riflaje",
  scari: "scari",
  usi: "exterior-lemn",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_DEFINITIONS);

const APP_ROOT = process.cwd();
const SOURCE_ROOT = path.resolve(APP_ROOT, "..", "imagini");
const TARGET_PRODUCTS_ROOT = path.join(APP_ROOT, "public", "images", "produse");
const PRODUCTS_FILE = path.join(APP_ROOT, "data", "products.ts");
const CATEGORIES_FILE = path.join(APP_ROOT, "data", "categories.ts");
const MAPPING_FILE = path.join(APP_ROOT, "data", "productMapping.json");

function removeDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function slugify(value) {
  return removeDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function romanianTitleCase(words) {
  return words
    .filter(Boolean)
    .map((word, index) => {
      if (word === "artizanlemn") {
        return "Artizan Lemn";
      }

      if (index > 0 && TITLE_LOWER_WORDS.has(word)) {
        return word;
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanupBaseName(rawBaseName) {
  let value = rawBaseName.replace(/_remix_[a-z0-9]+$/i, "");
  value = value.replace(/^\d{8}_\d{4}_/, "");
  value = value.replace(/[_-]+/g, " ");
  value = value.replace(/\s+/g, " ").trim();
  return value;
}

function removeTrailingNoiseTokens(tokens) {
  const cleaned = [...tokens];
  while (cleaned.length && NOISE_TOKENS.has(cleaned[cleaned.length - 1])) {
    cleaned.pop();
  }

  return cleaned;
}

function parseName(baseName) {
  const cleanedBase = cleanupBaseName(baseName);
  const normalized = removeDiacritics(cleanedBase).toLowerCase();
  let tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  tokens = removeTrailingNoiseTokens(tokens);

  let variant = "";
  if (tokens.length > 1) {
    const lastToken = tokens[tokens.length - 1];
    const isNumericVariant = /^\d{1,2}$/.test(lastToken);
    const isKnownAlphaVariant = VARIANT_ALPHA_TOKENS.has(lastToken);
    if (isNumericVariant || isKnownAlphaVariant) {
      variant = lastToken;
      tokens = tokens.slice(0, -1);
    }
  }

  const displayTitle = romanianTitleCase(tokens);
  const groupingTokens = tokens.filter((token) => !GROUP_STOPWORDS.has(token));
  const productKeyTokens = groupingTokens.length ? groupingTokens : tokens;
  const productKey = slugify(productKeyTokens.join(" "));
  const frameKey = slugify(`${tokens.join(" ")} ${variant}`.trim());

  return {
    tokens,
    variant,
    displayTitle,
    productKey,
    frameKey,
    normalized,
  };
}

function classifyRole(tokens, variant) {
  if (tokens.some((token) => DETAIL_KEYWORDS.has(token))) {
    return "detail";
  }

  if (tokens.some((token) => CONTEXT_KEYWORDS.has(token))) {
    return "context";
  }

  if (variant || tokens.some((token) => ALT_KEYWORDS.has(token))) {
    return "alternate";
  }

  return "overall";
}

function inferCategory(folderSlug, tokens) {
  const tokenSet = new Set(tokens);
  let inferred = FOLDER_TO_CATEGORY[folderSlug] ?? "piese-personalizate";

  if (tokenSet.has("pat")) {
    return "paturi";
  }

  if (tokenSet.has("masa") || tokenSet.has("blat")) {
    return "mese";
  }

  if (tokenSet.has("biblioteca") || tokenSet.has("raft") || tokenSet.has("rafturi")) {
    return "biblioteci";
  }

  if (tokenSet.has("bucatarie")) {
    return "bucatarii";
  }

  if (tokenSet.has("dulap") && tokenSet.has("baie")) {
    return "dulapuri-de-baie";
  }

  if (tokenSet.has("riflaj")) {
    return "riflaje";
  }

  if (tokenSet.has("scara")) {
    return "scari";
  }

  if (tokens.some((token) => EXTERIOR_KEYWORDS.has(token))) {
    return "exterior-lemn";
  }

  if (tokens.some((token) => DECORATIVE_KEYWORDS.has(token))) {
    return "obiecte-decorative";
  }

  if (inferred === "piese-personalizate" && tokenSet.has("ghiveci")) {
    inferred = "obiecte-decorative";
  }

  return inferred;
}

function imageQualityScore(image) {
  const extensionScore = (EXTENSION_PRIORITY[image.extension] ?? 0) * 20;
  const sizeScore = Math.min(120, Math.round(image.size / 35000));
  const roleBonus = image.role === "overall" ? 30 : image.role === "alternate" ? 15 : 0;
  const variantPenalty = image.variant ? -4 : 0;
  return extensionScore + sizeScore + roleBonus + variantPenalty;
}

function coverScore(image) {
  const roleScore =
    image.role === "overall"
      ? 500
      : image.role === "alternate"
        ? 420
        : image.role === "context"
          ? 360
          : 300;

  return roleScore + imageQualityScore(image);
}

function confidenceScore(images, sourceFolders, hasClearToken) {
  let value = 0.52;
  if (images.length >= 4) {
    value += 0.2;
  } else if (images.length === 3) {
    value += 0.15;
  } else if (images.length === 2) {
    value += 0.1;
  }

  if (sourceFolders.size === 1) {
    value += 0.11;
  }

  if (hasClearToken) {
    value += 0.1;
  }

  const hasOverall = images.some((image) => image.role === "overall");
  if (hasOverall) {
    value += 0.08;
  }

  return Math.min(0.98, Number(value.toFixed(2)));
}

function shouldKeepProductGroup(tokens) {
  return tokens.some((token) => PRODUCT_HINT_TOKENS.has(token));
}

function inferWoodTypes(title) {
  const lower = title.toLowerCase();
  const woodTypes = [];

  if (lower.includes("stejar")) {
    woodTypes.push("Stejar");
  }
  if (lower.includes("cires")) {
    woodTypes.push("Cires");
  }
  if (lower.includes("nuc")) {
    woodTypes.push("Nuc");
  }
  if (lower.includes("frasin")) {
    woodTypes.push("Frasin");
  }
  if (lower.includes("fag")) {
    woodTypes.push("Fag");
  }

  if (!woodTypes.length) {
    return ["Esenta lemnului se stabileste in functie de proiect"];
  }

  return [...woodTypes, "Alternative disponibile la cerere"];
}

const PRODUCT_SIGNATURES = {
  "pat-bogdan": "tablie inalta si cadru masiv cu linii drepte",
  "pat-daniela": "proportii echilibrate intre tablie, laterale si baza",
  "pat-florin": "volum compact cu accent pe structura laterala",
  "pat-mihai": "constructie stabila si front simplu, usor de integrat",
  "blat-stejar-tohanita": "blat din stejar cu fibra continua si muchie evidentiata",
  "masa-artizan-lemn": "blat amplu sustinut de baza sculptata din lamele",
  "masa-ciresu": "masa cu ton cald de cires si baza centrala robusta",
  "masa-coman": "masa de dining prezentata din mai multe unghiuri de executie",
  "masa-cu-banci-h": "set cu masa si banci, construit unitar pentru zona sociala",
  "masa-din-cires": "masa cu nuanta de cires si contur clasic al blatului",
  "masa-din-paleti": "estetica rustica obtinuta din elemente tip palet",
  "masa-lemn-profesionala": "masa compacta de lucru, cu blat gros si baza simpla",
  "biblioteca-bucur": "biblioteca verticala cu module ritmice pentru expunere",
  "raft-tip-montesori": "raft jos de inspiratie Montessori, accesibil pentru copii",
  "bucatarie-rustica-dan":
    "bucatarie rustica cu fronturi clasice si depozitare clara pe module",
  "bucatarie-rustica-eleganta-comandau":
    "bucatarie rustica-eleganta cu compozitie continua pe perete",
  "dulap-de-baie-comandau":
    "dulap de baie cu compartimentare pe inaltime si adancime redusa",
  "dulap-de-baie-dana":
    "corp de baie cu fronturi simple si ergonomie pentru spatii mici",
  "dulap-de-baie-daniela":
    "dulap de baie cu volum curat si zona utila pentru obiecte zilnice",
  "dulap-de-baie-phila": "dulap compact pentru baie, gandit pentru montaj pe perete",
  "dulap-de-baie-ramona":
    "corp de baie prezentat din unghiuri multiple, cu volum echilibrat",
  "riflaj-panou": "panou riflat cu lamele verticale pentru accent arhitectural",
  "riflaj-scara": "riflaj integrat in zona scarii pentru continuitate vizuala",
  "scara-adela": "scara interioara cu trepte masive si traseu compact",
  "scara-bela": "scara cu balustrada si proportii clasice pentru case pe niveluri",
  "scara-bogdan": "scara structurala cu ritm clar al treptelor",
  "scara-lorand":
    "scara cu prezenta puternica, documentata in unghiuri multiple",
  "scara-podul": "scara pentru acces la pod, adaptata spatiilor inguste",
  "foisor-paul":
    "foisor exterior cu structura lemnoasa ampla si acoperire completa",
  "intrare-cu-copertina-moderna": "intrare protejata de copertina, cu linii moderne",
  "intrare-cu-detalii-arhitecturale":
    "intrare cu decoratii lemnoase care marcheaza zona de acces",
  "intrare-cu-element-rustice":
    "intrare cu elemente rustice si textura accentuata a lemnului",
  "intrare-profesionala-casa":
    "intrare principala cu compozitie robusta pentru trafic zilnic",
  "intrare-si-fereastra-eleganta": "ansamblu intrare si fereastra tratat unitar",
  "poarta-stejar-radu": "poarta din stejar cu cadru ranforsat pentru exterior",
  "usa-din-lemn": "usa masiva din lemn, cu panelare traditionala",
  "cartea-in-suport-diagonal":
    "suport diagonal pentru carte, stabil pe birou sau consola",
  "cutie-lemn-detaliata": "cutie mica, cu accent pe imbinari si muchii finisate",
  "cutie-lemn-eleganta":
    "cutie decorativa cu proportii curate si finisaj uniform",
  "cutie-lemn-profesionala":
    "cutie functionala pentru organizare, executata precis",
  "ghiveci-stejar-ania":
    "ghiveci din stejar cu volum geometric si muchii curate",
  "prezentare-suport-telefon":
    "suport de telefon cu inclinare practica pentru vizibilitate",
  "suport-lemn-lustruit":
    "suport compact cu suprafata lustruita si margini rotunjite",
  "bar-rustic-din-lemn":
    "bar rustic din lemn, cu front texturat si blat de servire",
  "dulap-lemn-profesionist":
    "dulap multifunctional cu volum vertical si depozitare utila",
  "tavan-cu-grinzi-ornamentale":
    "tavan cu grinzi ornamentale dispuse ritmic pe intreaga suprafata",
};

const CATEGORY_SIGNATURE_FALLBACK = {
  paturi: "proportii curate si structura stabila pentru dormitor",
  mese: "blat bine proportionat si baza rezistenta pentru utilizare zilnica",
  biblioteci: "modulare clara pentru depozitare si expunere",
  bucatarii: "organizare functionala a corpurilor pe fluxul de lucru",
  "dulapuri-de-baie": "compartimentare compacta pentru spatii cu umiditate",
  riflaje: "lamele verticale care dau ritm si adancime peretelui",
  scari: "proportii sigure intre trepte, urcare si structura",
  "exterior-lemn": "constructie robusta pentru exterior si zone de acces",
  "obiecte-decorative": "executie fina pe piese mici, cu utilitate clara",
  "piese-personalizate": "solutie unicat adaptata unui context specific",
};

function getProductSignature(slug, categorySlug) {
  return (
    PRODUCT_SIGNATURES[slug] ??
    CATEGORY_SIGNATURE_FALLBACK[categorySlug] ??
    "detalii artizanale si proportii echilibrate"
  );
}

function withCount(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function getRoleSummary(roleStats) {
  const parts = [];
  if (roleStats.overall) {
    parts.push(withCount(roleStats.overall, "cadru de ansamblu", "cadre de ansamblu"));
  }
  if (roleStats.alternate) {
    parts.push(withCount(roleStats.alternate, "cadru de unghi", "cadre de unghi"));
  }
  if (roleStats.context) {
    parts.push(withCount(roleStats.context, "cadru de context", "cadre de context"));
  }
  if (roleStats.detail) {
    parts.push(withCount(roleStats.detail, "cadru de detaliu", "cadre de detaliu"));
  }

  return parts.length ? parts.join(", ") : "fara distributie de rol explicita";
}

function buildWoodReference(woodTypes) {
  const firstType = woodTypes[0] ?? "";
  if (!firstType || firstType.toLowerCase().includes("esenta lemnului se stabileste")) {
    return "Esenta lemnului se poate alege la comanda, in functie de nuanta dorita.";
  }

  return `In varianta prezentata domina ${firstType.toLowerCase()}, cu alternative disponibile la cerere.`;
}

function buildGalleryInsight(roleStats, imageCount) {
  if (roleStats.detail > 0 && roleStats.context > 0) {
    return `Setul de ${imageCount} imagini include atat detalii de executie, cat si cadre ambient pentru integrarea in spatiu.`;
  }

  if (roleStats.detail > 0) {
    return `Setul de ${imageCount} imagini include detalii de executie utile pentru evaluarea finisajului si a imbinarilor.`;
  }

  if (roleStats.context > 0) {
    return `Setul de ${imageCount} imagini include cadre ambient care arata integrarea piesei in amenajare.`;
  }

  if (imageCount > 1) {
    return `${imageCount} imagini surprind piesa din unghiuri complementare pentru o evaluare mai clara a volumului.`;
  }

  return "Momentan exista un singur cadru de referinta; recomandam completarea galeriei cu unghiuri suplimentare.";
}

function buildShortDescription({
  title,
  slug,
  category,
  categoryDefinition,
  roleStats,
  imageCount,
}) {
  const signature = getProductSignature(slug, category);
  const galleryLine =
    imageCount > 1
      ? `${imageCount} imagini prezinta modelul din unghiuri relevante.`
      : "Modelul este documentat momentan printr-un singur cadru de referinta.";
  const detailLine =
    roleStats.detail > 0
      ? "Sunt incluse si detalii de executie."
      : "Modelul poate fi extins cu detalii suplimentare la prezentare.";

  return `${title} evidentiaza ${signature}, fiind potrivita pentru ${categoryDefinition.usageLabel}. ${galleryLine} ${detailLine}`;
}

function buildFullDescription({
  title,
  slug,
  category,
  categoryDefinition,
  roleStats,
  imageCount,
  woodTypes,
}) {
  const signature = getProductSignature(slug, category);
  const roleSummary = getRoleSummary(roleStats);
  const woodReference = buildWoodReference(woodTypes);
  const galleryInsight = buildGalleryInsight(roleStats, imageCount);

  const paragraphOne = `${title} pune in evidenta ${signature}. Piesa este dezvoltata ca referinta reala din atelier pentru ${categoryDefinition.usageLabel}.`;
  const paragraphTwo = `Galeria curenta include ${roleSummary}. ${galleryInsight}`;
  const paragraphThree = `${woodReference} Dimensiunile, compartimentarea, finisajul si detaliile constructive se ajusteaza in discutie directa, pe contextul real al proiectului.`;

  return [paragraphOne, paragraphTwo, paragraphThree].join("\n\n");
}

function buildTags(categoryDefinition, roleStats) {
  const tags = ["lemn masiv", "la comanda", "executie premium", categoryDefinition.tag];
  if (roleStats.detail > 0) {
    tags.push("detalii artizanale");
  }

  return [...new Set(tags)];
}

function createTypeScriptFileContent(variableName, typeName, payload, footer) {
  return `import type { ${typeName} } from "@/types/catalog";

export const ${variableName}: ${typeName}[] = ${JSON.stringify(payload, null, 2)};

${footer}
`;
}

async function listImageFiles(rootDirectory) {
  const entries = await fs.readdir(rootDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listImageFiles(absolutePath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      continue;
    }

    const stat = await fs.stat(absolutePath);
    const relativeToSource = path.relative(SOURCE_ROOT, absolutePath);
    const sourceFolder = slugify(relativeToSource.split(path.sep)[0] ?? "diverse");

    files.push({
      absolutePath,
      relativeToSource,
      sourceFolder,
      extension,
      size: stat.size,
      fileName: entry.name,
    });
  }

  return files;
}

async function sha1(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function chooseBetterImage(candidate, current) {
  const candidateScore = imageQualityScore(candidate);
  const currentScore = imageQualityScore(current);
  if (candidateScore !== currentScore) {
    return candidateScore > currentScore;
  }

  if (candidate.extension !== current.extension) {
    return (EXTENSION_PRIORITY[candidate.extension] ?? 0) > (EXTENSION_PRIORITY[current.extension] ?? 0);
  }

  return candidate.size > current.size;
}

async function prepareProductImagesDirectory() {
  await fs.mkdir(TARGET_PRODUCTS_ROOT, { recursive: true });
  const entries = await fs.readdir(TARGET_PRODUCTS_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    await fs.rm(path.join(TARGET_PRODUCTS_ROOT, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

async function buildCatalog() {
  const files = await listImageFiles(SOURCE_ROOT);
  if (!files.length) {
    throw new Error("Nu au fost gasite imagini in folderul sursa.");
  }

  const candidates = [];
  for (const file of files) {
    const baseName = path.parse(file.fileName).name;
    const parsed = parseName(baseName);
    if (!parsed.productKey) {
      continue;
    }

    const role = classifyRole(parsed.tokens, parsed.variant);
    const category = inferCategory(file.sourceFolder, parsed.tokens);

    candidates.push({
      ...file,
      ...parsed,
      role,
      category,
      hash: await sha1(file.absolutePath),
    });
  }

  const groups = new Map();
  for (const candidate of candidates) {
    const existing = groups.get(candidate.productKey);
    if (!existing) {
      groups.set(candidate.productKey, {
        key: candidate.productKey,
        titleVotes: new Map([[candidate.displayTitle, 1]]),
        categoryVotes: new Map([[candidate.category, 1]]),
        images: [candidate],
        sourceFolders: new Set([candidate.sourceFolder]),
        representativeTokens: [...candidate.tokens],
      });
      continue;
    }

    existing.images.push(candidate);
    existing.sourceFolders.add(candidate.sourceFolder);
    existing.titleVotes.set(
      candidate.displayTitle,
      (existing.titleVotes.get(candidate.displayTitle) ?? 0) + (candidate.role === "overall" ? 2 : 1),
    );
    existing.categoryVotes.set(
      candidate.category,
      (existing.categoryVotes.get(candidate.category) ?? 0) + (candidate.role === "overall" ? 2 : 1),
    );

    if (candidate.role === "overall" && candidate.tokens.length >= existing.representativeTokens.length) {
      existing.representativeTokens = [...candidate.tokens];
    }
  }

  await prepareProductImagesDirectory();

  const products = [];
  const sourceMapping = [];
  const slugTracker = new Map();
  let skippedGroups = 0;

  for (const group of groups.values()) {
    if (!shouldKeepProductGroup(group.representativeTokens)) {
      skippedGroups += 1;
      continue;
    }

    const byHash = new Map();
    for (const image of group.images) {
      const current = byHash.get(image.hash);
      if (!current || chooseBetterImage(image, current)) {
        byHash.set(image.hash, image);
      }
    }

    const byFrame = new Map();
    for (const image of byHash.values()) {
      const current = byFrame.get(image.frameKey);
      if (!current || chooseBetterImage(image, current)) {
        byFrame.set(image.frameKey, image);
      }
    }

    const dedupedImages = [...byFrame.values()];
    if (!dedupedImages.length) {
      continue;
    }

    const title = [...group.titleVotes.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "Piesa personalizata";
    const category =
      [...group.categoryVotes.entries()].sort((left, right) => {
        if (left[1] !== right[1]) {
          return right[1] - left[1];
        }
        return CATEGORY_ORDER.indexOf(left[0]) - CATEGORY_ORDER.indexOf(right[0]);
      })[0]?.[0] ?? "piese-personalizate";

    const baseSlug = slugify(title);
    const slugCount = (slugTracker.get(baseSlug) ?? 0) + 1;
    slugTracker.set(baseSlug, slugCount);
    const slug = slugCount === 1 ? baseSlug : `${baseSlug}-${slugCount}`;

    const rankedImages = dedupedImages
      .map((image) => ({
        ...image,
        coverRank: coverScore(image),
      }))
      .sort((left, right) => right.coverRank - left.coverRank);

    const coverImage = rankedImages[0];
    const restImages = rankedImages
      .slice(1)
      .sort((left, right) => {
        const roleDiff = ROLE_ORDER[left.role] - ROLE_ORDER[right.role];
        if (roleDiff !== 0) {
          return roleDiff;
        }
        return right.coverRank - left.coverRank;
      });
    const orderedImages = [coverImage, ...restImages];

    const productFolder = path.join(TARGET_PRODUCTS_ROOT, slug);
    await fs.mkdir(productFolder, { recursive: true });

    const gallery = [];
    for (let index = 0; index < orderedImages.length; index += 1) {
      const image = orderedImages[index];
      const fileName = `imagine-${String(index + 1).padStart(2, "0")}-${ROLE_FILE_LABEL[image.role]}.webp`;
      await sharp(image.absolutePath)
        .rotate()
        .resize({
          width: EXPORT_IMAGE_MAX_WIDTH,
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({
          quality: EXPORT_WEBP_QUALITY,
          effort: 5,
        })
        .toFile(path.join(productFolder, fileName));
      gallery.push(`/images/produse/${slug}/${fileName}`);
    }

    const roleStats = orderedImages.reduce(
      (accumulator, image) => {
        accumulator[image.role] += 1;
        return accumulator;
      },
      { overall: 0, alternate: 0, context: 0, detail: 0 },
    );

    const categoryDefinition = CATEGORY_DEFINITIONS[category];
    const hasClearToken = group.representativeTokens.some((token) =>
      PRODUCT_HINT_TOKENS.has(token),
    );
    const confidence = confidenceScore(orderedImages, group.sourceFolders, hasClearToken);
    const woodTypes = inferWoodTypes(title);

    products.push({
      id: `prod-${slug}`,
      title,
      slug,
      category,
      shortDescription: buildShortDescription({
        title,
        slug,
        category,
        categoryDefinition,
        roleStats,
        imageCount: orderedImages.length,
      }),
      fullDescription: buildFullDescription({
        title,
        slug,
        category,
        categoryDefinition,
        roleStats,
        imageCount: orderedImages.length,
        woodTypes,
      }),
      featuredImage: gallery[0],
      gallery,
      tags: buildTags(categoryDefinition, roleStats),
      woodTypes,
      finishes: categoryDefinition.finishes,
      suitableFor: categoryDefinition.suitableFor,
      isFeatured: false,
    });

    sourceMapping.push({
      title,
      slug,
      category,
      confidence,
      sourceFolders: [...group.sourceFolders].sort(),
      coverSource: coverImage.relativeToSource,
      gallerySources: orderedImages.map((image) => image.relativeToSource),
      roles: orderedImages.map((image, index) => ({
        index,
        role: image.role,
        source: image.relativeToSource,
      })),
    });
  }

  const productCountsByCategory = new Map();
  for (const product of products) {
    productCountsByCategory.set(
      product.category,
      (productCountsByCategory.get(product.category) ?? 0) + 1,
    );
  }

  products.sort((left, right) => {
    const leftRank = CATEGORY_ORDER.indexOf(left.category);
    const rightRank = CATEGORY_ORDER.indexOf(right.category);
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return left.title.localeCompare(right.title);
  });

  const featuredCategorySet = new Set();
  for (const product of products) {
    if (featuredCategorySet.has(product.category)) {
      continue;
    }

    product.isFeatured = true;
    featuredCategorySet.add(product.category);
  }

  const categories = CATEGORY_ORDER.filter((slug) => productCountsByCategory.has(slug)).map((slug) => {
    const categoryDefinition = CATEGORY_DEFINITIONS[slug];
    const categoryProducts = products.filter((product) => product.category === slug);
    return {
      id: `cat-${slug}`,
      name: categoryDefinition.name,
      slug,
      description: categoryDefinition.description,
      image: categoryProducts[0]?.featuredImage ?? "",
      productCount: categoryProducts.length,
    };
  });

  const productsSource = createTypeScriptFileContent(
    "products",
    "CatalogProduct",
    products,
    `export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.category === categorySlug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured);
}`,
  );

  const categoriesSource = createTypeScriptFileContent(
    "categories",
    "CatalogCategory",
    categories,
    `export const categoryMap: Record<string, CatalogCategory> = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<string, CatalogCategory>;

export function getCategoryBySlug(slug: string) {
  return categoryMap[slug];
}`,
  );

  await fs.writeFile(PRODUCTS_FILE, productsSource, "utf8");
  await fs.writeFile(CATEGORIES_FILE, categoriesSource, "utf8");
  await fs.writeFile(MAPPING_FILE, JSON.stringify(sourceMapping, null, 2), "utf8");

  console.log(
    `Catalog rafinat: ${products.length} produse, ${categories.length} categorii, ${skippedGroups} grupuri ambient excluse.`,
  );
}

buildCatalog().catch((error) => {
  console.error("Eroare la generarea catalogului:", error);
  process.exit(1);
});
