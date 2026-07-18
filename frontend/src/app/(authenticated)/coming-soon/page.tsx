"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "Feature";

  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: feature }]} />
      
      <h1 style={{ fontSize: "var(--font-size-xxl)", fontWeight: 700, marginBottom: "var(--space-m)", color: "var(--color-text-primary)" }}>
        {feature}
      </h1>
      
      <div style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-s)",
        padding: "var(--space-xxxl)",
        textAlign: "center",
      }}>
        <h3 style={{ fontSize: "var(--font-size-l)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "var(--space-s)" }}>
          Feature Coming Soon
        </h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-m)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          The <strong>{feature}</strong> feature is currently not implemented in this AWS Route 53 clone. In the real AWS Console, this section allows you to configure advanced routing policies, DNS resolvers, and register domain names.
        </p>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={
      <div style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "var(--space-xxxl)" }}>
        Loading...
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
