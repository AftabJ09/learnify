// editContent.js
//  - Put this file in the same folder as your HTML and include it after Quill script.
//  - If your backend isn't on http://localhost:8080, update API_BASE accordingly.

const API_BASE = "http://localhost:8081"; // <-- change if needed

let quill;
let currentTopicId = null;

document.addEventListener("DOMContentLoaded", () => {
  initQuill();
  bindDropdownListeners();
  fetchSubjects(); // start the chain
});

// ------------------ Quill init ------------------
function initQuill() {
  // NOTE: syntax is disabled to avoid requiring highlight.js.
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write content here...",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "code"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "code-block"],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ]
    }
  });
}

// ------------------ Event binding ------------------
function bindDropdownListeners() {
  const subjectDD = document.getElementById("SubjectDropdown");
  const sectionDD = document.getElementById("SectionDropdown");
  const topicDD = document.getElementById("TopicDropdown");

  if (subjectDD) {
    subjectDD.addEventListener("change", async (e) => {
      const subjectId = e.target.value;
      clearSelect(sectionDD, "Select a Section");
      clearSelect(topicDD, "Select a Topic");
      currentTopicId = null;
      document.getElementById("topicInput").value = "";
      quill.setContents([]);
      if (subjectId) await fetchSections(subjectId);
    });
  }

  if (sectionDD) {
    sectionDD.addEventListener("change", async (e) => {
      const sectionId = e.target.value;
      clearSelect(topicDD, "Select a Topic");
      currentTopicId = null;
      document.getElementById("topicInput").value = "";
      quill.setContents([]);
      if (sectionId) await fetchTopics(sectionId);
    });
  }

  if (topicDD) {
    topicDD.addEventListener("change", async (e) => {
      const topicId = e.target.value;
      currentTopicId = null;
      document.getElementById("topicInput").value = "";
      quill.setContents([]);
      if (topicId) await loadTopic(topicId);
    });
  }
}

// ------------------ Helpers ------------------
function clearSelect(selectEl, placeholderText = "Select") {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholderText}</option>`;
}

async function safeJsonResponse(res) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text; // return raw text if not JSON
  }
}

async function handleFetchError(res) {
  const body = await res.text().catch(() => "");
  throw new Error(`HTTP ${res.status} - ${body || res.statusText}`);
}

// ------------------ Fetch Subjects / Sections / Topics ------------------
async function fetchSubjects() {
  const dd = document.getElementById("SubjectDropdown");
  if (!dd) return console.warn("SubjectDropdown not found in DOM");
  dd.innerHTML = `<option value="">Loading subjects...</option>`;
  try {
    const res = await fetch(`${API_BASE}/Subjects/All_Subjects`);
    if (!res.ok) await handleFetchError(res);
    const subjects = await res.json();
    dd.innerHTML = `<option value="">Select a Subject</option>`;
    subjects.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.subjectId;
      opt.textContent = s.subjectName || s.name || s.subject;
      dd.appendChild(opt);
    });
    console.log("Loaded subjects:", subjects.length);
  } catch (err) {
    console.error("fetchSubjects error:", err);
    dd.innerHTML = `<option value="">Failed to load subjects</option>`;
    alert("Failed to load subjects: " + err.message);
  }
}

async function fetchSections(subjectId) {
  const dd = document.getElementById("SectionDropdown");
  if (!dd) return console.warn("SectionDropdown not found in DOM");
  dd.innerHTML = `<option value="">Loading sections...</option>`;
  try {
    const res = await fetch(`${API_BASE}/Sections/SectionsBySubject/${subjectId}`);
    if (!res.ok) await handleFetchError(res);
    const sections = await res.json();
    dd.innerHTML = `<option value="">Select a Section</option>`;
    sections.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.sectionId;
      opt.textContent = s.sectionName || s.name || s.title;
      dd.appendChild(opt);
    });
    console.log("Loaded sections:", sections.length);
  } catch (err) {
    console.error("fetchSections error:", err);
    dd.innerHTML = `<option value="">Failed to load sections</option>`;
    alert("Failed to load sections: " + err.message);
  }
}

async function fetchTopics(section_Id) {
  const dropdown = document.getElementById("TopicDropdown");
  dropdown.innerHTML = `<option value="">Loading...</option>`;
  try {
    const res = await fetch(`http://localhost:8081/TopicContent/BySection/${section_Id}`);
    if (!res.ok) {
      const text = await res.text();
      console.error(`Error ${res.status}:`, text);
      dropdown.innerHTML = `<option value="">Error loading topics</option>`;
      return;
    }
    const topics = await res.json();
    dropdown.innerHTML = `<option value="">Select a Topic</option>`;
    topics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.topicId;
      opt.textContent = t.topic;
      dropdown.appendChild(opt);
    });
  } catch (err) {
    console.error("Fetch failed:", err);
    dropdown.innerHTML = `<option value="">Failed to load topics</option>`;
  }
}

// ------------------ Load single topic into editor ------------------
async function loadTopic(topicId) {
  try {
    const res = await fetch(`${API_BASE}/TopicContent/${topicId}`);
    if (!res.ok) await handleFetchError(res);
    const topic = await res.json();
    currentTopicId = topic.topicId || topic.topicID || topic.id || topic.topic_id;
    document.getElementById("topicInput").value = topic.topic || "";
    // topic.content is expected to be a JSON string (Quill Delta).
    if (!topic.content || topic.content === "null") {
      quill.setContents([]);
      console.warn("Topic has empty content");
      return;
    }
    // Try parse delta
    try {
      const delta = typeof topic.content === "string" ? JSON.parse(topic.content) : topic.content;
      // If delta is a Quill Delta object, setContents
      if (delta && (delta.ops || Array.isArray(delta.ops))) {
        quill.setContents(delta);
      } else {
        // If content is HTML string, fall back to innerHTML
        quill.root.innerHTML = typeof topic.content === "string" ? topic.content : JSON.stringify(topic.content);
      }
    } catch (parseErr) {
      console.warn("Failed to parse saved content as delta, falling back to innerHTML", parseErr);
      quill.root.innerHTML = topic.content;
    }
    console.log("Loaded topic", currentTopicId);
  } catch (err) {
    console.error("loadTopic error:", err);
    alert("Failed to load topic: " + err.message);
  }
}

// ------------------ Update topic ------------------
async function updateTopic() {
  if (!currentTopicId) {
    alert("Please select a topic first.");
    return;
  }
  const sectionId = document.getElementById("SectionDropdown").value;
  const topicTitle = document.getElementById("topicInput").value.trim();
  const payload = {
    topic: topicTitle,
    sections: { sectionId: Number(sectionId) },
    content: JSON.stringify(quill.getContents())
  };

  try {
    const res = await fetch(`${API_BASE}/TopicContent/${currentTopicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) await handleFetchError(res);
    const updated = await safeJsonResponse(res);
    console.log("Update success:", updated);
    alert("Topic updated successfully!");
  } catch (err) {
    console.error("updateTopic error:", err);
    alert("Failed to update topic: " + err.message);
  }
}

// ------------------ Preview ------------------
function showPreview() {
  const html = quill.root.innerHTML;
  document.getElementById("previewArea").innerHTML = `
    <h4>Preview</h4>
    <div style="border:1px solid #ddd; padding:10px; background:#fff;">${html}</div>
  `;
}
