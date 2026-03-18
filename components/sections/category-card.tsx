"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HomeCategoryItem } from "@/types/homepage";

type CategoryCardProps = {
  item: HomeCategoryItem;
};

export function CategoryCard({ item }: CategoryCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
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

      <div className="space-y-3 p-5">
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
