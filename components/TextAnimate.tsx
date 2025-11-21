"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextAnimateProps {
  children: string;
  className?: string;
  animation?: "blurIn" | "fadeIn" | "slideUp";
  as?: "h1" | "h2" | "h3" | "p" | "div";
  style?: React.CSSProperties;
}

const animations: Record<string, Variants> = {
  blurIn: {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
};

export function TextAnimate({
  children,
  className,
  animation = "blurIn",
  as: Component = "div",
  style,
}: TextAnimateProps) {
  const MotionComponent = motion[Component as keyof typeof motion] as React.ComponentType<any>;

  // Split text by newlines and render with <br/> tags
  const lines = children.split('\n');

  return (
    <MotionComponent
      className={cn(className)}
      style={style}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      variants={animations[animation]}
    >
      {lines.map((line, index) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </MotionComponent>
  );
}
