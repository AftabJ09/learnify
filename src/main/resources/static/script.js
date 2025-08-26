let quill;
let learnerId; // Will be fetched from backend automatically

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch learnerId from backend
    await fetchLearnerId();

    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your query content here...',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    fetchSubjects();

    document.getElementById("SubjectDropdown").addEventListener("change", (e) => {
        const subjectId = e.target.value;
        if (subjectId) fetchSections(subjectId);
        else document.getElementById("SectionDropdown").innerHTML = `<option value="">Select a Section</option>`;
        fetchQueriesBySubject(subjectId);
    });

    document.getElementById("previewBtn").addEventListener("click", showPreview);
    document.getElementById("submitQueryBtn").addEventListener("click", submitQuery);
});

// Fetch learner ID from backend
async function fetchLearnerId() {
    try {
        const res = await fetch("/learner/current"); // backend should return { learnerId: 101 }
        const data = await res.json();
        learnerId = data.learnerId;
    } catch (err) {
        console.error("Failed to fetch learner ID:", err);
        alert("Cannot fetch learner info. Some actions may not work.");
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
<<<<<<< HEAD

// Show editor preview
=======
>>>>>>> 842064e (Topic Post functionality added)
function showPreview() {
    const html = quill.root.innerHTML;
    document.getElementById("previewArea").innerHTML = `
        <h2>Preview:</h2>
        <div style="border:1px solid #ccc; padding:10px; background:#fff;">
            ${html}
        </div>
    `;

}
function sendTopicContent(){
    let title = document.getElementById("topicInput").value;
    let selectedSection = document.getElementById("SectionDropdown").value;
    const content = quill.getContents();
    let data = {
        topic: title,                  // matches TopicContent.topic
        sections: { sectionId: selectedSection }, // nested section object
        content: JSON.stringify(content)              // Quill delta JSON
    };
    let jsonData = JSON.stringify(data);

    fetch('http://localhost:8080/TopicContent/upload', {
        method: 'POST',
        headers: {                        //  must be 'headers', not 'header'
            'Content-Type': 'application/json', // tell Spring this is JSON
            'Accept': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Server response:", result);
        alert("Content uploaded successfully!");
    })
    .catch(error => {
        console.error("Error uploading content:", error);
        alert("Failed to upload content.");
    });
}

// Submit a new query
async function submitQuery() {
    const subjectDropdown = document.getElementById("SubjectDropdown");
    const subjectName = subjectDropdown.options[subjectDropdown.selectedIndex].text;
    const topic = document.getElementById("topicInput").value.trim();
    const content = quill.root.innerHTML;

    if (!learnerId) {
        alert("Learner ID not found. Cannot submit query.");
        return;
    }

    if (!subjectDropdown.value || !topic) {
        alert("Please select a subject and enter a topic.");
        return;
    }

    const body = { query: topic + "<br/>" + content, subjectName, learnerId, verify: false };

    try {
        const res = await fetch("/queries/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            document.getElementById("topicInput").value = '';
            quill.root.innerHTML = '';
            fetchQueriesBySubject(subjectDropdown.value);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to add query.");
    }
}

// Fetch queries for a subject
async function fetchQueriesBySubject(subjectId) {
    if (!subjectId) return;
    const dropdown = document.getElementById("SubjectDropdown");
    const subjectName = dropdown.options[dropdown.selectedIndex].text;
    const queriesArea = document.getElementById("queriesArea");
    queriesArea.innerHTML = `<p>Loading queries...</p>`;

    try {
        const res = await fetch(`/queries/subject/${subjectName}`);
        const queries = await res.json();
        queriesArea.innerHTML = `<h2>Queries:</h2>`;

        queries.forEach(q => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>Topic:</strong> ${q.query}</p>
                ${q.learnerId === learnerId ? `<button class="btn btn-sm btn-danger mb-2" onclick="deleteQuery(${q.queryId})">Delete</button>` : ''}
                <hr/>
            `;
            queriesArea.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        queriesArea.innerHTML = `<p>Failed to load queries.</p>`;
    }
}

// Delete query (only by creator)
async function deleteQuery(queryId) {
    try {
        const res = await fetch(`/queries/delete/${queryId}?learnerId=${learnerId}`, { method: "DELETE" });
        if (res.ok) {
            fetchQueriesBySubject(document.getElementById("SubjectDropdown").value);
        } else {
            const text = await res.text();
            alert(text);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to delete query.");
    }
}