import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";    


function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    role: "Student",
    createdAt: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");

        setProfile({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
          college: response.data.college || "",
          role: response.data.role || "Student",
          createdAt: response.data.createdAt || ""
        });

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };
  const handleSave = async () => {
  try {
    const response = await api.put("/users/profile", {
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      college: profile.college
    });

    setProfile((prevProfile) => ({
      ...prevProfile,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone || "",
      location: response.data.location || "",
      college: response.data.college || "",
      role: response.data.role || "Student"
    }));

    setIsEditing(false);
    alert("Profile updated successfully!");

  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">ApplySync</h2>

        <nav className="sidebar-nav">
          <button
            className="sidebar-link"
            onClick={() => navigate("/dashboard")}
          >
            <span>▦</span> Dashboard
          </button>

          <button
            className="sidebar-link active"
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

      {/* Main Profile */}
      <main className="dashboard-container">

        <div className="profile-container">

          <div className="profile-header">
            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information and account settings.</p>
            </div>
          </div>

          <div className="profile-card">

            <div className="profile-overview">
              <div className="profile-avatar">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="profile-heading">
                <h2>{profile.name || "Your Name"}</h2>
                <p>{profile.email || "your.email@example.com"}</p>
                <span>{profile.role}</span>
              </div>

              <button
                className="profile-edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="profile-divider"></div>

            <h3>Personal Information</h3>

            <div className="profile-details">

              {[
                ["Full Name", "name"],
                ["Email Address", "email"],
                ["Phone Number", "phone"],
                ["Location", "location"],
                ["College", "college"]
              ].map(([label, name]) => (
                <div className="profile-field" key={name}>
                  <label>{label}</label>
                  <input
                    type={name === "email" ? "email" : "text"}
                    name={name}
                    value={profile[name]}
                    onChange={handleChange}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    disabled={!isEditing || name === "email"}
                  />
                </div>
              ))}

              <div className="profile-field">
                <label>Role</label>
                <input type="text" value={profile.role} disabled />
              </div>

            </div>

            {isEditing && (
              <button
  className="profile-save-btn"
  onClick={handleSave}
>
  Save Changes
</button>
            )}

          </div>
        </div>
        

      </main>
    </div>
  );
}

export default Profile;