import Breadcrumb from "@/components/layout/Breadcrumb";

export default function ProfilesPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Profiles" }]} />
      <h1 style={{ fontSize: "var(--font-size-xxl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
        Profiles
      </h1>
      <div style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m)",
        padding: "var(--space-xxxl)",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-m)" }}>
          Route 53 Profiles are not available in this demo. In production, you can manage DNS Firewall rule groups and Resolver configurations.
        </p>
      </div>
    </div>
  );
}
