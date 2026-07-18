import Breadcrumb from "@/components/layout/Breadcrumb";

export default function TrafficPoliciesPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Traffic policies" }]} />
      <h1 style={{ fontSize: "var(--font-size-xxl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
        Traffic policies
      </h1>
      <div style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m)",
        padding: "var(--space-xxxl)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-m)" }}>
          Traffic policies are not available in this demo. In production, you can create traffic policies to route DNS traffic based on multiple criteria.
        </p>
      </div>
    </div>
  );
}
