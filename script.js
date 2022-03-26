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
    updateLoggedInProfile();
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
  // localStorage.removeItem(siteUsersKey);
  // Remove the currently logged in user key
  localStorage.removeItem(loggedInUserKey);
  // Send user back to home page
  window.location.href = '/index.html';
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
  constructor(name, idNumber, permissions, storeNumber, pfp) {
    this.name = name;
    this.idNumber = idNumber;
    this.permissions = permissions;
    this.storeNumber = storeNumber;
    this.pfp = pfp;
    this.employeeType = 'Employee';
  }
}

// Class for Manager
class Manager extends Employee {
  constructor(name, idNumber, permissions, storeNumber, pfp, employees) {
    super(name, idNumber, permissions, storeNumber, pfp);
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
    1,
    'user-employeeOne.png'
  );

  let employeeTwo = new Employee(
    'Joe Employee',
    13,
    { add: true, update: true, delete: false, list: true },
    1,
    'user-employeeTwo.png'
  );

  let managerOne = new Manager(
    'Billy Manager',
    45,
    { add: true, update: true, delete: true, list: true },
    1,
    'user-managerOne.png',
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
  // Grab the loggedInUser from localStorage
  let loggedInUser = getLoggedInUser();

  // If currently not on the login page
  if (!window.location.href.toLowerCase().includes('login.html')) {
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

function updateLoggedInProfile() {
  // Grab the loggedInUser from localStorage
  let loggedInUser = getLoggedInUser();

  // Grab DOM elements of user details
  let userPfp = document.getElementById('pfp');
  let userName = document.getElementById('user-name');
  let userEmpID = document.getElementById('user-emp-id');
  let userStoreID = document.getElementById('user-store-id');
  let userLevel = document.getElementById('user-level');

  // Update DOM values with the logged in current logged in user details
  if (userPfp) {
    userPfp.src = loggedInUser.employee.pfp;
  }

  if (userName) {
    userName.innerText = loggedInUser.employee.name;
  }

  if (userEmpID) {
    userEmpID.innerText = loggedInUser.employee.idNumber;
  }

  if (userStoreID) {
    userStoreID.innerText = loggedInUser.employee.storeNumber;
  }

  if (userLevel) {
    userLevel.innerText = loggedInUser.employee.employeeType;
  }

  doLoggedInCheck();
}

// BOOK LIST ---------------------------------------------------------------------------------------------
// Class for each book
class Book {
  constructor(title, author, genre, stock, price) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.stock = stock;
    this.price = price;
  }
}

// Create inital books (dummy data)
const books = [
  {
    title: 'The Cat in the Hat',
    author: 'Dr. Seuss',
    genre: 'Children',
    stock: 4,
    price: 1.99,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self Help',
    stock: 8,
    price: 12.99,
  },
  {
    title: 'Never Split the Difference',
    author: 'Chris Voss',
    genre: 'Self Help',
    stock: 2,
    price: 16.99,
  },
  {
    title: 'The Ride of a Lifetime',
    author: 'Robert Iger',
    genre: 'Memoir',
    stock: 4,
    price: 14.99,
  },
  {
    title: 'Rich Dad, Poor Dad',
    author: 'Robert Kiyosaki',
    genre: 'Personal Finance',
    stock: 5,
    price: 3.99,
  },
  {
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    genre: 'Science',
    stock: 1,
    price: 13.99,
  },
  {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    genre: 'Self Help',
    stock: 3,
    price: 23.99,
  },
  {
    title: 'Start With Why',
    author: 'Simon Sinek',
    genre: 'Business',
    stock: 10,
    price: 15.99,
  },
  {
    title: 'The Millionaire Next Door',
    author: 'Thomas Stanley',
    genre: 'Personal Finance',
    stock: 3,
    price: 9.99,
  },
  {
    title: 'How Will You Measure Your Life',
    author: 'Clayton Christensen',
    genre: 'Self Help',
    stock: 6,
    price: 19.99,
  },
];

// Grab the table body DOM
let inventoryTable = document.getElementById('inventory-table-body');

if (inventoryTable) {
  books.forEach(function (book) {
    let bookRow = document.createElement('tr');
    let bookTitle = document.createElement('td');
    let bookAuthor = document.createElement('td');
    let bookGenre = document.createElement('td');
    let bookStock = document.createElement('td');
    let bookPrice = document.createElement('td');

    bookTitle.innerHTML = book.title;
    bookAuthor.innerHTML = book.author;
    bookGenre.innerHTML = book.genre;
    bookStock.innerHTML = book.stock;
    bookPrice.innerHTML = book.price;

    bookRow.appendChild(bookTitle);
    bookRow.appendChild(bookAuthor);
    bookRow.appendChild(bookGenre);
    bookRow.appendChild(bookStock);
    bookRow.appendChild(bookPrice);

    inventoryTable.appendChild(bookRow);
  });
}

// ADD BOOK ----------------------------------------------------------------------------------------------
let addNewBookBtn = document.getElementById('add-new-book-button');

if (addNewBookBtn) {
  addNewBookBtn.addEventListener('click', addNewBook);
}

// Modal error message (hidden by default)
let modalError = document.getElementById('book-form-error');

function addNewBook() {
  // Allow user to input and save details to table
  let bookRow = document.createElement('tr');
  let bookTitle = document.createElement('td');
  let bookAuthor = document.createElement('td');
  let bookGenre = document.createElement('td');
  let bookStock = document.createElement('td');
  let bookPrice = document.createElement('td');

  bookTitle.innerHTML = document.getElementById('book-title').value;
  bookAuthor.innerHTML = document.getElementById('book-author').value;
  bookGenre.innerHTML = document.getElementById('book-genre').value;
  bookStock.innerHTML = document.getElementById('book-stock').value;
  bookPrice.innerHTML = document.getElementById('book-price').value;

  // Check if all input fields are filled in
  if (
    bookTitle.innerHTML != '' &&
    bookAuthor.innerHTML != '' &&
    bookGenre.innerHTML != '' &&
    bookStock.innerHTML != '' &&
    bookPrice.innerHTML != ''
  ) {
    // Add book to books array
    let newBook = new Book(
      `${bookTitle.innerHTML}`,
      `${bookAuthor.innerHTML}`,
      `${bookGenre.innerHTML}`,
      `${bookStock.innerHTML}`,
      `${bookPrice.innerHTML}`
    );
    books.push(newBook);

    // Append books details to each row
    bookRow.appendChild(bookTitle);
    bookRow.appendChild(bookAuthor);
    bookRow.appendChild(bookGenre);
    bookRow.appendChild(bookStock);
    bookRow.appendChild(bookPrice);
    // Append row to table
    inventoryTable.appendChild(bookRow);

    // Add event listeners to all rows in the inventory table
    for (let i = 0; i < inventoryTable.rows.length; i++) {
      inventoryTable.rows[i].addEventListener('click', function () {
        // Open model
        modal.style.display = 'block';
        // Display book details
        getBookDetails(i);
      });
    }

    // Close Modal
    modal.style.display = 'none';

    // Hide Add New Book button
    addNewBookBtn.style.display = 'none';

    // Hide error message (to reset)
    modalError.className = 'hide';

    // Reset form
    let modalForm = document.getElementById('add-book-form');
    modalForm.reset();
  } else {
    modalError.className = 'error-message-container';
  }
}

// UPDATE BOOK -------------------------------------------------------------------------------------------
// Add event listeners to all rows in the inventory table
for (let i = 0; i < inventoryTable.rows.length; i++) {
  inventoryTable.rows[i].addEventListener('click', function () {
    // Open model
    modal.style.display = 'block';
    // Display book details
    getBookDetails(i);
  });
}

// Current index being updated
let currBookUpdateIndex;

// Grab update book button DOM
let updateBookBtn = document.getElementById('update-book-button');
if (updateBookBtn) {
  updateBookBtn.addEventListener('click', updateBookDetails);
}

// Grate delete book button DOM
let deleteBookBtn = document.getElementById('delete-book-button');
if (deleteBookBtn) {
  deleteBookBtn.addEventListener('click', deleteBook);
}

// Function to open modal and pull book data when row is clicked
function getBookDetails(bookIndex) {
  currBookUpdateIndex = bookIndex;

  // Fill in existing details of the book
  let bookTitle = document.getElementById('book-title');
  bookTitle.value = books[bookIndex].title;

  let bookAuthor = document.getElementById('book-author');
  bookAuthor.value = books[bookIndex].author;

  let bookGenre = document.getElementById('book-genre');
  bookGenre.value = books[bookIndex].genre;

  let bookStock = document.getElementById('book-stock');
  bookStock.value = books[bookIndex].stock;

  let bookPrice = document.getElementById('book-price');
  bookPrice.value = books[bookIndex].price;

  // Show Update Book Button
  updateBookBtn.style.display = 'block';

  // If user is a manager level, show Delete Book button
  // Grab the loggedInUser from localStorage
  let loggedInUser = getLoggedInUser();
  if (loggedInUser.employee.permissions.delete == true) {
    deleteBookBtn.style.display = 'block';
  }
}

// Update book details when update book button is clicked
function updateBookDetails() {
  // Update details
  books[currBookUpdateIndex].title = document.getElementById('book-title').value;
  books[currBookUpdateIndex].author = document.getElementById('book-author').value;
  books[currBookUpdateIndex].genre = document.getElementById('book-genre').value;
  books[currBookUpdateIndex].stock = document.getElementById('book-stock').value;
  books[currBookUpdateIndex].price = document.getElementById('book-price').value;

  // Check if all input fields are filled in
  if (
    books[currBookUpdateIndex].title != '' &&
    books[currBookUpdateIndex].author != '' &&
    books[currBookUpdateIndex].genre != '' &&
    books[currBookUpdateIndex].stock != '' &&
    books[currBookUpdateIndex].price != ''
  ) {
    // clear table
    for (let i = inventoryTable.rows.length - 1; i >= 0; i--) {
      inventoryTable.deleteRow(i);
    }

    // reload the books array
    books.forEach(function (book) {
      let bookRow = document.createElement('tr');
      let bookTitle = document.createElement('td');
      let bookAuthor = document.createElement('td');
      let bookGenre = document.createElement('td');
      let bookStock = document.createElement('td');
      let bookPrice = document.createElement('td');

      bookTitle.innerHTML = book.title;
      bookAuthor.innerHTML = book.author;
      bookGenre.innerHTML = book.genre;
      bookStock.innerHTML = book.stock;
      bookPrice.innerHTML = book.price;
      bookRow.appendChild(bookTitle);
      bookRow.appendChild(bookAuthor);
      bookRow.appendChild(bookGenre);
      bookRow.appendChild(bookStock);
      bookRow.appendChild(bookPrice);

      inventoryTable.appendChild(bookRow);
    });

    // Add event listeners (again) to all rows in the inventory table
    for (let i = 0; i < inventoryTable.rows.length; i++) {
      inventoryTable.rows[i].addEventListener('click', function () {
        // Open model
        modal.style.display = 'block';
        // Display book details
        getBookDetails(i);
      });
    }

    // Close Modal
    modal.style.display = 'none';

    // Hide Update Book + Delete Book buttons
    updateBookBtn.style.display = 'none';
    deleteBookBtn.style.display = 'none';

    // Hide error message (to reset)
    modalError.className = 'hide';

    // Reset form
    let modalForm = document.getElementById('add-book-form');
    modalForm.reset();
  } else {
    modalError.className = 'error-message-container';
  }
}
// DELETE BOOK -------------------------------------------------------------------------------------------
function deleteBook() {
  // Delete book from array
  books.splice(currBookUpdateIndex, 1);

  // clear table
  for (let i = inventoryTable.rows.length - 1; i >= 0; i--) {
    inventoryTable.deleteRow(i);
  }

  // reload the books array
  books.forEach(function (book) {
    let bookRow = document.createElement('tr');
    let bookTitle = document.createElement('td');
    let bookAuthor = document.createElement('td');
    let bookGenre = document.createElement('td');
    let bookStock = document.createElement('td');
    let bookPrice = document.createElement('td');

    bookTitle.innerHTML = book.title;
    bookAuthor.innerHTML = book.author;
    bookGenre.innerHTML = book.genre;
    bookStock.innerHTML = book.stock;
    bookPrice.innerHTML = book.price;
    bookRow.appendChild(bookTitle);
    bookRow.appendChild(bookAuthor);
    bookRow.appendChild(bookGenre);
    bookRow.appendChild(bookStock);
    bookRow.appendChild(bookPrice);

    inventoryTable.appendChild(bookRow);
  });

  // Add event listeners (again) to all rows in the inventory table
  for (let i = 0; i < inventoryTable.rows.length; i++) {
    inventoryTable.rows[i].addEventListener('click', function () {
      // Open model
      modal.style.display = 'block';
      // Display book details
      getBookDetails(i);
    });
  }

  // Close Modal
  modal.style.display = 'none';

  // Hide Update Book + Delete Book buttons
  updateBookBtn.style.display = 'none';
  deleteBookBtn.style.display = 'none';

  // Hide error message (to reset)
  modalError.className = 'hide';

  // Reset form
  let modalForm = document.getElementById('add-book-form');
  modalForm.reset();
}

// MODAL FORM --------------------------------------------------------------------------------------------
let modal = document.getElementById('modal');

// Grab add button
let addBookBtn = document.getElementById('add-book');

// If Add button is clicked, display modal
if (addBookBtn) {
  addBookBtn.addEventListener('click', function () {
    // Show Modal
    modal.style.display = 'block';
    // Show Add Book button
    addNewBookBtn.style.display = 'block';
  });
}

// Close modal
let closeModal = document.getElementById('modal-close');

if (closeModal) {
  closeModal.addEventListener('click', function () {
    // Hide the modal and all buttons
    modal.style.display = 'none';
    addNewBookBtn.style.display = 'none';
    updateBookBtn.style.display = 'none';
    deleteBookBtn.style.display = 'none';
    // Reset form
    let modalForm = document.getElementById('add-book-form');
    modalForm.reset();
  });
}

// SORTING -------------------------------------------------------------------------------------------
function sortTable(n) {
  let i,
    shouldSwitch,
    switchcount = 0;

  let table = document.getElementById('inventory-table');

  let switching = true;

  // Set sorting direction to ascending
  let dir = 'asc';

  // Make a loop that will continue until no switching has been done
  while (switching) {
    // Start by saying that no switching is done
    switching = false;
    let rows = table.rows;

    // Loop through all table rows (except the first, which contains table headers)
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching
      shouldSwitch = false;

      // Get the 2 elements you want to compare, one from current row and one from the next row
      let x = rows[i].getElementsByTagName('td')[n];
      let y = rows[i + 1].getElementsByTagName('td')[n];

      // Check if the 2 rows should switch places, based on the direction (asc or desc)
      if (dir == 'asc') {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If yes, mark as a switch and break the loop
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If yes, mark as a switch and break the loop
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      // If a switch has been marked, make the switch and mark that a switch has been done
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1
      switchcount++;
    } else {
      // If no switching has been done AND the direction is 'asc', set the direction to 'desc' and run the while loop again
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
}
