# **Todo app**

This is my final project in the course BackEnd 1 - JavaScript!

## **Table of Content**

1. [Project structure](https://github.com/MikaMunterud/todo-app/tree/main#project-structure)
   1. [Homepage](https://github.com/MikaMunterud/todo-app/tree/main#homepage)
   2. [Todo lists](https://github.com/MikaMunterud/todo-app/tree/main#todo-lists)
   3. [Tasks](https://github.com/MikaMunterud/todo-app/tree/main#tasks)
   4. [User settings](https://github.com/MikaMunterud/todo-app/tree/main#user-settings)
2. [Getting started](https://github.com/MikaMunterud/todo-app/tree/main#getting-started)
3. [Database structure](https://github.com/MikaMunterud/todo-app/tree/main#database-structure)
4. [Assignment description](https://github.com/MikaMunterud/todo-app/tree/main#assignment-description)

## **Project structure**

This todo app allows a user to register an account in this fictive app FIX IT✓.

When registered, they can login and access all the applications different functions.

A user can add a friend who must be a user of this application. After a friend request has been sent, the friend must verify the request and after approving they can access that users todo lists. 

However, if the friend wants a user to access their todo lists, they have to send a friend request back which also needs to be verified.

A user can only edit or delete their own todo lists but if they have access to a friends todo lists, they can edit, check or delete each task inside of the todo list.

### **Homepage**

The homepage of this project starts with a login page. If the user does not have an account they can click the link to register an account and input a username and password.

![todo-app homepage](https://icicathy.sirv.com/todo%20app/Todo%20app%20Homepage.png)

### **Todo lists**

When the user has successfully logged in, they will be redirected to where all their own todo lists and their verified friends todo lists.

Here they can add a new todo list and also search for a specific todo list based on its name or the "owner's" name.

![todo-app todo lists](https://icicathy.sirv.com/todo%20app/Todo%20app%20todo-lists.png)

### **Tasks**

A user can add new tasks in each todo list. Each task can thereafter be marked if the task has been done or not, it can be edited or be deleted. This is accessible for the users own todo lists and the users verified friends tod lists.

![todo-app tasks](https://icicathy.sirv.com/todo%20app/Todo%20app%20tasks.png)

### **User settings**

In the user settings, a user can see all their received friend requests, their sent friend requests and what status they have.
A received friend request can either be approved or rejected and all the sent friend requests can only be deleted

Here the user can also send a new friend request, search for a friend, edit their own password, delete their account or logout from the application.

![todo-app user settings](https://icicathy.sirv.com/todo%20app/Todo%20app%20user%20settings.png)

## **Getting started**

If you clone this repository and want to run it on your own device, you need to install all node modules.

You will achieve this by writing npm install in both the client and the server folder.

In the server folder, you will also need to add a .env file with the following structure:

```js
SECRET="secret-code-that-is-secure"

DATABASE_USER="[your-db-username]"
DATABASE_PASSWORD="[your-db-password]"
DATABASE_HOST="[your-db-host]"
DATABASE_DATABASE="todo"
```

## **Database structure**

![relational database structure](https://icicathy.sirv.com/todo%20app/Todo-app.drawio.png)

## **Assignment description**

You will build a to-do application where a user can create a todo list, add things to their list, mark things as done, and be able to remove things from their list.

You need to build a server and a website. You will not be judged for the appearance of the page, so it can be pure HTML, completely without styling. The purpose of the page is to show that you can connect a front-end with a back-end.

The user's lists must be saved in a database, it is not enough to save the information on the server.

In the application, you should be able to:

* Register
* Sign in
* Create a todo list (if you are logged in)
* Adding things to a todo list (if you are logged in)
* Remove items from a todo list (if you are logged in)
* Edit items from a todo list (if you are logged in)
* If you as a user log in, you must be able to leave the website and come back without having to log in again. Use cookies for this.

#### **For VG (Very Good grade)**

* You should be able to have several lists
* You should also be able to add to other users as friends, and then be able to see their lists