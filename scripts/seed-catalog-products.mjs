import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const TABLE_NAME = "catalog_products";
const CHUNK_SIZE = 50;

function parseEnvFile(rawValue) {
  const env = {};
  const lines = rawValue.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();

    if (!key) {
      continue;
    }

    env[key] = value.replace(/^['"]|['"]$/g, "");
  }

  return env;
}

async function loadEnvFromDotEnv(dotEnvPath) {
  try {
    const file = await fs.readFile(dotEnvPath, "utf8");
    const parsed = parseEnvFile(file);

    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : "";
    if (code !== "ENOENT") {
      throw error;
    }
  }
}

function getRequiredEnvVar(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Lipseste variabila de mediu obligatorie: ${name}`);
  }
  return value;
}

function extractProductsArray(tsSource) {
  const exportIndex = tsSource.indexOf("export const products");
  if (exportIndex === -1) {
    throw new Error("Nu am gasit exportul products in data/products.ts.");
  }

  const equalsIndex = tsSource.indexOf("=", exportIndex);
  const arrayStart = tsSource.indexOf("[", equalsIndex);
  const arrayEnd = tsSource.indexOf("];", arrayStart);

  if (equalsIndex === -1 || arrayStart === -1 || arrayEnd === -1) {
    throw new Error("Nu am putut extrage array-ul products din data/products.ts.");
  }

  const jsonArray = tsSource.slice(arrayStart, arrayEnd + 1);
  return JSON.parse(jsonArray);
}

function toDbRow(product) {
  return {
    title: product.title,
    slug: product.slug,
    category: product.category,
    short_description: product.shortDescription,
    full_description: product.fullDescription,
    featured_image: product.featuredImage,
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    wood_types: Array.isArray(product.woodTypes) ? product.woodTypes : [],
    finishes: Array.isArray(product.finishes) ? product.finishes : [],
    suitable_for: Array.isArray(product.suitableFor) ? product.suitableFor : [],
    is_featured: Boolean(product.isFeatured),
    status: "activ",
  };
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function assertUniqueSlugs(products) {
  const seen = new Set();
  for (const product of products) {
    const slug = product.slug?.trim();
    if (!slug) {
      throw new Error(`Produs fara slug: ${product.title ?? "fara titlu"}`);
    }

    if (seen.has(slug)) {
      throw new Error(`Slug duplicat detectat in seed: ${slug}`);
    }

    seen.add(slug);
  }
}

async function run() {
  const appRoot = process.cwd();
  const dotEnvPath = path.join(appRoot, ".env.local");
  const productsPath = path.join(appRoot, "data", "products.ts");
  const dryRun = process.argv.includes("--dry-run");

  await loadEnvFromDotEnv(dotEnvPath);

  const supabaseUrl = getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  const productsSource = await fs.readFile(productsPath, "utf8");
  const products = extractProductsArray(productsSource);

  assertUniqueSlugs(products);
  const rows = products.map(toDbRow);

  console.log(`Pregatit seed pentru ${rows.length} produse.`);
  if (dryRun) {
    console.log("Mod dry-run activ: nu se scrie in Supabase.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const chunks = chunkArray(rows, CHUNK_SIZE);
  for (let index = 0; index < chunks.length; index += 1) {
    const batch = chunks[index];
    const { error } = await supabase.from(TABLE_NAME).upsert(batch, {
      onConflict: "slug",
      ignoreDuplicates: false,
    });

    if (error) {
      throw new Error(
        `Eroare upsert batch ${index + 1}/${chunks.length}: ${error.message}`,
      );
    }

    console.log(
      `Batch ${index + 1}/${chunks.length} sincronizat (${batch.length} produse).`,
    );
  }

  const { count: totalCount, error: totalError } = await supabase
    .from(TABLE_NAME)
    .select("id", { count: "exact", head: true });

  if (totalError) {
    throw new Error(`Nu am putut citi totalul din ${TABLE_NAME}: ${totalError.message}`);
  }

  const { count: activeCount, error: activeError } = await supabase
    .from(TABLE_NAME)
    .select("id", { count: "exact", head: true })
    .eq("status", "activ");

  if (activeError) {
    throw new Error(`Nu am putut citi totalul activ din ${TABLE_NAME}: ${activeError.message}`);
  }

  console.log(
    `Seed finalizat. ${TABLE_NAME}: total=${totalCount ?? 0}, activ=${activeCount ?? 0}.`,
  );
}

run().catch((error) => {
  console.error("Seed catalog esuat:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
