import { NextResponse } from "next/server";
import { isAdminSessionValidFromRequest } from "@/lib/admin/auth";
import { getProductImagesBucketName } from "@/lib/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILES_PER_REQUEST = 12;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

type UploadedProductImage = {
  name: string;
  path: string;
  publicUrl: string;
  size: number;
  type: string;
};

function sanitizeFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const extension = dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
  const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;

  const safeBase = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeBase || "imagine"}${extension}`;
}

function getFileExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex < 0) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

function isAllowedImage(file: File) {
  if (ALLOWED_MIME_TYPES.has(file.type)) {
    return true;
  }

  const extension = getFileExtension(file.name);
  if (!extension) {
    return false;
  }

  return ALLOWED_EXTENSIONS.has(extension);
}

function buildStoragePath(fileName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${now.getUTCDate()}`.padStart(2, "0");
  const safeName = sanitizeFileName(fileName);
  const randomToken = crypto.randomUUID().slice(0, 8);

  return `produse/${year}/${month}/${day}/${randomToken}-${safeName}`;
}

function isBucketAlreadyExistsError(error: unknown) {
  const message = (error as { message?: string } | undefined)?.message ?? "";
  return /already exists|duplicate/i.test(message);
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  const message = (error as { message?: string } | undefined)?.message;
  if (message && message.trim()) {
    return message;
  }

  return fallbackMessage;
}

async function ensureBucketExists(
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>,
  bucketName: string,
) {
  const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(
    bucketName,
  );

  if (!bucketError && bucketData) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: `${Math.floor(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB`,
    allowedMimeTypes: Array.from(ALLOWED_MIME_TYPES),
  });

  if (createError && !isBucketAlreadyExistsError(createError)) {
    throw new Error(
      getErrorMessage(
        createError,
        "Nu am putut crea bucket-ul pentru imaginile produselor.",
      ),
    );
  }
}

async function cleanupUploadedFiles(
  supabase: ReturnType<typeof createSupabaseServiceRoleClient>,
  bucketName: string,
  paths: string[],
) {
  if (!paths.length) {
    return;
  }

  try {
    await supabase.storage.from(bucketName).remove(paths);
  } catch (error) {
    console.error("Nu s-a putut face cleanup pentru imaginile deja incarcate.", error);
  }
}

export async function POST(request: Request) {
  if (!isAdminSessionValidFromRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Neautorizat.",
      },
      { status: 401 },
    );
  }

  const supabase = createSupabaseServiceRoleClient();
  const bucketName = getProductImagesBucketName();
  const uploadedFiles: UploadedProductImage[] = [];

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Selecteaza cel putin o imagine pentru upload.",
        },
        { status: 400 },
      );
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        {
          success: false,
          message: `Poti incarca maximum ${MAX_FILES_PER_REQUEST} imagini odata.`,
        },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message: `Fisierul "${file.name}" depaseste limita de 8 MB.`,
          },
          { status: 400 },
        );
      }

      if (!isAllowedImage(file)) {
        return NextResponse.json(
          {
            success: false,
            message: `Fisierul "${file.name}" nu este intr-un format acceptat (JPG, PNG, WEBP, AVIF, GIF).`,
          },
          { status: 400 },
        );
      }
    }

    await ensureBucketExists(supabase, bucketName);

    for (const file of files) {
      const storagePath = buildStoragePath(file.name);
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          contentType: file.type || undefined,
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) {
        await cleanupUploadedFiles(
          supabase,
          bucketName,
          uploadedFiles.map((item) => item.path),
        );

        return NextResponse.json(
          {
            success: false,
            message: `Upload-ul pentru "${file.name}" a esuat.`,
          },
          { status: 500 },
        );
      }

      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      uploadedFiles.push({
        name: file.name,
        path: storagePath,
        publicUrl: publicData.publicUrl,
        size: file.size,
        type: file.type || "application/octet-stream",
      });
    }

    return NextResponse.json({
      success: true,
      bucket: bucketName,
      files: uploadedFiles,
    });
  } catch (error) {
    if (uploadedFiles.length) {
      await cleanupUploadedFiles(
        supabase,
        bucketName,
        uploadedFiles.map((item) => item.path),
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(
          error,
          "Imaginile nu au putut fi incarcate momentan. Incearca din nou.",
        ),
      },
      { status: 500 },
    );
  }
}
