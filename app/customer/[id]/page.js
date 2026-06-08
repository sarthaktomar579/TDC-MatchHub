import { getCustomerById } from '@/lib/dataAccess';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PotentialMatches from '@/components/PotentialMatches';

export async function generateMetadata({ params }) {
  const p = await params;
  const customer = getCustomerById(p.id);
  return {
    title: customer ? `${customer.firstName} ${customer.lastName} | MatchHub` : "Customer Not Found",
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
      <header style={{ 
        background: "rgba(255, 255, 255, 0.7)", 
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.5)", 
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/dashboard" className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.5rem" }}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </Link>
            <h1 style={{ fontSize: "1.25rem", color: "var(--primary)" }}>MatchHub</h1>
          </div>
        </div>
      </header>

      {/* Abstract Cover Photo Area */}
      <div style={{ 
        height: "180px", 
        width: "100%", 
        backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-color), transparent)" }}></div>
      </div>

      <main className="container animate-fade-in" style={{ padding: "0 1.5rem 4rem 1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginTop: "-60px", position: "relative", zIndex: 10 }}>
        
        {/* Header Card */}
        <div className="card" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ 
              width: "80px", height: "80px", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, var(--primary), var(--secondary))", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              color: "white", fontSize: "2.5rem", fontWeight: "700",
              boxShadow: "var(--shadow-glow)"
            }}>
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <div>
              <h1 style={{ fontSize: "2.25rem", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>{customer.firstName} {customer.lastName}</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>{customer.designation} at {customer.currentCompany}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "0.75rem" }}>
              <span className={`badge ${getStatusColor(customer.statusTag)}`} style={{ fontSize: "1rem", padding: "0.4rem 1.25rem" }}>
                {customer.statusTag}
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{customer.email} • {customer.phoneNumber}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          
          {/* Left Column: Full Biodata */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="card stagger-1" style={{ padding: "2rem" }}>
              <Section title="Basic Information">
                <Field label="Gender" value={customer.gender} />
                <Field label="Age" value={`${customer.age} years`} />
                <Field label="Date of Birth" value={customer.dateOfBirth} />
                <Field label="Height" value={customer.height} />
                <Field label="Location" value={`${customer.city}, ${customer.country}`} />
                <Field label="Marital Status" value={customer.maritalStatus} />
              </Section>
            </div>

            <div className="card stagger-2" style={{ padding: "2rem" }}>
              <Section title="Education & Career">
                <Field label="College" value={customer.undergraduateCollege} />
                <Field label="Degree" value={customer.degree} />
                <Field label="Income" value={`₹${customer.income.toLocaleString()}`} />
              </Section>
            </div>

            <div className="card stagger-3" style={{ padding: "2rem" }}>
              <Section title="Background & Lifestyle">
                <Field label="Religion" value={customer.religion} />
                <Field label="Caste" value={customer.caste} />
                <Field label="Languages" value={customer.languagesKnown.join(", ")} />
                <Field label="Diet" value={customer.diet} />
                <Field label="Drinking" value={customer.drinking} />
                <Field label="Smoking" value={customer.smoking} />
              </Section>
            </div>

            <div className="card stagger-1" style={{ padding: "2rem" }}>
              <Section title="Preferences & Family">
                <Field label="Siblings" value={customer.siblings} />
                <Field label="Want Kids" value={customer.wantKids} />
                <Field label="Open to Relocate" value={customer.openToRelocate} />
                <Field label="Open to Pets" value={customer.openToPets} />
              </Section>
            </div>
          </div>

          {/* Right Column: Matchmaking Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="card stagger-2" style={{ padding: "2rem", backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
              <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Journey Notes
              </h3>
              <textarea 
                className="input-field" 
                style={{ width: "100%", minHeight: "150px", resize: "vertical", backgroundColor: "rgba(255,255,255,0.8)" }}
                placeholder="Record quick notes from meetings or calls here..."
                defaultValue="Initial consultation completed. Looking for someone with similar professional ambition and diet preferences."
              ></textarea>
              <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem" }}>Save Notes</button>
            </div>

            <div className="stagger-3">
              <PotentialMatches customerId={customer.id} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "1.5rem", paddingBottom: "0.5rem", borderBottom: "2px solid rgba(226, 232, 240, 0.5)" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{label}</span>
      <span style={{ fontWeight: "500", fontSize: "0.95rem", textAlign: "right", color: "var(--text-primary)", maxWidth: "60%" }}>{value || "-"}</span>
    </div>
  );
}
