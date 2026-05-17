import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================
  // FETCH ISSUES
  // ==========================
  const fetchIssues = async () => {

    try {

      const res = await axios.get(`${API}/api/issues`);

      setIssues(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchIssues();

  }, []);

  // ==========================
  // SUBMIT ISSUE
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!image) {

      alert("Please upload an image");

      return;

    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];

    if (!allowedTypes.includes(image.type)) {

      alert("Only JPG and PNG images allowed");

      return;

    }

    if (image.size > 5 * 1024 * 1024) {

      alert("Image size should be less than 5MB");

      return;

    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("image", image);

      const response = await axios.post(
        `${API}/api/issues`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("Issue submitted successfully");

      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);

      document.getElementById("imageInput").value = "";

      fetchIssues();

    } catch (err) {

      console.log(err);

      if (err.response?.data?.message) {

        alert(err.response.data.message);

      } else {

        alert("Something went wrong");

      }

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // UPDATE STATUS
  // ==========================
  const updateStatus = async (id, status) => {

    try {

      await axios.put(
        `${API}/api/issues/${id}`,
        { status }
      );

      fetchIssues();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="app">

      {/* HEADER */}

      <div className="header">

        <h1>Civic Reporter</h1>

        <p>
          Together for a Better Community
        </p>

      </div>

      {/* MAIN SECTION */}

      <div className="main-container">

        {/* LEFT PANEL */}

        <div className="left-panel">

          <h2>
            Small steps today for a better tomorrow
          </h2>

          <div className="feature-box">

            <div className="feature">

              <div className="feature-icon">
                📢
              </div>

              <span>
                Report Civic Issues
              </span>

            </div>

            <div className="feature">

              <div className="feature-icon">
                📍
              </div>

              <span>
                Track Complaint Status
              </span>

            </div>

            <div className="feature">

              <div className="feature-icon">
                🏙️
              </div>

              <span>
                Build Better Cities
              </span>

            </div>

          </div>

        </div>

        {/* FORM SECTION */}

        <div className="form-section">

          <div className="glass-card">

            <h2 className="form-title">
              Report a New Issue
            </h2>

            <form
              className="issue-form"
              onSubmit={handleSubmit}
            >

              <input
                type="text"
                placeholder="Enter issue title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                required
              />

              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

              <div className="file-upload">

                <input
                  id="imageInput"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >

                {
                  loading
                    ? "Submitting..."
                    : "Submit Issue"
                }

              </button>

            </form>

          </div>

        </div>

      </div>

      {/* ISSUES SECTION */}

      <div className="issues-section">

        <div className="issues-header">

          <h2 className="section-title">
            Public Issues
          </h2>

          <div className="issue-count">

            {issues.length} Issues Reported

          </div>

        </div>

        <div className="issue-grid">

          {issues.length === 0 && (

            <div className="empty-state">

              No issues reported yet

            </div>

          )}

          {issues.map((issue) => (

            <div
              className="issue-card"
              key={issue._id}
            >

              {/* IMAGE */}

              <div className="image-wrapper">

                {issue.image && (

                  <img
                    src={`${API}/uploads/${issue.image}`}
                    alt="issue"
                    className="issue-img"
                  />

                )}

                <span
                  className={
                    issue.status === "Pending"
                      ? "badge pending"
                      : issue.status === "In Progress"
                      ? "badge progress"
                      : "badge resolved"
                  }
                >

                  {issue.status}

                </span>

              </div>

              {/* CONTENT */}

              <div className="issue-content">

                {/* TITLE */}

                <h3>
                  {issue.title}
                </h3>

                {/* META */}

                <div className="meta-row">

                  <span>
                    📍 {issue.location}
                  </span>

                  <span>
                    📅 {
                      issue.createdAt
                        ? new Date(issue.createdAt)
                            .toLocaleDateString()
                        : "Today"
                    }
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="issue-description">

                  {issue.description}

                </p>

                {/* FOOTER */}

                <div className="card-footer">

                  <div className="category-pill">

                    {issue.category}

                  </div>

                  <select
                    value={issue.status}
                    onChange={(e) =>
                      updateStatus(
                        issue._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                  </select>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default App;
