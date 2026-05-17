// components/Upload.js
import { useState } from "react";
import axios from "axios";

function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: ""
  });
  const [image, setImage] = useState(null);

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("location", form.location);
    data.append("image", image);

    const response = await axios.post(
      "http://localhost:5000/api/issues",
      data
    );

    console.log(response.data);

    alert("Issue submitted successfully");

  } catch (err) {

    console.log(err);

    alert("Something went wrong");

  }

};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report Issue</h2>

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Upload;
