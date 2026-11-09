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

  <header className="applications-header">
    <div>
      <h1>My Applications</h1>
      <p>Manage and track all your job applications.</p>
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
  </h2>
  
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