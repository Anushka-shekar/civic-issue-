// components/Issues.js
import { useEffect, useState } from "react";
import axios from "axios";

function Issues() {
  const [issues, setIssues] = useState([]);

useEffect(() => {
  axios.get("http://localhost:5000/api/issues")
    .then(res => {
      console.log(res.data);   // 👈 ADD THIS
      setIssues(res.data);
    })
    .catch(err => console.log(err));
}, []);

 

  return (
    <div>
      <h2>Public Issues</h2>

      {issues.map(issue => (
        <div key={issue._id} style={{ border: "1px solid black", margin: "10px" }}>
          <h3>{issue.title}</h3>

          <img
            src={`http://localhost:5000/uploads/${issue.image}`}
            width="200"
            alt=""
          />

          <p>{issue.description}</p>

          <p><b>Category:</b> {issue.category}</p>
          <p><b>Status:</b> {issue.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Issues;
