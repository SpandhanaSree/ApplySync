import { useEffect, useState } from "react";
import api from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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

      <h2>My Applications</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications added yet.</p>
      ) : (
        applications.map((application) => (
          <div className="application-card" key={application.id}>
            <h3>{application.company}</h3>
            <p>Role: {application.role}</p>
            <p>Platform: {application.platform}</p>
            <p>Status: {application.status}</p>
            <p>Applied Date: {application.appliedDate || "Not specified"}</p>

            <button onClick={() => handleEdit(application)}>
                Edit
            </button>
            <button onClick={() => handleDelete(application.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Applications;