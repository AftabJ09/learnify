let quill;
let learnerId;

// Wait until DOM loads
document.addEventListener("DOMContentLoaded", async () => {
  initQuill();
  await fetchLearnerId();
  fetchSubjects();

  // Event listeners
  document.getElementById("SubjectDropdown").addEventListener("change", (e) => {
    const subjectId = e.target.value;
    if (subjectId) {
      fetchSections(subjectId);
    } else {
      document.getElementById("SectionDropdown").innerHTML = `<option value="">Select a Section</option>`;
    }
  });

  document.getElementById("previewBtn").addEventListener("click", showPreview);
});

// Initialize Quill editor
function initQuill() {
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write content here...",
    modules: {
      syntax: true,
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "code-block"],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ]
    }
  });
  hljs.highlightAll();
}

// Fetch learner ID from backend
async function fetchLearnerId() {
  try {
    const res = await fetch("/learner/current");
    const data = await res.json();
    learnerId = data.learnerId;
  } catch (err) {
    console.error("Failed to fetch learner ID:", err);
    alert("Cannot fetch learner info.");
  }
}

// Fetch subjects from backend
async function fetchSubjects() {
  const dropdown = document.getElementById("SubjectDropdown");
  dropdown.innerHTML = `<option value="">Loading...</option>`;
  try {
    const res = await fetch("/Subjects/All_Subjects");
    const subjects = await res.json();
    dropdown.innerHTML = `<option value="">Select a Subject</option>`;
    subjects.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.subjectId;
      opt.textContent = s.subjectName;
      dropdown.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    dropdown.innerHTML = `<option value="">Failed to load subjects</option>`;
  }
}

// Fetch sections by subject
async function fetchSections(subjectId) {
  const dropdown = document.getElementById("SectionDropdown");
  dropdown.innerHTML = `<option value="">Loading...</option>`;
  try {
    const res = await fetch(`/Sections/SectionsBySubject/${subjectId}`);
    const sections = await res.json();
    dropdown.innerHTML = `<option value="">Select a Section</option>`;
    sections.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.sectionId;
      opt.textContent = s.sectionName;
      dropdown.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    dropdown.innerHTML = `<option value="">Failed to load sections</option>`;
  }
}

// Preview content
function showPreview() {
  const html = quill.root.innerHTML;
  document.getElementById("previewArea").innerHTML = `
    <h2>Preview:</h2>
    <div style="border:1px solid #ccc; padding:10px; background:#fff;">
      ${html}
    </div>
  `;
}

// Submit topic content
async function sendTopicContent() {
    let title = document.getElementById("topicInput").value;
    let selectedSection = document.getElementById("SectionDropdown").value;
    const content = quill.getContents();
    let data = {
        topic: title,                                 // matches TopicContent.topic
        sections: { sectionId: selectedSection },    // nested section object
        content: JSON.stringify(content)             // Quill delta JSON
    };

    try {
        const response = await fetch("/TopicContent/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
        alert("Content uploaded successfully!");
    } catch (error) {
        console.error("Detailed error uploading content:", error);
        alert(`Upload failed: ${error.message}`);
    }
}
