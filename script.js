// LOGIN SCRIPTS ------------------------------------------------------------------------------------------
// Grab login form DOM element
let loginFormDOM = document.getElementById('sign-in-form');

// Add event listener to form on submit
if (loginFormDOM) {
  loginFormDOM.addEventListener('submit', submitLogin);
}

// Grab the site's users
let siteUsersKey = 'site-Users';
function getSiteUsers() {
  return localStorage.getItem(siteUsersKey) ? JSON.parse(localStorage.getItem(siteUsersKey)) : [];
}

// Get the currently logged in user
let loggedInUserKey = 'logged-in-user';
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem(loggedInUserKey));
}

// Runs when form is submitted
function submitLogin(e) {
  // Grab the DOMs containing user's username/password inputs
  let usernameInput = document.getElementById('username');
  let passwordInput = document.getElementById('password');

  // Pass in the user's username/password value inputs and run login test
  // Returns the result object with error message or empty string
  let loginResult = doFormLogin(usernameInput.value, passwordInput.value);

  // If the login has passed, redirect to inventory page
  if (loginResult.pass) {
    e.preventDefault();
    window.location.href = 'inventory.html';
    // If the login has failed, show error message
  } else {
    showLoginError(loginResult.message, true);
    e.preventDefault();
  }
}

// Return error message if login fails (wrong username/password)
function doFormLogin(username, password) {
  // Error message that would appear if login fails
  // The pass represents whether the login has passed or failed
  let result = { pass: false, message: 'Invalid username and/or password' };

  // If login is successful, change error message to empty string
  if (login(username, password)) {
    result = { pass: true, message: '' };
  }
  // Return the object with the error message (or empty string if no error)
  return result;
}

// If there is an error message, this function will show it
function showLoginError(errorMessage, show) {
  // Grab error message container
  const loginErrorContainer = document.getElementById('login-error');
  // Grab the error message text div
  const loginError = document.getElementById('login-error-message');
  // Update the login error message text
  loginError.innerText = errorMessage;

  // As a default, have error message container class be hidden
  loginErrorContainer.className = 'hide';

  // If the show parameter is true (as in login error occurred), update container class to be shown
  if (show) {
    loginErrorContainer.className = 'error-message-container';
  }
}

// Set the current user as logged in
function setLoggedInUser(user) {
  localStorage.setItem(loggedInUserKey, JSON.stringify(user));
  return JSON.parse(localStorage.getItem(loggedInUserKey));
}

// 1) Check if username/password match + 2) Lock in who is the currently logged in user
function login(username, password) {
  // Reset the current logged in user
  setLoggedInUser(null);
  // Change the logged in state to false
  let loggedIn = false;
  // Grab list of all site users
  let users = getSiteUsers();
  // Loop through each user for username/password match
  for (let i = 0; i < users.length; i++) {
    // If matched, set the current logged in user to the matched user
    if (username === users[i].username && password === users[i].password) {
      setLoggedInUser(users[i]);
      // Change the logged in state to false
      loggedIn = true;
      break;
    }
  }
  // return the logged in state to true (if someone is successfully logged in)
  return loggedIn;
}

// LOGOUT SCRIPTS ----------------------------------------------------------------------------------------
// Grab logout button DOM element
let logoutButtonDOM = document.getElementById('logout-button');

// Add event listener to form on submit
if (logoutButtonDOM) {
  logoutButtonDOM.addEventListener('click', logout);
}

function logout() {
  console.log('logged out');
  // Remove the currently logged in user key
  localStorage.removeItem(loggedInUserKey);
  // Send user back to home page
  window.location.href = 'index.html';
}

// USER SCRIPTS ------------------------------------------------------------------------------------------
// Manager's permission set
let permissionSet = { add: true, update: true, delete: true, list: true };

// Class for site user
class SiteUser {
  constructor(username, password, employee) {
    this.username = username;
    this.password = password;
    this.employee = employee;
  }
}
// Class for Employee
class Employee {
  constructor(name, idNumber, permissions, storeNumber) {
    this.name = name;
    this.idNumber = idNumber;
    this.permissions = permissions;
    this.storeNumber = storeNumber;
    this.employeeType = 'Employee';
  }
}

// Class for Manager
class Manager extends Employee {
  constructor(name, idNumber, permissions, storeNumber, employees) {
    super(name, idNumber, permissions, storeNumber);
    this.employees = employees;
    this.employeeType = 'Manager';
  }
}

// Set up the user storage
function setUpUsersStorage() {
  if (!localStorage.getItem(siteUsersKey)) {
    localStorage.setItem(siteUsersKey, JSON.stringify([]));
  }
}

// Add a site user
function addSiteUser(username, password, employee) {
  // Check if users array exists already
  // If exists, read it from JSON; otherwise return an empty array
  let users = getSiteUsers();

  // Create a new SiteUser with a username, the password, and employee
  let newUser = new SiteUser(username, password, employee);

  // Push the new user into the user array
  users.push(newUser);

  // Save the user array by converting it into a JSON string
  localStorage.setItem(siteUsersKey, JSON.stringify(users));
}

// Create inital users (dummy data)
function createInitialUsers() {
  let employeeOne = new Employee(
    'Bob Employee',
    21,
    { add: true, update: true, delete: false, list: true },
    1
  );

  let employeeTwo = new Employee(
    'Joe Employee',
    13,
    { add: true, update: true, delete: false, list: true },
    1
  );

  let managerOne = new Manager(
    'Billy Manager',
    45,
    { add: true, update: true, delete: true, list: true },
    1,
    [employeeOne, employeeTwo]
  );

  addSiteUser('employee1', 'password123', employeeOne);
  addSiteUser('manager1', 'password456', managerOne);
}

// Run demo setup
function doSetup() {
  setUpUsersStorage();
  let siteUserArr = getSiteUsers();
  if (siteUserArr.length < 1) {
    createInitialUsers();
  }
}

// Check if a user is logged in
function doLoggedInCheck() {
  // If currently not on the login page
  if (!window.location.href.toLowerCase().includes('login.html')) {
    // Grab the loggedInUser from localStorage
    let loggedInUser = getLoggedInUser();

    // If the loggedInUser is null, this means no user is logged in -- send person to login page
    if (loggedInUser == null) {
      window.location.href = 'login.html';
    }
    // If current on the login page
  } else {
    // Run setup
    doSetup();
  }
}

doSetup();
