let quill;
let learnerId;

document.addEventListener("DOMContentLoaded", async () => {
    await fetchLearnerId();

    // Initialize Quill editor for optional subject description
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write description here...',
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
        if (!subjectId) document.getElementById("SectionDropdown").innerHTML = `<option value="">Select a Section</option>`;
    });

    document.getElementById("submitQueryBtn").addEventListener("click", addSubject);
});

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

async function addSubject() {
    const subjectDropdown = document.getElementById("SubjectDropdown");
    const subjectName = subjectDropdown.options[subjectDropdown.selectedIndex].text.trim();
    const description = quill.root.innerHTML;

    if (!subjectName) return alert("Please select or type a subject name.");

    const body = { subjectName, description, learnerId };

    try {
        const res = await fetch("/Subjects/AddSubject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Subject added successfully!");
            quill.root.innerHTML = '';
            fetchSubjects(); // refresh dropdown
        } else {
            alert("Failed to add subject.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to add subject.");
    }
}

async function deleteSubject(subjectId) {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
        const res = await fetch(`/Subjects/DeleteSubject/${subjectId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Subject deleted successfully!");
            fetchSubjects();
        } else {
            const msg = await res.text();
            alert("Cannot delete subject: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to delete subject.");
    }
}