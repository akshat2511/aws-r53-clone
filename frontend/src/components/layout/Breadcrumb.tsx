"use client";

import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className={styles.breadcrumbWrapper}>
      <div className={styles.left}>
        <button
          className={styles.hamburgerButton}
          onClick={toggleSidebar}
          aria-label="Toggle Navigation"
          title="Toggle Navigation"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="5" x2="15" y2="5" />
            <line x1="3" y1="9" x2="15" y2="9" />
            <line x1="3" y1="13" x2="15" y2="13" />
          </svg>
        </button>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          {items.map((item, index) => (
            <span key={index} className={styles.item}>
              {index > 0 && <span className={styles.separator}>&gt;</span>}
              {item.href ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <a href="#info" className={styles.infoLink} title="Info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </a>
    </div>
  );
}
