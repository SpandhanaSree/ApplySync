import { useEffect, useState } from "react";
import api from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobUrl: "",
    platform: "",
    appliedDate: "",
    deadline: "",
    status: "APPLIED",
    interviewDate: "",
    notes: "",
  });

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      setMessage("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.company.trim() || !formData.role.trim() || !formData.platform) {
    setMessage("Please enter company, role, and platform.");
    return;
  }

  try {
    const updatedFormData = {
  ...formData,
  jobUrl: formData.jobUrl.trim()
    ? formData.jobUrl.trim().startsWith("http")
      ? formData.jobUrl.trim()
      : `https://${formData.jobUrl.trim()}`
    : "",
};

if (editingId) {
  await api.put(`/applications/${editingId}`, updatedFormData);
  setMessage("Application updated successfully!");
} else {
  await api.post("/applications", updatedFormData);
  setMessage("Application added successfully!");
}
    setEditingId(null);

    setFormData({
      company: "",
      role: "",
      jobUrl: "",
      platform: "",
      appliedDate: "",
      deadline: "",
      status: "APPLIED",
      interviewDate: "",
      notes: "",
    });

    fetchApplications();
  } catch (error) {
    setMessage("Failed to save application.");
  }
};

  const handleEdit = (application) => {
  setFormData({
    company: application.company || "",
    role: application.role || "",
    jobUrl: application.jobUrl || "",
    platform: application.platform || "",
    appliedDate: application.appliedDate || "",
    deadline: application.deadline || "",
    status: application.status || "APPLIED",
    interviewDate: application.interviewDate
      ? application.interviewDate.slice(0, 16)
      : "",
    notes: application.notes || "",
  });

  setEditingId(application.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await api.delete(`/applications/${id}`);
    setMessage("Application deleted successfully!");
    fetchApplications();
  } catch (error) {
    setMessage("Failed to delete application.");
  }
};

  const filteredApplications = applications.filter((application) => {
  const matchesSearch =
    application.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.role?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" || application.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const sortedApplications = [...filteredApplications].sort(
  (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
);

  return (
    <div className="applications-container">

  <header className="applications-header">
    <div>
      <h1>My Applications</h1>
      <p>Manage and track all your job applications.</p>
      <div className="applications-filters">

  <input
    type="text"
    placeholder="Search by company or role..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All Status</option>
    <option value="APPLIED">Applied</option>
    <option value="INTERVIEW">Interview</option>
    <option value="OFFER">Offer</option>
    <option value="REJECTED">Rejected</option>
  </select>

</div>
    </div>

    <button
      className="back-dashboard-btn"
      onClick={() => window.location.href = "/dashboard"}
    >
      Back to Dashboard
    </button>
  </header>

  <h2 className="form-heading">
    {editingId ? "Edit Application" : "Add New Application"}

<form onSubmit={handleSubmit}>
  <label>Company Name</label>
  <input
    type="text"
    name="company"
    placeholder="Enter company name"
    value={formData.company}
    onChange={handleChange}
    required
  />

  <label>Job Role</label>
  <input
    type="text"
    name="role"
    placeholder="Enter job role"
    value={formData.role}
    onChange={handleChange}
    required
  />

  <label>Job URL</label>
  <input
    type="text"
    name="jobUrl"
    placeholder="Paste job link"
    value={formData.jobUrl}
    onChange={handleChange}
  />

  <label>Platform</label>
  <select
    name="platform"
    value={formData.platform}
    onChange={handleChange}
    required
  >
    <option value="">Select Platform</option>
    <option value="LinkedIn">LinkedIn</option>
    <option value="Naukri">Naukri</option>
    <option value="Internshala">Internshala</option>
    <option value="Unstop">Unstop</option>
    <option value="Company Website">Company Website</option>
    <option value="Other">Other</option>
  </select>

  <label>Applied Date</label>
  <input
    type="date"
    name="appliedDate"
    value={formData.appliedDate}
    onChange={handleChange}
  />

  <label>Application Deadline</label>
  <input
    type="date"
    name="deadline"
    value={formData.deadline}
    onChange={handleChange}
  />

  <label>Status</label>
  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
  >
    <option value="APPLIED">Applied</option>
    <option value="INTERVIEW">Interview</option>
    <option value="OFFER">Offer</option>
    <option value="REJECTED">Rejected</option>
  </select>

  <label>Interview Date</label>
  <input
    type="datetime-local"
    name="interviewDate"
    value={formData.interviewDate}
    onChange={handleChange}
  />

  <label>Notes</label>
  <textarea
    name="notes"
    placeholder="Add any additional notes"
    value={formData.notes}
    onChange={handleChange}
  />

  <button type="submit">
    {editingId ? "Update Application" : "Add Application"}
  </button>
</form>

{message && <p className="form-message">{message}</p>}

  </h2>
  
    <h2>My Applications</h2>
    {loading ? (
  <p>Loading applications...</p>
) : sortedApplications.length === 0 ? (
  <div className="empty-applications">
    <h3>No applications found</h3>
    <p>
      Start tracking your job applications by adding your first application.
    </p>
  </div>
) : (
  sortedApplications.map((application) => (
    <div className="application-card" key={application.id}>

      <div className="application-card-header">
        <div>
          <h3>{application.company}</h3>
          <p className="application-role">{application.role}</p>
        </div>

        <span className={`status-badge ${application.status.toLowerCase()}`}>
          {application.status}
        </span>
      </div>

      <div className="application-details">
        {application.jobUrl && (
          <p>
            <strong>Job Link:</strong>{" "}
            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="job-link">
              View Job Posting ↗
            </a>
          </p>
        )}

        <p><strong>Platform:</strong> {application.platform}</p>
        <p><strong>Applied:</strong> {application.appliedDate || "Not specified"}</p>

        {application.deadline && (
          <p><strong>Deadline:</strong> {application.deadline}</p>
        )}

        {application.interviewDate && (
          <p>
            <strong>Interview:</strong>{" "}
            {new Date(application.interviewDate).toLocaleString()}
          </p>
        )}
      </div>

      <div className="application-card-actions">
        <button onClick={() => handleEdit(application)}>Edit</button>
        <button onClick={() => handleDelete(application.id)}>Delete</button>
      </div>

    </div>
  ))
)}
</div>
  );
}

export default Applications;