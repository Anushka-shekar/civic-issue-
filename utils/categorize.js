const categorizeIssue = (text) => {
  text = text.toLowerCase();

  if (text.includes("pothole") || text.includes("road")) {
    return "Road Issue";
  }
  if (text.includes("garbage") || text.includes("trash")) {
    return "Sanitation";
  }
  if (text.includes("light") || text.includes("streetlight")) {
    return "Electricity";
  }
  if (text.includes("water") || text.includes("leak")) {
    return "Water Supply";
  }

  return "Other";
};

module.exports = categorizeIssue;