
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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
        const applicationsResponse = await api.get("/applications");

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
    <div className="dashboard-container">
        <header>
            <h1>ApplySync Dashboard</h1>

            <div>
                <button onClick={() => navigate("/applications")}>
                    My Applications
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>
             </div>
        </header>

      <h2 className="welcome-heading">Welcome to ApplySync!</h2>
      <p>Track all your job applications in one place.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <h2>{stats.totalApplications}</h2>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>
          <h2>{stats.applied}</h2>
        </div>

        <div className="stat-card">
          <h3>Interviews</h3>
          <h2>{stats.interviews}</h2>
        </div>

        <div className="stat-card">
          <h3>Offers</h3>
          <h2>{stats.offers}</h2>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <h2>{stats.rejected}</h2>
        </div>
      </div>
      <div className="upcoming-interviews">
  <h2>Upcoming Interviews</h2>

  {upcomingInterviews.length === 0 ? (
    <p>No upcoming interviews scheduled.</p>
  ) : (
    upcomingInterviews.map((application) => (
      <div className="interview-card" key={application.id}>
        <h3>{application.company}</h3>
        <p>Role: {application.role}</p>
        <p>
          Interview Date:{" "}
          {new Date(application.interviewDate).toLocaleString()}
        </p>
      </div>
    ))
  )}
</div>
    </div>
  );
}

export default Dashboard;
