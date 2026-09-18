import Image from "next/image";
import type { HTMLAttributes } from "react";
import styles from "./landing.module.css";

type PortraitAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type PortraitCardProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  image: PortraitAsset;
  sizes: string;
  variant: "hero" | "method" | "proof" | "about";
  priority?: boolean;
  identity?: {
    name: string;
    role: string;
  };
  href?: string;
  linkLabel?: string;
};

export function PortraitCard({
  image,
  sizes,
  variant,
  priority = false,
  identity,
  href,
  linkLabel,
  className = "",
  ...props
}: PortraitCardProps) {
  const variantClasses = {
    hero: styles.portraitCardHero,
    method: styles.portraitCardMethod,
    proof: styles.portraitCardProof,
    about: styles.portraitCardAbout,
  } as const;

  return (
    <div
      className={`${styles.portraitCard} ${variantClasses[variant]} ${className}`}
      data-portrait-card={variant}
      {...props}
    >
      <div className={styles.portraitCardMedia}>
        <Image
          className={styles.portraitCardImage}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : undefined}
        />
      </div>
      {href && linkLabel ? (
        <a className={styles.portraitCardArrow} href={href} aria-label={linkLabel}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      ) : null}
      {identity ? (
        <div className={styles.portraitCardIdentity}>
          <strong>{identity.name}</strong>
          <span>{identity.role}</span>
        </div>
      ) : null}
    </div>
  );
}
