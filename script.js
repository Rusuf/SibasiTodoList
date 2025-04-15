// Constants
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_MIN_LENGTH = 8;

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const dashboardTodoList = document.getElementById('dashboardTodoList');

// Navigation Menu Toggle
if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Login Form Validation
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginButton = document.getElementById('loginButton');

    const validateEmail = () => {
        const isValid = EMAIL_REGEX.test(emailInput.value);
        emailError.textContent = isValid ? '' : 'Please enter a valid email address';
        return isValid;
    };

    const validatePassword = () => {
        const isValid = passwordInput.value.length >= PASSWORD_MIN_LENGTH;
        passwordError.textContent = isValid ? '' : 'Password must be at least 8 characters long';
        return isValid;
    };

    const validateForm = () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        loginButton.disabled = !(isEmailValid && isPasswordValid);
    };

    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        sessionStorage.setItem('userEmail', email);
        window.location.href = 'dashboard.html';
    });
}

// Todo List Functionality
const todoInput = document.getElementById('todoInput');
const startTimeInput = document.getElementById('startTime');
const durationSelect = document.getElementById('duration');
const timeDisplay = document.getElementById('timeDisplay');
const timePickerDropdown = document.getElementById('timePickerDropdown');
const selectedTimeSpan = document.getElementById('selectedTime');

// Load todos from localStorage
const loadTodos = () => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
};

// Save todos to localStorage
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Format time for display
const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Get day container by date
const getDayContainer = (date) => {
    const dayDate = new Date(date);
    const day = dayDate.getDate();
    const containers = document.querySelectorAll('[data-date]');
    return Array.from(containers).find(container => 
        parseInt(container.getAttribute('data-date')) === day
    );
};

// Create task element
const createTaskElement = (todo) => {
    const startTime = new Date(todo.startTime);
    const timeSlot = document.createElement('div');
    timeSlot.className = 'grid grid-cols-12 gap-4';
    
    const timeLabel = document.createElement('div');
    timeLabel.className = 'col-span-2 text-sm text-gray-500';
    timeLabel.textContent = formatTime(startTime);
    
    const taskContainer = document.createElement('div');
    taskContainer.className = 'col-span-10';
    
    const task = document.createElement('div');
    task.className = 'bg-primary/20 text-primary rounded-xl px-4 py-2 flex justify-between items-center';
    task.innerHTML = `
        <span>${todo.text}</span>
        <div class="flex gap-2">
            <button onclick="editTodo(${todo.id})" class="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
            <button onclick="deleteTodo(${todo.id})" class="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    
    taskContainer.appendChild(task);
    timeSlot.appendChild(timeLabel);
    timeSlot.appendChild(taskContainer);
    
    return timeSlot;
};

// Render todos
const renderTodos = () => {
    const todos = loadTodos();
    
    // Clear existing tasks
    document.querySelectorAll('.grid-cols-12').forEach(grid => {
        if (!grid.querySelector('.text-sm')) return; // Skip if not a task grid
        grid.remove();
    });
    
    // Sort todos by date and time
    todos.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    // Add todos to appropriate day containers
    todos.forEach(todo => {
        const dayContainer = getDayContainer(todo.startTime);
        if (dayContainer) {
            dayContainer.appendChild(createTaskElement(todo));
        }
    });
};

// Initialize todo form if present
if (todoInput) {
    let todos = loadTodos();

    window.addTodo = (text, startTime, duration) => {
        todos.push({
            id: Date.now(),
            text,
            startTime,
            duration: parseInt(duration),
            completed: false
        });
        saveTodos(todos);
        renderTodos();
    };

    window.editTodo = (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const startTime = new Date(todo.startTime);
        const timeStr = startTime.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        const newText = prompt('Edit task:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            
            const newTime = prompt('Edit start time (HH:MM):', timeStr);
            if (newTime && /^\d{2}:\d{2}$/.test(newTime)) {
                const [hours, minutes] = newTime.split(':');
                const newStartTime = new Date(startTime);
                newStartTime.setHours(parseInt(hours), parseInt(minutes), 0);
                todo.startTime = newStartTime.toISOString();
            }

            const newDuration = prompt('Edit duration (in minutes):', todo.duration);
            if (newDuration && !isNaN(newDuration)) {
                todo.duration = parseInt(newDuration);
            }

            saveTodos(todos);
            renderTodos();
        }
    };

    window.deleteTodo = (id) => {
        todos = todos.filter(t => t.id !== id);
        saveTodos(todos);
        renderTodos();
    };

    // Time picker functionality
    if (timeDisplay && timePickerDropdown) {
        // Toggle time picker dropdown
        timeDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            timePickerDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!timePickerDropdown.contains(e.target) && !timeDisplay.contains(e.target)) {
                timePickerDropdown.classList.add('hidden');
            }
        });

        // Handle time selection
        document.querySelectorAll('.time-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const timeText = e.target.textContent;
                selectedTimeSpan.textContent = timeText;
                
                // Convert 12-hour format to 24-hour for the hidden input
                const [time, period] = timeText.split(' ');
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours);
                
                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                
                startTimeInput.value = `${String(hours).padStart(2, '0')}:${minutes}`;
                timePickerDropdown.classList.add('hidden');
            });
        });
    }

    // Submit task function
    window.submitTask = () => {
        const text = todoInput.value.trim();
        if (text === '') return;

        if (!startTimeInput.value) {
            // If no time selected, use current time
            const now = new Date();
            startTimeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            selectedTimeSpan.textContent = now.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        const [hours, minutes] = startTimeInput.value.split(':');
        const startTime = new Date();
        startTime.setHours(parseInt(hours), parseInt(minutes), 0);

        addTodo(text, startTime.toISOString(), durationSelect.value);
        todoInput.value = '';
        startTimeInput.value = '';
        selectedTimeSpan.textContent = '--:-- --';
    };

    // Add enter key support for the input
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitTask();
            }
        });
    }

    // Initial render
    renderTodos();
}

// Logout Functionality
window.logout = () => {
    sessionStorage.removeItem('userEmail');
    window.location.href = 'index.html';
};

// Create dashboard task element
const createDashboardTaskElement = (todo) => {
    const startTime = new Date(todo.startTime);
    const li = document.createElement('li');
    li.className = 'bg-white/50 dark:bg-dark-300/50 rounded-xl p-4 transition-all duration-200 hover:bg-white/80 dark:hover:bg-dark-300/80';
    
    li.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-primary'}"></div>
                <span class="text-gray-800 dark:text-gray-100 font-medium">${todo.text}</span>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">${formatTime(startTime)}</span>
        </div>
    `;
    
    return li;
};

// Render dashboard todos
const renderDashboardTodos = (element) => {
    if (!element) return;
    
    const todos = loadTodos();
    element.innerHTML = '';
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter and sort today's tasks
    const todaysTasks = todos
        .filter(todo => {
            const taskDate = new Date(todo.startTime);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    if (todaysTasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'text-center py-4 text-gray-500 dark:text-gray-400';
        emptyState.textContent = 'No tasks for today';
        element.appendChild(emptyState);
        return;
    }
    
    todaysTasks.forEach(todo => {
        element.appendChild(createDashboardTaskElement(todo));
    });
};

// Initialize dashboard todo list if present
if (dashboardTodoList) {
    renderDashboardTodos(dashboardTodoList);
}

// Profile Management
function getEmailFromStorage() {
    return sessionStorage.getItem('userEmail');
}

function getInitials(email) {
    if (!email) return '';
    const username = email.split('@')[0];
    return username.slice(0, 3).toUpperCase();
}

function updateProfileUI() {
    const email = getEmailFromStorage();
    if (!email) {
        window.location.href = 'index.html';
        return;
    }

    const initials = getInitials(email);
    
    // Update profile dropdown
    const profileInitials = document.getElementById('profileInitials');
    const profileEmail = document.getElementById('profileEmail');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const welcomeInitials = document.getElementById('welcomeInitials');
    
    if (profileInitials) profileInitials.textContent = initials;
    if (profileEmail) profileEmail.textContent = email;
    if (dropdownEmail) dropdownEmail.textContent = email;
    if (welcomeInitials) welcomeInitials.textContent = initials;
}

function setupProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;

    const button = dropdown.querySelector('button');
    const content = dropdown.querySelector('div.hidden');

    button.addEventListener('click', () => {
        content.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            content.classList.add('hidden');
        }
    });
}

// Update login form to store email
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            sessionStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html';
        });
    }

    // Initialize profile if on dashboard or other protected pages
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('home.html') || 
        window.location.pathname.includes('cards.html')) {
        updateProfileUI();
        setupProfileDropdown();
    }
}); 