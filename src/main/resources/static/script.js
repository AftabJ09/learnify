let quill;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Quill
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['code', 'code-block'],
                ['clean']
            ]
        }
    });

    // Load subjects immediately when page loads
    fetchSubjects();

    // Subject change → fetch sections
    document.getElementById("SubjectDropdown").addEventListener("change", (e) => {
        const subjectId = e.target.value;
        if (subjectId) {
            fetchSections(subjectId);
        } else {
            document.getElementById("SectionDropdown").innerHTML = `<option value="">Select a Section</option>`;
        }
    });

    // Section change → log section
    document.getElementById("SectionDropdown").addEventListener("change", (e) => {
        const sectionId = e.target.value;
        const sectionName = e.target.options[e.target.selectedIndex].text;
        console.log("Picked section:", { sectionId, sectionName });
    });

    // Preview button → show preview
    document.getElementById("previewBtn").addEventListener("click", showPreview);
});

async function fetchSubjects() {
    const dropdown = document.getElementById("SubjectDropdown");
    dropdown.innerHTML = `<option value="">Loading...</option>`;
    try {
        const response = await fetch("/Subjects/All_Subjects");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const subjects = await response.json();
        dropdown.innerHTML = `<option value="">Select a Subject</option>`;
        subjects.forEach(sub => {
            const opt = document.createElement("option");
            opt.value = sub.subject_Id ?? sub.subjectId ?? sub.id;
            opt.textContent = sub.subject_Name ?? sub.subjectName ?? sub.name;
            dropdown.appendChild(opt);
        });
    } catch (err) {
        console.error("Error fetching subjects:", err);
        dropdown.innerHTML = `<option value="">Failed to load</option>`;
    }
}
async function fetchSections(subjectId) {
    const dropdown = document.getElementById("SectionDropdown");
    dropdown.innerHTML = `<option value="">Loading...</option>`;

    try {
        const url = `http://localhost:8080/Sections/SectionsBySubject/${subjectId}`;
        console.log("Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const sections = await response.json();
        console.log("Sections:", sections);

        dropdown.innerHTML = `<option value="">Select a Section</option>`;
        sections.forEach(sec => {
            const opt = document.createElement("option");
            opt.value = sec.sectionId;        // backend ID
            opt.textContent = sec.sectionName; // display name
            dropdown.add(opt);
        });

    } catch (err) {
        console.error("Error fetching sections:", err);
        dropdown.innerHTML = `<option value="">Failed to load</option>`;
    }
}

function showPreview() {
    const html = quill.root.innerHTML; // Rendered HTML
    document.getElementById("previewArea").innerHTML = `
        <h2>Preview:</h2>
        <div style="border:1px solid #ccc; padding:10px; background:#fff;">
            ${html}
        </div>
    `;
}
