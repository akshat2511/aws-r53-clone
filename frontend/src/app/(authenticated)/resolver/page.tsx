import Breadcrumb from "@/components/layout/Breadcrumb";

export default function ResolverPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Resolver" }]} />
      <h1 style={{ fontSize: "var(--font-size-xxl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
        Resolver
      </h1>
      <div style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m)",
        padding: "var(--space-xxxl)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-m)" }}>
          Route 53 Resolver is not available in this demo. In production, you can configure DNS resolution for your VPC and on-premises networks.
        </p>
      </div>
    </div>
  );
}
