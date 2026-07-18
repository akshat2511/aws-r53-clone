import Breadcrumb from "@/components/layout/Breadcrumb";

export default function HealthChecksPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Health checks" }]} />
      <h1 style={{ fontSize: "var(--font-size-xxl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
        Health checks
      </h1>
      <div style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m)",
        padding: "var(--space-xxxl)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-m)" }}>
          Health checks are not available in this demo. In production, you can configure health checks to monitor the health of your resources.
        </p>
      </div>
    </div>
  );
}
