const subjectDropdown = document.getElementById("subjectDropdown");
const questionsTable = document.getElementById("questionsTable");
const optionInputs = document.querySelectorAll(".option-input");
const answerDropdown = document.getElementById("answerDropdown");

// Load subjects on page load
window.onload = () => {
    fetchSubjects();
    subjectDropdown.addEventListener("change", fetchQuestions);
    optionInputs.forEach(input => input.addEventListener("input", updateAnswerDropdown));
};

// Fetch all subjects
function fetchSubjects() {
    fetch('http://localhost:8081/Subjects/All_Subjects')
        .then(response => response.json())
        .then(data => {
            subjectDropdown.innerHTML = '';
            data.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.subjectId;
                option.text = subject.subjectName;
                subjectDropdown.add(option);
            });
            fetchQuestions(); // fetch questions for first subject by default
        })
        .catch(err => console.error("Error fetching subjects:", err));
}

// Fetch questions for selected subject
function fetchQuestions() {
    const subjectId = subjectDropdown.value;
    fetch(`http://localhost:8081/Quiz/GetQuestion/${subjectId}`)
        .then(response => response.json())
        .then(data => {
            questionsTable.innerHTML = '';
            data.forEach(q => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${q.question}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.quiz_Id})">Delete</button>
                    </td>
                `;
                questionsTable.appendChild(row);
            });
        })
        .catch(err => console.error("Error fetching questions:", err));
}

// Update answer dropdown options dynamically
function updateAnswerDropdown() {
    const options = Array.from(optionInputs).map(input => input.value).filter(v => v.trim() !== '');
    answerDropdown.innerHTML = '';
    options.forEach(opt => {
        const optionElem = document.createElement('option');
        optionElem.value = opt;
        optionElem.text = opt;
        answerDropdown.add(optionElem);
    });
}

// Add a new question
function addQuestion() {
    const subjectId = subjectDropdown.value;
    const quiz = {
        question: document.getElementById("questionInput").value,
        optionA: document.getElementById("optionAInput").value,
        optionB: document.getElementById("optionBInput").value,
        optionC: document.getElementById("optionCInput").value,
        optionD: document.getElementById("optionDInput").value,
        answer: document.getElementById("answerDropdown").value,
        subjects: { subjectId: parseInt(subjectId) }
    };

    fetch('http://localhost:8081/Quiz/AddQuestion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quiz)
    })
    .then(response => response.json())
    .then(data => {
        fetchQuestions();
        clearForm();
        alert("Question added successfully!");
    })
    .catch(err => console.error("Error adding question:", err));
}

// Delete a question
function deleteQuestion(quizId) {
    if (!confirm("Are you sure you want to delete this question?")) return;

    fetch(`http://localhost:8081/Quiz/DeleteQuestion/${quizId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if(response.ok){
            fetchQuestions();
            alert("Question deleted successfully!");
        } else {
            alert("Error deleting question.");
        }
    })
    .catch(err => console.error("Error deleting question:", err));
}

// Clear form inputs after adding
function clearForm() {
    document.getElementById("questionInput").value = '';
    optionInputs.forEach(input => input.value = '');
    answerDropdown.innerHTML = '';
}
