"use client";

import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import FlashBar from "./FlashBar";
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className={styles.shell}>
      <TopNav />
      {collapsed && (
        <button 
          className={styles.expandSidebarTab} 
          onClick={() => setCollapsed(false)}
          title="Expand navigation"
          aria-label="Expand navigation"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
      <Sidebar />
      <main className={`${styles.main} ${collapsed ? styles.collapsed : ""}`}>
        <FlashBar />
        <div className={styles.content}>{children}</div>
      </main>

      {/* AWS Console Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <button className={styles.footerItem}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            CloudShell
          </button>
          <span className={styles.footerSeparator}>|</span>
          <button className={styles.footerItem}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Agent Toolkit for AWS
          </button>
          <span className={styles.footerSeparator}>|</span>
          <button className={styles.footerItem}>Feedback</button>
          <span className={styles.footerSeparator}>|</span>
          <button className={styles.footerItem}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.footerIcon}>
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            Console Mobile App
          </button>
        </div>
        <div className={styles.footerRight}>
          <span className={styles.copyright}>© 2026, Amazon Web Services, Inc. or its affiliates.</span>
          <a href="#privacy" className={styles.footerLink}>Privacy</a>
          <a href="#terms" className={styles.footerLink}>Terms</a>
          <a href="#cookies" className={styles.footerLink}>Cookie preferences</a>
        </div>
      </footer>
    </div>
  );
}
