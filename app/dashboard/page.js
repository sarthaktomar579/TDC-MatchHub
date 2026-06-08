import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAssignedCustomers } from '@/lib/dataAccess';

export const metadata = {
  title: "Dashboard | MatchHub",
};

export default async function Dashboard() {
  const cookieStore = await cookies();
  const matchmakerId = cookieStore.get('matchmakerId')?.value;

  if (!matchmakerId) {
    redirect('/login');
  }

  const customers = getAssignedCustomers(matchmakerId);

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
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      <div style={{ minHeight: "100vh", backgroundColor: "rgba(248, 250, 252, 0.7)", backdropFilter: "blur(12px)" }}>
        <header style={{ 
          background: "rgba(255, 255, 255, 0.5)", 
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.5)", 
          padding: "1.25rem 0",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "1.75rem", color: "var(--primary)", letterSpacing: "-0.05em", background: "linear-gradient(135deg, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MatchHub</h1>
            <form action={async () => {
              'use server';
              const cStore = await cookies();
              cStore.delete('matchmakerId');
              redirect('/login');
            }}>
              <button className="btn btn-secondary" style={{ padding: "0.5rem 1.25rem" }}>Sign Out</button>
            </form>
          </div>
        </header>

        <main className="container" style={{ padding: "3rem 1.5rem" }}>
          <div className="animate-fade-in" style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>My Assigned Customers</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Manage and track your clients' matchmaking journey.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {customers.map((customer, index) => (
              <Link href={`/customer/${customer.id}`} key={customer.id} className={`animate-fade-in stagger-${(index % 3) + 1}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "2rem", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontSize: "1.35rem", color: "var(--text-primary)" }}>{customer.firstName} {customer.lastName}</h3>
                    <span className={`badge ${getStatusColor(customer.statusTag)}`}>
                      {customer.statusTag}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      {customer.age} yrs
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {customer.city}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "0.5rem", paddingTop: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Marital Status</span>
                      <strong style={{ color: "var(--text-primary)" }}>{customer.maritalStatus}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Profession</span>
                      <strong style={{ color: "var(--text-primary)" }}>{customer.designation}</strong>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {customers.length === 0 && (
              <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1rem auto", opacity: 0.5 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>No Customers Found</h3>
                <p>You don't have any assigned customers currently.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
