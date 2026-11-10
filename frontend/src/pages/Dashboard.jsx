
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalApplications: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
        const applicationsResponse = await api.get("/applications");

        const recent = [...applicationsResponse.data]
  .sort(
    (a, b) =>
      new Date(b.appliedDate) - new Date(a.appliedDate)
  )
  .slice(0, 5);

setRecentApplications(recent);

const interviews = applicationsResponse.data.filter((application) => {
  return (
    application.status === "INTERVIEW" &&
    application.interviewDate &&
    new Date(application.interviewDate) >= new Date()
  );
});

setUpcomingInterviews(interviews);
      } catch (err) {
        setError("Unable to load dashboard. Please login again.");

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

return (
  <div className="dashboard-layout">

    {/* Sidebar */}
    <aside className="sidebar">
      <h2 className="sidebar-logo">ApplySync</h2>

      <nav className="sidebar-nav">
        <button
          className="sidebar-link active"
          onClick={() => navigate("/dashboard")}
        >
          <span>▦</span> Dashboard
        </button>

        <button
  className="sidebar-link"
  onClick={() => navigate("/profile")}
>
  <span>♙</span> My Profile
</button>

        <button
          className="sidebar-link"
          onClick={() => navigate("/applications")}
        >
          <span>▣</span> My Applications
        </button>

        <button
          className="sidebar-link"
          onClick={() => navigate("/applications")}
        >
          <span>＋</span> Add Application
        </button>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        ↪ Logout
      </button>
    </aside>

    {/* Main Dashboard */}
    <main className="dashboard-container">

      <header className="dashboard-header">
         <div>
    <h1>Dashboard</h1>
    <p>Welcome back! Here's your application overview.</p>
  </div>

  <button
    className="add-application-btn"
    onClick={() => navigate("/applications")}
  >
    + Add Application
  </button>
      </header>

      <h2 className="welcome-heading">Welcome to ApplySync!</h2>
      <p>Track all your job applications in one place.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="stats-container">

  <div className="stat-card total-card">
    <span className="stat-label">Total Applications</span>
    <h2>{stats.totalApplications}</h2>
  </div>

  <div className="stat-card applied-card">
    <span className="stat-label">Applied</span>
    <h2>{stats.applied}</h2>
  </div>

  <div className="stat-card interview-card-stat">
    <span className="stat-label">Interviews</span>
    <h2>{stats.interviews}</h2>
  </div>

  <div className="stat-card offer-card">
    <span className="stat-label">Offers</span>
    <h2>{stats.offers}</h2>
  </div>

  <div className="stat-card rejected-card">
    <span className="stat-label">Rejected</span>
    <h2>{stats.rejected}</h2>
  </div>

</div>

{/* Application Status Analytics */}
<div className="analytics-section">
  <h2>Application Status Overview</h2>
  <p className="analytics-subtitle">
    Track the progress of your job applications.
  </p>

  {[
    { label: "Applied", value: stats.applied, color: "#3B82F6" },
    { label: "Interviews", value: stats.interviews, color: "#D97706" },
    { label: "Offers", value: stats.offers, color: "#16A34A" },
    { label: "Rejected", value: stats.rejected, color: "#DC2626" },
  ].map((item) => {
    const percentage =
      stats.totalApplications > 0
        ? (item.value / stats.totalApplications) * 100
        : 0;

    return (
      <div className="analytics-row" key={item.label}>
        <div className="analytics-info">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>

        <div className="analytics-bar">
          <div
            className="analytics-progress"
            style={{
              width: `${percentage}%`,
              backgroundColor: item.color,
            }}
          ></div>
        </div>
      </div>
    );
  })}
</div>

{/* Upcoming Interviews */}
<div className="upcoming-interviews">
  <div className="section-heading">
    <div>
      <h2>Upcoming Interviews</h2>
      <p>Keep track of your upcoming opportunities.</p>
    </div>

    <span className="interview-count">
      {upcomingInterviews.length} Scheduled
    </span>
  </div>

  {upcomingInterviews.length === 0 ? (
    <p className="empty-interviews">
      No upcoming interviews scheduled yet.
    </p>
  ) : (
    <div className="interview-list">
      {upcomingInterviews.map((application) => (
        <div className="interview-card" key={application.id}>
          <div className="interview-company">
            <h3>{application.company}</h3>
            <p>{application.role}</p>
          </div>

          <div className="interview-date">
            <span>Interview Date</span>
            <strong>
              {new Date(application.interviewDate).toLocaleDateString()}
            </strong>
            <small>
              {new Date(application.interviewDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* Recent Applications */}
<div className="recent-applications">
  <div className="section-heading">
    <div>
      <h2>Recent Applications</h2>
      <p>Your latest job application activities.</p>
    </div>

    <button
      className="view-all-btn"
      onClick={() => navigate("/applications")}
    >
      View All
    </button>
  </div>

  {recentApplications.length === 0 ? (
    <p className="empty-applications">
      No applications added yet.
    </p>
  ) : (
    <div className="recent-application-list">
      {recentApplications.map((application) => (
        <div className="recent-application-card" key={application.id}>
          <div className="recent-company">
            <h3>{application.company}</h3>
            <p>{application.role}</p>
          </div>

          <div className="recent-platform">
            <span>Platform</span>
            <strong>{application.platform}</strong>
          </div>

          <div className="recent-status">
            <span
              className={`status-badge ${application.status?.toLowerCase()}`}
            >
              {application.status}
            </span>
          </div>

          <div className="recent-date">
            <span>Applied Date</span>
            <strong>
              {application.appliedDate
                ? new Date(application.appliedDate).toLocaleDateString()
                : "N/A"}
            </strong>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </main>
  </div>
);
}

export default Dashboard;
