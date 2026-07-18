"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "./Sidebar.module.css";

interface GroupState {
  globalResolver: boolean;
  vpcResolver: boolean;
  domains: boolean;
  ipRouting: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupState>({
    globalResolver: true,
    vpcResolver: true,
    domains: true,
    ipRouting: true,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCurrentFeature(params.get("feature"));
    }
  }, [pathname]);

  const toggleGroup = (group: keyof GroupState) => {
    setGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const isActive = (href: string, featureLabel?: string) => {
    if (featureLabel && pathname === "/coming-soon") {
      return currentFeature === featureLabel;
    }
    return pathname.startsWith(href) && href !== "/coming-soon";
  };

  if (collapsed) return null;

  return (
    <aside className={styles.sidebar}>
      {/* Sidebar Header */}
      <div className={styles.header}>
        <span className={styles.title}>Route 53</span>
        <button 
          className={styles.collapseBtn}
          onClick={() => setCollapsed(true)}
          title="Collapse navigation"
          aria-label="Collapse navigation"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <nav className={styles.nav}>
        {/* Core Links */}
        <Link href="/dashboard" className={`${styles.navItem} ${isActive("/dashboard") ? styles.active : ""}`}>
          <span className={styles.label}>Dashboard</span>
        </Link>
        <Link href="/hosted-zones" className={`${styles.navItem} ${isActive("/hosted-zones") ? styles.active : ""}`}>
          <span className={styles.label}>Hosted zones</span>
        </Link>
        <Link href="/health-checks" className={`${styles.navItem} ${isActive("/health-checks") ? styles.active : ""}`}>
          <span className={styles.label}>Health checks</span>
        </Link>
        <Link href="/profiles" className={`${styles.navItem} ${isActive("/profiles") ? styles.active : ""}`}>
          <span className={styles.label}>Profiles</span>
        </Link>

        {/* Global Resolver Group */}
        <div className={styles.group}>
          <button className={styles.groupHeader} onClick={() => toggleGroup("globalResolver")}>
            <span className={styles.chevron}>
              {groups.globalResolver ? "▼" : "►"}
            </span>
            Global Resolver
          </button>
          {groups.globalResolver && (
            <div className={styles.groupItems}>
              <Link href="/coming-soon?feature=Global%20resolvers" className={`${styles.groupItem} ${isActive("/coming-soon", "Global resolvers") ? styles.active : ""}`}>
                <span className={styles.label}>Global resolvers</span>
                <span className={styles.newBadge}>New</span>
              </Link>
              <Link href="/coming-soon?feature=Shared%20DNS%20views" className={`${styles.groupItem} ${isActive("/coming-soon", "Shared DNS views") ? styles.active : ""}`}>
                <span className={styles.label}>Shared DNS views</span>
                <span className={styles.newBadge}>New</span>
              </Link>
            </div>
          )}
        </div>

        {/* VPC Resolver Group */}
        <div className={styles.group}>
          <button className={styles.groupHeader} onClick={() => toggleGroup("vpcResolver")}>
            <span className={styles.chevron}>
              {groups.vpcResolver ? "▼" : "►"}
            </span>
            VPC Resolver
          </button>
          {groups.vpcResolver && (
            <div className={styles.groupItems}>
              <Link href="/coming-soon?feature=VPCs" className={`${styles.groupItem} ${isActive("/coming-soon", "VPCs") ? styles.active : ""}`}>
                VPCs
              </Link>
              <Link href="/coming-soon?feature=Inbound%20endpoints" className={`${styles.groupItem} ${isActive("/coming-soon", "Inbound endpoints") ? styles.active : ""}`}>
                Inbound endpoints
              </Link>
              <Link href="/coming-soon?feature=Outbound%20endpoints" className={`${styles.groupItem} ${isActive("/coming-soon", "Outbound endpoints") ? styles.active : ""}`}>
                Outbound endpoints
              </Link>
              <Link href="/coming-soon?feature=Rules" className={`${styles.groupItem} ${isActive("/coming-soon", "Rules") ? styles.active : ""}`}>
                Rules
              </Link>
              <Link href="/coming-soon?feature=Query%20logging" className={`${styles.groupItem} ${isActive("/coming-soon", "Query logging") ? styles.active : ""}`}>
                Query logging
              </Link>
              <Link href="/coming-soon?feature=Outposts" className={`${styles.groupItem} ${isActive("/coming-soon", "Outposts") ? styles.active : ""}`}>
                Outposts
              </Link>
            </div>
          )}
        </div>

        {/* Domains Group */}
        <div className={styles.group}>
          <button className={styles.groupHeader} onClick={() => toggleGroup("domains")}>
            <span className={styles.chevron}>
              {groups.domains ? "▼" : "►"}
            </span>
            Domains
          </button>
          {groups.domains && (
            <div className={styles.groupItems}>
              <Link href="/coming-soon?feature=Registered%20domains" className={`${styles.groupItem} ${isActive("/coming-soon", "Registered domains") ? styles.active : ""}`}>
                Registered domains
              </Link>
              <Link href="/coming-soon?feature=Requests" className={`${styles.groupItem} ${isActive("/coming-soon", "Requests") ? styles.active : ""}`}>
                Requests
              </Link>
            </div>
          )}
        </div>

        {/* IP-based routing Group */}
        <div className={styles.group}>
          <button className={styles.groupHeader} onClick={() => toggleGroup("ipRouting")}>
            <span className={styles.chevron}>
              {groups.ipRouting ? "▼" : "►"}
            </span>
            IP-based routing
          </button>
          {groups.ipRouting && (
            <div className={styles.groupItems}>
              <Link href="/coming-soon?feature=CIDR%20collections" className={`${styles.groupItem} ${isActive("/coming-soon", "CIDR collections") ? styles.active : ""}`}>
                CIDR collections
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
