import { motion } from "motion/react";

export const SkeletonLoader = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);
