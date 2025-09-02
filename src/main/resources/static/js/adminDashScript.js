const SUBJECT_URL = "http://localhost:8081/Subjects";
const SECTION_URL = "http://localhost:8081/Sections";

// Load all subjects on page load
fetchSubjects();

// ==================== SUBJECT FUNCTIONS ====================

// Fetch all subjects
async function fetchSubjects() {
  try {
    const res = await fetch(`${SUBJECT_URL}/All_Subjects`);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json();
    renderSubjects(data);
  } catch (err) {
    console.error("Error fetching subjects:", err);
  }
}

// Render subjects table
function renderSubjects(subjects) {
  const table = document.getElementById("subjectTable");
  table.innerHTML = "";
  subjects.forEach(sub => {
    table.innerHTML += `
      <tr>
        <td>${sub.subjectId}</td>
        <td><input type="text" value="${sub.subjectName}" id="name-${sub.subjectId}" class="form-control"></td>
        <td>
          <button class="btn btn-success btn-sm" onclick="editSubject(${sub.subjectId})">Save</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSubject(${sub.subjectId})">Delete</button>
          <button class="btn btn-info btn-sm" onclick="toggleSections(${sub.subjectId})">View Sections</button>
        </td>
      </tr>
      <tr id="sectionRow-${sub.subjectId}" style="display:none;">
        <td colspan="3">
          <div>
            <input type="text" id="sectionName-${sub.subjectId}" class="form-control" placeholder="Enter section name">
            <button class="btn btn-primary btn-sm mt-2" onclick="addSection(${sub.subjectId})">Add Section</button>
          </div>
          <table class="table table-sm table-bordered mt-3">
            <thead>
              <tr><th>ID</th><th>Section Name</th><th>Actions</th></tr>
            </thead>
            <tbody id="sectionTable-${sub.subjectId}"></tbody>
          </table>
        </td>
      </tr>
    `;
  });
}

// Add subject
async function addSubject() {
  const name = document.getElementById("subjectName").value.trim();
  if (!name) return alert("Enter a subject name");
  try {
    await fetch(`${SUBJECT_URL}/AddSubject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectName: name })
    });
    document.getElementById("subjectName").value = "";
    fetchSubjects();
  } catch (err) {
    console.error("Error adding subject:", err);
  }
}

// Edit subject
async function editSubject(id) {
  const newName = document.getElementById(`name-${id}`).value.trim();
  if (!newName) return alert("Name cannot be empty");
  try {
    await fetch(`${SUBJECT_URL}/EditName/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectName: newName })
    });
    fetchSubjects();
  } catch (err) {
    console.error("Error editing subject:", err);
  }
}

// Delete subject
async function deleteSubject(id) {
  if (!confirm("Are you sure you want to delete this subject?")) return;
  try {
    await fetch(`${SUBJECT_URL}/DeleteSubject/${id}`, { method: "DELETE" });
    fetchSubjects();
  } catch (err) {
    console.error("Error deleting subject:", err);
  }
}

// ==================== SECTION FUNCTIONS ====================

// Toggle sections row
async function toggleSections(subjectId) {
  const sectionRow = document.getElementById(`sectionRow-${subjectId}`);
  if (sectionRow.style.display === "none") {
    sectionRow.style.display = "";
    fetchSections(subjectId);
  } else {
    sectionRow.style.display = "none";
  }
}

// Fetch sections for a subject
async function fetchSections(subjectId) {
  try {
    const res = await fetch(`${SECTION_URL}/SectionsBySubject/${subjectId}`);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json();
    renderSections(subjectId, data);
  } catch (err) {
    console.error("Error fetching sections:", err);
  }
}

// Render sections
function renderSections(subjectId, sections) {
  const table = document.getElementById(`sectionTable-${subjectId}`);
  table.innerHTML = "";
  sections.forEach(sec => {
    table.innerHTML += `
      <tr>
        <td>${sec.sectionId}</td>
        <td><input type="text" value="${sec.sectionName}" id="secname-${sec.sectionId}" class="form-control"></td>
        <td>
          <button class="btn btn-success btn-sm" onclick="editSection(${sec.sectionId}, ${subjectId})">Save</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSection(${sec.sectionId}, ${subjectId})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Add section under a subject
async function addSection(subjectId) {
  const name = document.getElementById(`sectionName-${subjectId}`).value.trim();
  if (!name) return alert("Enter a section name");
  try {
    await fetch(`${SECTION_URL}/AddSection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionName: name, subjectId: subjectId })
    });
    document.getElementById(`sectionName-${subjectId}`).value = "";
    fetchSections(subjectId);
  } catch (err) {
    console.error("Error adding section:", err);
  }
}

// Edit section
async function editSection(sectionId, subjectId) {
  const newName = document.getElementById(`secname-${sectionId}`).value.trim();
  if (!newName) return alert("Name cannot be empty");
  try {
    await fetch(`${SECTION_URL}/EditSection/${sectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionName: newName })
    });
    fetchSections(subjectId);
  } catch (err) {
    console.error("Error editing section:", err);
  }
}

// Delete section
async function deleteSection(sectionId, subjectId) {
  if (!confirm("Are you sure you want to delete this section?")) return;
  try {
    await fetch(`${SECTION_URL}/DeleteSection/${sectionId}`, { method: "DELETE" });
    fetchSections(subjectId);
  } catch (err) {
    console.error("Error deleting section:", err);
  }
}

// Show sections in dashboard
function showSection(id) {
  document.querySelectorAll(".dashboard-section").forEach(sec => sec.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
}