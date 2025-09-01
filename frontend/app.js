const API_BASE = "http://localhost:3000"; 
let isLogin = true;

// Toggle login/signup
document.addEventListener("DOMContentLoaded", () => {
  const toggleText = document.getElementById("toggle-text");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");

  function updateForm() {
    formTitle.innerText = isLogin ? "Login" : "Sign Up";
    submitBtn.innerText = isLogin ? "Login" : "Sign Up";
    toggleText.innerHTML = isLogin
      ? `New user? <a href="#" id="toggle-link">Sign up</a>`
      : `Already have an account? <a href="#" id="toggle-link">Login</a>`;

    document.getElementById("toggle-link").addEventListener("click", (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      updateForm();
    });
  }

  if (toggleText) updateForm();

  const authForm = document.getElementById("auth-form");
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      if (!username || !password) return alert("Please fill all fields");

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  // Dashboard logic
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
    loadTasks();

    // Handle Add Task
    const taskForm = document.getElementById("task-form");
    if (taskForm) {
      taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value.trim();
        const description = document.getElementById("task-desc").value.trim();
        if (!title || !description) return alert("Fill in all fields");

        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE}/tasks`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json", 
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ title, description }),
          });
          const data = await res.json();
          if (res.ok) {
            loadTasks();
            taskForm.reset();
          } else {
            alert(data.message || "Failed to add task");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }
});

// Load tasks in dashboard
async function loadTasks() {
  const tasksList = document.getElementById("tasks-list");
  const statsDiv = document.getElementById("task-stats");
  if (!tasksList) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
      return;
    }

    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    tasksList.innerHTML = "";
    if (res.ok && data.tasks) {
      data.tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${task.title}</strong> - ${task.status} <br/>
          <small>${task.description}</small><br/>
          <select class="status-select">
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
          <button class="delete-btn">Delete</button>
        `;

        // Update status
        li.querySelector(".status-select").addEventListener("change", async (e) => {
          const newStatus = e.target.value;
          await fetch(`${API_BASE}/tasks/${task.id}`, {
            method: "PUT",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus }),
          });
          loadTasks();
        });

        // Delete task
        li.querySelector(".delete-btn").addEventListener("click", async () => {
          await fetch(`${API_BASE}/tasks/${task.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          loadTasks();
        });

        tasksList.appendChild(li);
      });

      // Show stats
      if (statsDiv) {
        statsDiv.innerHTML = `
          <p>Total: ${data.stats.total}</p>
          <p>Completed: ${data.stats.completed}</p>
          <p>Pending: ${data.stats.pending}</p>
          <p>In Progress: ${data.stats.inProgress}</p>
        `;
      }
    } else {
      alert(data.message || "Failed to load tasks");
    }
  } catch (err) {
    console.error(err);
  }
}
