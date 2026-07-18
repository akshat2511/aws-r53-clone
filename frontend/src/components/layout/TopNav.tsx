"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import styles from "./TopNav.module.css";

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [accountOpen, setAccountOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setGridOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }

    // Keyboard shortcut for search (Alt+S)
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className={styles.topNav}>
      <div className={styles.left}>
        {/* AWS Logo */}
        <div className={styles.awsLogo} title="AWS Console">
          <img src="/logo.png" alt="AWS Console" className={styles.logoImage} />
        </div>

        {/* Amazon Q Icon */}
        <div className={styles.qIcon} title="Amazon Q">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="4" fill="#6A1B9A" />
            <path d="M12 5C8.13 5 5 8.13 5 12c0 1.63.56 3.12 1.5 4.31l-1.34 2.68c-.14.28.06.61.37.58l2.97-.27C9.53 19.83 10.74 20 12 20c3.87 0 7-3.13 7-7s-3.13-7-7-7zm0 12.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 8.5 12 8.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Service Grid Launcher */}
        <div className={styles.gridContainer} ref={gridRef}>
          <button
            className={`${styles.gridButton} ${gridOpen ? styles.activeButton : ""}`}
            onClick={() => setGridOpen(!gridOpen)}
            aria-label="Services Menu"
            title="Services"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9.5" y="2" width="5" height="5" rx="1" />
              <rect x="17" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9.5" width="5" height="5" rx="1" />
              <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
              <rect x="17" y="9.5" width="5" height="5" rx="1" />
              <rect x="2" y="17" width="5" height="5" rx="1" />
              <rect x="9.5" y="17" width="5" height="5" rx="1" />
              <rect x="17" y="17" width="5" height="5" rx="1" />
            </svg>
          </button>

          {/* Grid Menu Dropdown Panel */}
          {gridOpen && (
            <div className={styles.gridDropdown}>
              <div className={styles.gridLeftCol}>
                <div className={`${styles.gridTab} ${styles.activeTab}`}>Recently visited</div>
                <div className={styles.gridTab}>Favorites</div>
                <div className={styles.gridTab}>All applications</div>
                <div className={styles.gridTab}>All services</div>
                <div className={styles.gridDivider}></div>
                <div className={styles.categoryHeader}>Categories</div>
                <div className={styles.gridTab}>Analytics</div>
                <div className={styles.gridTab}>Application Integration</div>
                <div className={styles.gridTab}>Blockchain</div>
                <div className={styles.gridTab}>Business Applications</div>
                <div className={styles.gridTab}>Cloud Financial Management</div>
                <div className={styles.gridTab}>Compute</div>
                <div className={styles.gridTab}>Containers</div>
                <div className={styles.gridTab}>Database</div>
              </div>
              <div className={styles.gridRightCol}>
                <div className={styles.gridRightHeader}>
                  <span>Recently visited</span>
                  <button className={styles.gridCloseBtn} onClick={() => setGridOpen(false)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className={styles.gridServicesList}>
                  <a href="/dashboard" className={styles.gridServiceItem}>
                    <div className={styles.serviceItemTitle}>Route 53</div>
                    <div className={styles.serviceItemDesc}>Scalable DNS and Domain Name Registration</div>
                  </a>
                  <div className={styles.gridServiceItem}>
                    <div className={styles.serviceItemTitle}>Console Home</div>
                    <div className={styles.serviceItemDesc}>View resource insights, service shortcuts, and feature updates</div>
                  </div>
                  <div className={styles.gridServiceItem}>
                    <div className={styles.serviceItemTitle}>Billing and Cost Management</div>
                    <div className={styles.serviceItemDesc}>View and pay bills, analyze and govern your spending</div>
                  </div>
                  <div className={styles.gridServiceItem}>
                    <div className={styles.serviceItemTitle}>Service Quotas</div>
                    <div className={styles.serviceItemDesc}>View and manage your AWS service quotas from a central location</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <span className={styles.searchShortcut}>[Alt+S]</span>
        </div>
      </div>

      <div className={styles.right}>
        {/* CloudShell Icon */}
        <button className={styles.iconButton} title="CloudShell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </button>

        {/* Notification Bell */}
        <button className={styles.iconButton} title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Help */}
        <button className={styles.iconButton} title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        {/* Settings / Gear */}
        <div className={styles.settingsContainer} ref={settingsRef}>
          <button
            className={`${styles.iconButton} ${settingsOpen ? styles.activeButton : ""}`}
            title="Settings"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className={styles.settingsDropdown}>
              <div className={styles.settingsHeader}>Current user settings</div>
              <div className={styles.settingsDivider}></div>

              <div className={styles.settingsGroup}>
                <div className={styles.settingsLabel}>Language</div>
                <select className={styles.settingsSelect} defaultValue="en-US">
                  <option value="en-US">English (US)</option>
                </select>
              </div>

              <div className={styles.settingsGroup}>
                <div className={styles.settingsLabel}>Visual mode - <span style={{ fontStyle: 'italic' }}>beta</span></div>



                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="visual-mode"
                    value="light"
                    checked={theme === "light"}
                    onChange={() => setTheme("light")}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioCheckmark}></span>
                  Light
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="visual-mode"
                    value="dark"
                    checked={theme === "dark"}
                    onChange={() => setTheme("dark")}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioCheckmark}></span>
                  Dark
                </label>
              </div>

              <div className={styles.settingsDivider}></div>

              <div className={styles.settingsFooter}>
                <a href="#settings" className={styles.settingsFooterLink}>See all user settings</a>
                <div className={styles.experimentalLink}>
                  AWS experimental preview
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
                    <path d="M10 2v7.586l-4.707 4.707A2 2 0 0 0 5 15.707V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.293a2 2 0 0 0-.586-1.414L14 9.586V2h-4z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Region Selector */}
        <div className={styles.regionContainer} ref={regionRef}>
          <button
            className={styles.regionButton}
            onClick={() => setRegionOpen(!regionOpen)}
          >
            Global
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          {regionOpen && (
            <div className={styles.regionDropdown}>
              <div className={styles.regionHeader}>Global Services</div>
              <div className={styles.regionItemActive}>Global (Route 53, IAM, CloudFront)</div>
              <div className={styles.regionDivider}></div>
              <div className={styles.regionDisabledItem}>US East (N. Virginia)</div>
              <div className={styles.regionDisabledItem}>US West (Oregon)</div>
              <div className={styles.regionDisabledItem}>EU (Ireland)</div>
              <div className={styles.regionNote}>Note: Route 53 is a global service and does not require region selection.</div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        {user && (
          <div className={styles.accountMenu} ref={dropdownRef}>
            <button
              className={`${styles.accountButton} ${accountOpen ? styles.activeButton : ""}`}
              onClick={() => setAccountOpen(!accountOpen)}
            >
              <span className={styles.statusDot}></span>
              <span className={styles.username}>{user.display_name || user.email.split("@")[0]}</span>
              <span className={styles.accountSuffix}>({user.account_id || "368205402780"})</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>

            {accountOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownInfoRow}>
                  <div>
                    <div className={styles.dropdownLabel}>Account ID</div>
                    <div className={styles.dropdownValue}>{user.account_id || "3682-0540-2780"}</div>
                  </div>
                  <button className={styles.copyBtn} title="Copy" onClick={() => navigator.clipboard.writeText(user.account_id || "3682-0540-2780")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>

                <div className={styles.dropdownInfoRow}>
                  <div>
                    <div className={styles.dropdownLabel}>Account name</div>
                    <div className={styles.dropdownValue}>{user.display_name || user.email.split("@")[0] || "akshat2511"}</div>
                  </div>
                  <button className={styles.copyBtn} title="Copy" onClick={() => navigator.clipboard.writeText(user.display_name || "akshat2511")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>

                <div className={styles.dropdownInfoRow}>
                  <div>
                    <div className={styles.dropdownLabel}>Account color</div>
                    <div className={styles.colorIndicator}>
                      <span className={styles.tealDot}></span>
                      Teal
                    </div>
                  </div>
                </div>

                <div className={styles.dropdownDivider}></div>

                <div className={styles.dropdownItemsList}>
                  <a href="#account" className={styles.dropdownItem}>Account</a>
                  <a href="#organization" className={styles.dropdownItem}>Organization</a>
                  <a href="#quotas" className={styles.dropdownItem}>Service Quotas</a>
                  <a href="#billing" className={styles.dropdownItem}>Billing and Cost Management</a>
                  <a href="#credentials" className={styles.dropdownItem}>Security credentials</a>
                  <a href="#mobile" className={styles.dropdownItem}>Console Mobile App</a>
                  <a href="#toolkit" className={styles.dropdownItem}>Agent Toolkit for AWS</a>
                </div>

                <div className={styles.dropdownDivider}></div>

                <div className={styles.dropdownActions}>
                  <button className={styles.pillButton}>Turn on multi-session support</button>
                  <button className={styles.signOutButton} onClick={handleLogout}>Sign out</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
