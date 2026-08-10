"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureMarketingAttributionFromLocation } from "@/lib/client-marketing-attribution";

export function MarketingAttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? "";

  useEffect(() => {
    captureMarketingAttributionFromLocation();
  }, [pathname, queryString]);

  return null;
}
