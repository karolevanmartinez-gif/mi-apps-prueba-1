const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskTemplate = document.getElementById('taskTemplate');
const totalTasks = document.getElementById('totalTasks');
const activeTasks = document.getElementById('activeTasks');
const completedTasks = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

const tasks = [
  { id: 1, text: 'Diseñar la interfaz de la app', completed: false },
  { id: 2, text: 'Revisar los detalles del proyecto', completed: true },
  { id: 3, text: 'Preparar la entrega final', completed: false }
];

function renderTasks() {
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  taskList.innerHTML = '';

  filteredTasks.forEach((task) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.task-item');
    const checkbox = fragment.querySelector('input[type="checkbox"]');
    const text = fragment.querySelector('.task-text');
    const deleteBtn = fragment.querySelector('.delete-btn');

    item.dataset.id = String(task.id);
    if (task.completed) item.classList.add('completed');

    checkbox.checked = task.completed;
    text.textContent = task.text;

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    deleteBtn.addEventListener('click', () => {
      const index = tasks.findIndex((entry) => entry.id === task.id);
      if (index >= 0) {
        tasks.splice(index, 1);
        renderTasks();
      }
    });

    taskList.appendChild(fragment);
  });

  updateStats();
}

function updateStats() {
  totalTasks.textContent = String(tasks.length);
  activeTasks.textContent = String(tasks.filter((task) => !task.completed).length);
  completedTasks.textContent = String(tasks.filter((task) => task.completed).length);
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = taskInput.value.trim();
  if (!value) return;

  tasks.unshift({
    id: Date.now(),
    text: value,
    completed: false
  });

  taskInput.value = '';
  taskInput.focus();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].completed) {
      tasks.splice(i, 1);
    }
  }

  renderTasks();
});

renderTasks();
