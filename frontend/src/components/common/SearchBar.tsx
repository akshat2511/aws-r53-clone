"use client";

import { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search" }: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(timer);
  }, [local, value, onChange]);

  return (
    <div className={styles.searchBar}>
      <svg className={styles.icon} width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <input
        type="text"
        className={styles.input}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      {local && (
        <button className={styles.clear} onClick={() => { setLocal(""); onChange(""); }}>
          &#x2715;
        </button>
      )}
    </div>
  );
}
