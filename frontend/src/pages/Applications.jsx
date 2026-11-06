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
    if (editingId) {
      await api.put(`/applications/${editingId}`, formData);
      setMessage("Application updated successfully!");
    } else {
      await api.post("/applications", formData);
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
        <h2>{editingId ? "Edit Application" : "Add New Application"}</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Job Role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <input
          name="jobUrl"
          placeholder="Job URL"
          value={formData.jobUrl}
          onChange={handleChange}
        />

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

        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">
  {editingId ? "Update Application" : "Add Application"}
</button>
      </form>
      <div className="application-filters">
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
    <option value="ALL">All Statuses</option>
    <option value="APPLIED">Applied</option>
    <option value="INTERVIEW">Interview</option>
    <option value="OFFER">Offer</option>
    <option value="REJECTED">Rejected</option>
  </select>
</div>

    <h2>My Applications</h2>

{loading ? (
  <p>Loading applications...</p>
) : sortedApplications.length === 0 ? (
  <p>No applications added yet.</p>
) : (
  sortedApplications.map((application) => (
    <div className="application-card" key={application.id}>
      <h3>{application.company}</h3>
      <p>Role: {application.role}</p>
      <p>Platform: {application.platform}</p>
      <p>Status: {application.status}</p>
      <p>Applied Date: {application.appliedDate || "Not specified"}</p>

      {application.interviewDate && (
  <p>
    📅 Interview Date:{" "}
    {new Date(application.interviewDate).toLocaleString()}
  </p>
)}

      {application.deadline && (
  <p>
    Deadline: {application.deadline}
    {new Date(application.deadline + "T00:00:00") < new Date(new Date().toDateString())
      ? " ⚠️ Deadline passed"
      : Math.ceil(
          (new Date(application.deadline + "T00:00:00") - new Date(new Date().toDateString())) / (1000 * 60 * 60 * 24)
        ) <= 3
      ? " ⚠️ Deadline approaching"
      : ""}
  </p>
)}

      <button onClick={() => handleEdit(application)}>Edit</button>
      <button onClick={() => handleDelete(application.id)}>Delete</button>
    </div>
  ))
)}
    </div>
  );
}

export default Applications;