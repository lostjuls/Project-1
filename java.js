const toggleForm = document.getElementById('toggle-form');
const authForm = document.getElementById('authForm');
const authButton = document.getElementById('authButton');
const formTitle = document.getElementById('form-title');
const toggleText = document.getElementById('toggle-text');
const projectForm = document.getElementById('projectForm');
const portfolioDisplay = document.getElementById('portfolioDisplay');
const generatePortfolioButton = document.getElementById('generatePortfolio');

let isLogin = true;
let portfolioItems = [];

// Switch between Login and Register
toggleForm.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Login' : 'Register';
  authButton.textContent = isLogin ? 'Login' : 'Register';
  toggleText.textContent = isLogin ? "Don't have an account?" : 'Already have an account?';
  toggleForm.textContent = isLogin ? 'Register' : 'Login';
});

// Handle Login and Register
authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (!username || !password) {
    alert('Please fill in all fields!');
    return;
  }

  if (isLogin) {
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem('loggedIn', JSON.stringify(user));
      alert('Login successful!');
      location.reload();
    } else {
      alert('Invalid username or password!');
    }
  } else {
    if (users.some((user) => user.username === username)) {
      alert('This username is already taken. Please choose another.');
    } else {
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please log in.');
      location.reload();
    }
  }
});

// Logout Functionality
document.getElementById('logoutButton')?.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  alert('You have been logged out.');
  location.reload();
});

// Portfolio Upload Handling
projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const files = document.getElementById('file').files;

  if (files.length === 0) {
    alert('Please select at least one file.');
    return;
  }

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const portfolioItem = {
        title,
        description,
        file: e.target.result,
      };
      portfolioItems.push(portfolioItem);

      const card = document.createElement('div');
      card.classList.add('col-md-4');
      card.innerHTML = `
        <div class="card shadow-sm">
          <img src="${e.target.result}" class="card-img-top" alt="Project Image">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
          </div>
        </div>
      `;
      portfolioDisplay.appendChild(card);
    };
    reader.readAsDataURL(file);
  });

  projectForm.reset();
});

// Generate Portfolio
generatePortfolioButton?.addEventListener('click', () => {
  if (portfolioItems.length === 0) {
    alert('No files in your portfolio to generate.');
    return;
  }

  let portfolioContent = '';
  portfolioItems.forEach((item, index) => {
    portfolioContent += `
      <h3>Project ${index + 1}: ${item.title}</h3>
      <p>${item.description}</p>
      <img src="${item.file}" alt="Project Image" style="max-width: 100%; height: auto; margin-bottom: 20px;">
      <hr>
    `;
  });

  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <html>
      <head>
        <title>Your Portfolio</title>
      </head>
      <body>
        ${portfolioContent}
      </body>
    </html>
  `);
  newWindow.document.close();
});
