import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAssignedCustomers } from '@/lib/dataAccess';

export const metadata = {
  title: "Dashboard | TDC MatchHub",
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
    <div>
      <header style={{ backgroundColor: "white", borderBottom: "1px solid var(--border-color)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.5rem", color: "var(--primary)" }}>TDC MatchHub</h1>
          <form action={async () => {
            'use server';
            const cStore = await cookies();
            cStore.delete('matchmakerId');
            redirect('/login');
          }}>
            <button className="btn btn-secondary">Sign Out</button>
          </form>
        </div>
      </header>

      <main className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2>My Assigned Customers</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage and track your clients' matchmaking journey.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {customers.map(customer => (
            <Link href={`/customer/${customer.id}`} key={customer.id}>
              <div className="card" style={{ padding: "1.5rem", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "1.125rem" }}>{customer.firstName} {customer.lastName}</h3>
                  <span className={`badge ${getStatusColor(customer.statusTag)}`}>
                    {customer.statusTag}
                  </span>
                </div>
                
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.5rem" }}>
                  <div><strong>Age:</strong> {customer.age}</div>
                  <div><strong>City:</strong> {customer.city}</div>
                  <div><strong>Marital Status:</strong> {customer.maritalStatus}</div>
                  <div><strong>Profession:</strong> {customer.designation}</div>
                </div>
              </div>
            </Link>
          ))}
          {customers.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-secondary)", backgroundColor: "white", borderRadius: "var(--radius-lg)" }}>
              No customers assigned currently.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
