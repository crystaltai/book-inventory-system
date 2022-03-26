# Books Inventory system

Project to create an inventory system for books using only HTML, CSS and Vanilla JS. This was a front-end application only utilizing dummy data, so does not incorporate database usage.

**🔗 Live preview:** https://crystaltai.github.io/book-inventory-system/

- To login, use username: '**manager1**' and password: '**password456**'

  ![](https://github.com/crystaltai/book-inventory-system/blob/main/book-inventory-system-demo.gif)

## Built with

### Technologies

- HTML
- CSS
- JS

### Tools

- Visual Studio Code
- Git and GitHub

### Third party code

- [Google Fonts](https://fonts.google.com/)
- [Font Awesome](https://fontawesome.com/)

## Summary

### What I learned

- Login page simulation by redirecting a user to the inventory page when the correct credentials are submitted
- Utilized browser's localeStorage to store employee profiles and pull logged-in user details to display on website after logging in
- Created Employee class to instantiate employee objects that contained employee details and permission rights (Manager vs Employee)
- Created Manager class that extended Employee
- Used pop-up modal forms to allow users to add / update / delete books
- Utilized permission rights (a property in each employee object) to hide the 'delete' button from users with Employee access rights, to disable employee from deleting books
- Areas to focus on improving:
  > - Folder structure - I was having file-linking issues with Github pages, so have kept all files in main root folder, as well as maintained all script code in one file (not ideal)
  > - Refactoring - I need to refactor some of the functions that repeated the same code behavior, particularly around refreshing the inventory table after a book is added / updated / deleted

### Project Summary

3/25/22

- I built a simple book inventory system to track books, including information on title, author, genre, stock count and price. The website only contains the front-end functionality and doesn't link to a backend or database; as such, the books and users included in the website are dummy data that added direclty within the script file.
- The sign-in page incorporates a login form, which only includes fields for username/password (user credentials were pre-created in script file). Functionalities like forgot password and create new user accounts were excluded.
- Once logged in, employee details of the currently logged-in user are displayed in the left sidebar
- The book inventory table allows for users to add / update / delete books by submitting modal forms, as well as allows for sorting books by alphabetical order by clicking on the table headers
  > - User access levels includes 2 types:
  >   > - Managers - Can add / update / delete books
  >   > - Employees - Can add / update books (no deleting)
