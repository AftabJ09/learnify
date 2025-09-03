document.addEventListener("DOMContentLoaded", async function () {
    // ---------- Session Check ----------
    try {
        const response = await fetch("http://localhost:8081/learner/session", {
            credentials: "include"
        });

        const sessionData = await response.json();
        console.log("Session data:", sessionData);

        if (!sessionData.loggedIn) {
            alert("Please login to access the homepage.");
            window.location.href = "loginPage.html";
        } else {
            document.getElementById("welcomeMessage").textContent = `Welcome, ${sessionData.learnerName}!`;
        }
    } catch (err) {
        console.error("Error fetching session:", err);
        alert("Error checking session. Please login again.");
        window.location.href = "loginPage.html";
    }

    // ---------- Logout Button ----------
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            await fetch("http://localhost:8081/learner/logout", {
                method: "POST",
                credentials: "include"
            });
            localStorage.clear();
            alert("Logged out successfully!");
            window.location.href = "loginPage.html";
        } catch (err) {
            console.error("Logout error:", err);
            alert("Failed to logout. Try again.");
        }
    });

    // ---------- Fetch Subjects ----------
    fetchSubjects();
});

async function fetchSubjects() {
    const apiUrl = 'http://localhost:8081/Subjects/All_Subjects';
    const container = document.getElementById('subjectCardsContainer');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        const response = await fetch(apiUrl);
        const subjects = await response.json();

        if (loadingMessage) loadingMessage.remove();

        if (!subjects || subjects.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">No subjects found</div>';
            return;
        }

        subjects.forEach(subject => {
            // Use the correct field name from your backend response: subjectId
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card shadow-sm h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">${subject.subjectName}</h5>
                        <button class="btn btn-primary start-learning-btn"
                            data-id="${subject.subjectId}"
                            data-name="${subject.subjectName}">
                            Start Learning
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Add click event to open sections
        document.querySelectorAll('.start-learning-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subjectId = btn.getAttribute('data-id');
                const subjectName = btn.getAttribute('data-name');
                if (!subjectId) {
                    alert("Invalid subject selected");
                    return;
                }
                window.open(`sections.html?subjectId=${subjectId}&subjectName=${encodeURIComponent(subjectName)}`, '_blank');
            });
        });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        if (loadingMessage) loadingMessage.textContent = 'Failed to load subjects';
    }
}
