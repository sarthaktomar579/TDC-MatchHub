import { getCustomerById } from '@/lib/dataAccess';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PotentialMatches from '@/components/PotentialMatches';

export async function generateMetadata({ params }) {
  const p = await params;
  const customer = getCustomerById(p.id);
  return {
    title: customer ? `${customer.firstName} ${customer.lastName} | TDC MatchHub` : "Customer Not Found",
  };
}

export default async function CustomerDetail({ params }) {
  const p = await params;
  const customer = getCustomerById(p.id);

  if (!customer) {
    redirect('/dashboard');
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "New Lead": return "badge-blue";
      case "In Discussion": return "badge-yellow";
      case "Meeting Scheduled": return "badge-yellow";
      case "Profile Sent": return "badge-green";
      case "Active Searching": return "badge-gray";
      default: return "badge-gray";
    }
  };

  return (
    <div>
      <header style={{ backgroundColor: "white", borderBottom: "1px solid var(--border-color)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/dashboard" className="btn btn-secondary" style={{ padding: "0.25rem 0.75rem" }}>
              &larr; Back
            </Link>
            <h1 style={{ fontSize: "1.25rem", color: "var(--primary)" }}>TDC MatchHub</h1>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        {/* Left Column: Full Biodata */}
        <div>
          <div className="card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{customer.firstName} {customer.lastName}</h1>
                <p style={{ color: "var(--text-secondary)" }}>{customer.email} • {customer.phoneNumber}</p>
              </div>
              <span className={`badge ${getStatusColor(customer.statusTag)}`} style={{ fontSize: "1rem", padding: "0.25rem 1rem" }}>
                {customer.statusTag}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <Section title="Basic Info">
                <Field label="Gender" value={customer.gender} />
                <Field label="Age" value={customer.age} />
                <Field label="Date of Birth" value={customer.dateOfBirth} />
                <Field label="Height" value={customer.height} />
                <Field label="Location" value={`${customer.city}, ${customer.country}`} />
                <Field label="Marital Status" value={customer.maritalStatus} />
              </Section>

              <Section title="Education & Career">
                <Field label="College" value={customer.undergraduateCollege} />
                <Field label="Degree" value={customer.degree} />
                <Field label="Company" value={customer.currentCompany} />
                <Field label="Designation" value={customer.designation} />
                <Field label="Income" value={`₹${customer.income.toLocaleString()}`} />
              </Section>

              <Section title="Background & Lifestyle">
                <Field label="Religion" value={customer.religion} />
                <Field label="Caste" value={customer.caste} />
                <Field label="Languages" value={customer.languagesKnown.join(", ")} />
                <Field label="Diet" value={customer.diet} />
                <Field label="Drinking" value={customer.drinking} />
                <Field label="Smoking" value={customer.smoking} />
              </Section>

              <Section title="Preferences & Family">
                <Field label="Siblings" value={customer.siblings} />
                <Field label="Want Kids" value={customer.wantKids} />
                <Field label="Open to Relocate" value={customer.openToRelocate} />
                <Field label="Open to Pets" value={customer.openToPets} />
              </Section>
            </div>
          </div>
        </div>

        {/* Right Column: Matchmaking Actions */}
        <div>
          <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem", backgroundColor: "#f8fafc" }}>
            <h3 style={{ marginBottom: "1rem" }}>Journey Notes</h3>
            <textarea 
              className="input-field" 
              style={{ width: "100%", minHeight: "150px", resize: "vertical" }}
              placeholder="Record quick notes from meetings or calls here..."
              defaultValue="Initial consultation completed. Looking for someone with similar professional ambition and diet preferences."
            ></textarea>
            <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem" }}>Save Notes</button>
          </div>

          <PotentialMatches customerId={customer.id} />
        </div>

      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{label}</span>
      <span style={{ fontWeight: "500", fontSize: "0.875rem", textAlign: "right" }}>{value || "-"}</span>
    </div>
  );
}
