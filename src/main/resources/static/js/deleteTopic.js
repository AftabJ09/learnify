const API_BASE = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();
  document.getElementById("SubjectDropdown").addEventListener("change", e => {
    loadSections(e.target.value);
  });
  document.getElementById("SectionDropdown").addEventListener("change", e => {
    loadTopics(e.target.value);
  });
});

async function loadSubjects() {
  const dd = document.getElementById("SubjectDropdown");
  dd.innerHTML = `<option value="">Loading...</option>`;
  try {
    const res = await fetch(`${API_BASE}/Subjects/All_Subjects`);
    const data = await res.json();
    dd.innerHTML = `<option value="">Select a Subject</option>`;
    data.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.subjectId;
      opt.textContent = s.subjectName;
      dd.appendChild(opt);
    });
  } catch {
    dd.innerHTML = `<option value="">Error loading subjects</option>`;
  }
}

async function loadSections(subjectId) {
  const dd = document.getElementById("SectionDropdown");
  dd.innerHTML = `<option value="">Loading...</option>`;
  try {
    const res = await fetch(`${API_BASE}/Sections/SectionsBySubject/${subjectId}`);
    const data = await res.json();
    dd.innerHTML = `<option value="">Select a Section</option>`;
    data.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.sectionId;
      opt.textContent = s.sectionName;
      dd.appendChild(opt);
    });
  } catch {
    dd.innerHTML = `<option value="">Error loading sections</option>`;
  }
}

async function loadTopics(sectionId) {
  const container = document.getElementById("topicsContainer");
  container.innerHTML = `<li class="list-group-item">Loading...</li>`;
  try {
    const res = await fetch(`${API_BASE}/TopicContent/BySection/${sectionId}`);
    const data = await res.json();
    container.innerHTML = "";
    if (!data.length) {
      container.innerHTML = `<li class="list-group-item">No topics found</li>`;
      return;
    }
    data.forEach(t => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${t.topic}</span>
        <button class="btn btn-danger btn-sm" onclick="deleteTopic(${t.topicId})">Delete</button>
      `;
      container.appendChild(li);
    });
  } catch {
    container.innerHTML = `<li class="list-group-item">Error loading topics</li>`;
  }
}

async function deleteTopic(id) {
  if (!confirm("Are you sure you want to delete this topic and its images?")) return;
  try {
    const res = await fetch(`${API_BASE}/TopicContent/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    alert("Topic deleted successfully!");
    const sectionId = document.getElementById("SectionDropdown").value;
    loadTopics(sectionId); // refresh list
  } catch (err) {
    alert("Error deleting topic: " + err.message);
  }
}
