"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { RepresentativePiece } from "@/types/homepage";

type RepresentativeProductCardProps = {
  item: RepresentativePiece;
};

export function RepresentativeProductCard({
  item,
}: RepresentativeProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group luxury-card h-full overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <span className="inline-flex rounded-full border border-sand-300 bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-wood-700">
          {item.tag}
        </span>
        <h3 className="text-3xl">{item.title}</h3>
        <p className="text-sm text-wood-700">{item.description}</p>
        <Link
          href={item.href}
          className="inline-flex text-sm font-semibold text-wood-900 transition-colors hover:text-moss-600"
        >
          Descopera
        </Link>
      </div>
    </motion.article>
  );
}
