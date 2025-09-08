// ---- CONFIG ----
const API_BASE = "http://localhost:8081"; // adjust port if needed

const els = {
  form: document.getElementById("queryForm"),
  subjectSelect: document.getElementById("subjectSelect"),
  queryText: document.getElementById("queryText"),
  formMsg: document.getElementById("formMsg"),
  filterSubject: document.getElementById("filterSubject"),
  loadBtn: document.getElementById("loadBtn"),
  listMsg: document.getElementById("listMsg"),
  list: document.getElementById("queryList"),
};

// ---- SESSION ----
let currentLearner = null;

async function loadSession() {
  try {
    const res = await fetch(`${API_BASE}/learner/session`, {
      credentials: "include" // send cookie
    });
    if (!res.ok) throw new Error("Failed to get session");
    currentLearner = await res.json();
    console.log("Logged-in learner:", currentLearner);
  } catch (err) {
    console.error("Session fetch error:", err);
    currentLearner = null;
  }
}

// Utility
function showMsg(el, text, ok = true) {
  el.textContent = text || "";
  el.classList.remove("ok", "err");
  if (text) el.classList.add(ok ? "ok" : "err");
}

// ---- SUBJECTS ----
async function loadSubjects() {
  try {
    const res = await fetch(`${API_BASE}/Subjects/All_Subjects`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch subjects");
    return await res.json();
  } catch (err) {
    console.error("Subjects error", err);
    return [];
  }
}

function renderSubjects(subjects) {
  els.subjectSelect.innerHTML = `<option value="">-- Select subject --</option>`;
  els.filterSubject.innerHTML = `<option value="">-- Select subject --</option>`;
  subjects.forEach(s => {
    const opt1 = new Option(s.subjectName, s.subjectName);
    const opt2 = new Option(s.subjectName, s.subjectName);
    els.subjectSelect.add(opt1);
    els.filterSubject.add(opt2);
  });
}

// ---- QUERIES ----
async function loadQueriesBySubject(subjectName) {
  if (!subjectName) {
    els.list.innerHTML = "";
    showMsg(els.listMsg, "Select a subject first", false);
    return;
  }
  showMsg(els.listMsg, "Loading...");
  try {
    const res = await fetch(`${API_BASE}/queries/subject/${encodeURIComponent(subjectName)}`, { credentials: "include" });
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    renderQueries(data);
    showMsg(els.listMsg, data.length ? `Loaded ${data.length} question${data.length === 1 ? '' : 's'}.` : "No questions yet.", !!data.length);
  } catch (err) {
    console.error(err);
    showMsg(els.listMsg, "Error loading questions", false);
  }
}

function renderQueries(items) {
  els.list.innerHTML = "";
  if (!items || items.length === 0) {
    els.list.innerHTML = `<li class="center small">No questions found for this subject.</li>`;
    return;
  }

  items.forEach(q => {
    const li = document.createElement("li");
    li.className = "query-item";
    li.dataset.queryId = q.queryId;

    li.innerHTML = `
      <div class="query-head">
        <div>
          <div class="query-meta">#${q.queryId} • Learner ${q.learnerId}</div>
          <div class="query-text">${escapeHtml(q.query)}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
          <button class="btn btn-ghost btn-inline toggle-replies" data-qid="${q.queryId}" data-subject="${encodeURIComponent(q.subjectName)}">
            Show replies
          </button>
          <div class="small">${q.verify ? "✔ Verified" : "❌ Unverified"}</div>
        </div>
      </div>

      <div class="replies-wrapper" id="replies-wrapper-${q.queryId}" style="display:none;">
        <div class="replies-header">
          <div class="small">Replies</div>
          <div class="small" id="replies-count-${q.queryId}"></div>
        </div>
        <div class="reply-list" id="replies-${q.queryId}"></div>

        <form class="reply-form" data-qid="${q.queryId}" data-subject="${escapeHtmlAttr(q.subjectName)}">
          <textarea rows="2" placeholder="Write a reply..." required></textarea>
          <div style="display:flex; gap:8px;">
            <button type="submit" class="btn btn-secondary">Reply</button>
            <button type="button" class="btn btn-ghost cancel-reply">Cancel</button>
          </div>
          <div class="msg reply-msg" style="margin-top:6px;"></div>
        </form>
      </div>
    `;

    els.list.appendChild(li);
  });

  // Toggle replies
  document.querySelectorAll(".toggle-replies").forEach(btn => {
    btn.addEventListener("click", async () => {
      const qid = btn.dataset.qid;
      const wrapper = document.getElementById(`replies-wrapper-${qid}`);
      const currentlyHidden = wrapper.style.display === "none" || wrapper.style.display === "";
      if (currentlyHidden) {
        wrapper.style.display = "block";
        btn.textContent = "Hide replies";
        await loadReplies(decodeURIComponent(btn.dataset.subject), qid);
      } else {
        wrapper.style.display = "none";
        btn.textContent = "Show replies";
      }
    });
  });

  // Reply form handlers
  document.querySelectorAll(".reply-form").forEach(form => {
    const qid = form.dataset.qid;
    const replyMsg = form.querySelector(".reply-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const textarea = form.querySelector("textarea");
      const text = textarea.value.trim();
      if (!text) {
        showMsg(replyMsg, "Reply cannot be empty", false);
        return;
      }
      showMsg(replyMsg, "Posting...");
      const payload = {
        reply: text,
        subjectName: form.dataset.subject,
        query: { queryId: parseInt(qid, 10) },
        learnerId: currentLearner?.learnerId // attach learner ID
      };
      try {
        const res = await fetch(`${API_BASE}/reply/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Reply failed");
        }
        textarea.value = "";
        showMsg(replyMsg, "Reply posted.", true);
        await loadReplies(form.dataset.subject, qid);
      } catch (err) {
        console.error(err);
        showMsg(replyMsg, "Failed to post reply.", false);
      }
    });

    form.querySelectorAll(".cancel-reply").forEach(btn => {
      btn.addEventListener("click", () => {
        form.querySelector("textarea").value = "";
        showMsg(replyMsg, "");
      });
    });
  });
}

// ---- REPLIES ----
async function loadReplies(subjectName, queryId) {
  const container = document.getElementById(`replies-${queryId}`);
  const countEl = document.getElementById(`replies-count-${queryId}`);
  container.innerHTML = `<div class="small">Loading replies…</div>`;
  try {
    const res = await fetch(`${API_BASE}/reply/subject/${encodeURIComponent(subjectName)}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed replies fetch");
    const replies = await res.json();

    const filtered = replies.filter(r => {
      const rid = r.query && r.query.queryId ? parseInt(r.query.queryId, 10) : null;
      return rid === parseInt(queryId, 10);
    });

    container.innerHTML = "";
    if (!filtered || filtered.length === 0) {
      container.textContent = "No replies yet. Be the first to reply!";
      countEl.textContent = "";
      return;
    }

    filtered.forEach(r => {
      const div = document.createElement("div");
      div.className = "reply-item";
      const learnerLabel = `<div class="reply-meta">Learner ${r.learnerId} • ${r.verify ? "Verified" : "Unverified"}</div>`;
      const text = `<div>${escapeHtml(r.reply)}</div>`;
      div.innerHTML = learnerLabel + text;
      container.appendChild(div);
    });

    countEl.textContent = `${filtered.length} repl${filtered.length === 1 ? 'y' : 'ies'}`;
  } catch (err) {
    console.error("Replies error", err);
    container.textContent = "Failed to load replies.";
    countEl.textContent = "";
  }
}

// ---- SUBMIT NEW QUERY ----
els.form.addEventListener("submit", async e => {
  e.preventDefault();
  const subjectName = els.subjectSelect.value;
  const queryText = els.queryText.value.trim();
  if (!subjectName || !queryText) {
    showMsg(els.formMsg, "Fill all fields", false);
    return;
  }

  const payload = {
    query: queryText,
    subjectName,
    learnerId: currentLearner?.learnerId // attach learner ID
  };
  showMsg(els.formMsg, "Posting...");
  try {
    const res = await fetch(`${API_BASE}/queries/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Post failed");
    }
    const saved = await res.json();
    showMsg(els.formMsg, `Posted question #${saved.queryId}`, true);
    els.queryText.value = "";
    const currentFilter = els.filterSubject.value;
    if (currentFilter && currentFilter === subjectName) {
      await loadQueriesBySubject(subjectName);
    }
  } catch (err) {
    console.error(err);
    showMsg(els.formMsg, "Error posting question", false);
  }
});

// ---- INIT ----
(async function init() {
  await loadSession(); // load learner info first
  const subjects = await loadSubjects();
  renderSubjects(subjects);
})();

// Load button handler
els.loadBtn.addEventListener("click", () => {
  const subject = els.filterSubject.value;
  loadQueriesBySubject(subject);
});

/* ========= Helpers ========= */
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function escapeHtmlAttr(unsafe) {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
