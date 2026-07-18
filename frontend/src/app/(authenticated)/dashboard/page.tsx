"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const [domainName, setDomainName] = useState("");
  const [checkResult, setCheckResult] = useState<{ available: boolean; domain: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheckDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return;

    setChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      // Simple mock check
      const isValid = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domainName);
      if (isValid) {
        // Randomly make it available or not
        const isAvail = Math.random() > 0.3;
        setCheckResult({ available: isAvail, domain: domainName });
      } else {
        setCheckResult({ available: false, domain: domainName });
      }
      setChecking(false);
    }, 800);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Dashboard" }]} />

      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          Route 53 Dashboard 
          <a href="#info" className={styles.titleInfo}>Info</a>
        </h1>
      </div>

      {/* 4 Cards Grid */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>DNS management</h2>
          <p className={styles.cardDescription}>
            A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
          </p>
          <Link href="/hosted-zones" className={styles.pillOutlineBtn}>
            Create hosted zone
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Availability monitoring</h2>
          <p className={styles.cardDescription}>
            Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
          </p>
          <Link href="/health-checks" className={styles.pillOutlineBtn}>
            Create health check
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Traffic management</h2>
          <p className={styles.cardDescription}>
            A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
          </p>
          <Link href="/traffic-policies" className={styles.pillOutlineBtn}>
            Create policy
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Domain registration</h2>
          <p className={styles.cardDescription}>
            A domain is the name, such as example.com, that your users use to access your application.
          </p>
          <a href="#register-domain" className={styles.pillOutlineBtn}>
            Register domain
          </a>
        </div>
      </div>

      {/* Register Domain Section */}
      <section id="register-domain" className={styles.section}>
        <h2 className={styles.sectionTitle}>Register domain</h2>
        <p className={styles.sectionSubtitle}>
          Find and register an available domain, or <a href="#transfer" className={styles.blueLink}>transfer your existing domains</a> to Route 53.
        </p>

        <form onSubmit={handleCheckDomain} className={styles.domainForm}>
          <input
            type="text"
            placeholder="Enter a domain name"
            className={styles.domainInput}
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <p className={styles.domainHelpText}>
            Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
          </p>
          <button type="submit" className={styles.pillOutlineBtn} disabled={checking}>
            {checking ? "Checking..." : "Check"}
          </button>
        </form>

        {checkResult && (
          <div className={checkResult.available ? styles.availAlert : styles.unavailAlert}>
            {checkResult.available ? (
              <span>
                🎉 <strong>{checkResult.domain}</strong> is available! <a href="#buy" className={styles.alertLink}>Add to cart</a>
              </span>
            ) : (
              <span>
                ❌ <strong>{checkResult.domain}</strong> is not available or invalid. Try another domain.
              </span>
            )}
          </div>
        )}
      </section>

      {/* Notifications Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <button className={styles.refreshBtn} onClick={() => alert("Notifications refreshed")} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <div className={styles.tableSearchWrapper}>
              <svg className={styles.tableSearchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Find notifications"
                className={styles.tableSearchInput}
              />
            </div>
            <div className={styles.pagination}>
              <button className={styles.paginationBtn} disabled>&lt;</button>
              <span className={styles.paginationNum}>1</span>
              <button className={styles.paginationBtn} disabled>&gt;</button>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Status</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.emptyRow}>
                <td colSpan={3}>No notifications</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
