<!-- # Taskpro

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page. -->


#  Project Name

Student and Product Application Management with **Angular (Frontend)** and **FeathersJS (Backend API)**.

---

##  Features

i REST + real-time API (FeathersJS)
ii Angular frontend UI
iii Authentication (if applicable)

---

##  Additional Features
i   Angular Material UI
ii  JS Tree Implementation
iii Font Awesome for icons


## JS Tree Implementation
##  JS Tree Implementation (Angular)

Follow the steps below to integrate a basic JS Tree structure in the Angular frontend:

### 1. Install Required Library

Install jQuery and jsTree:

```bash
npm install jquery jstree
```

---

### 2. Add Scripts in Angular Configuration

Update `angular.json`:

```json
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/jstree/dist/jstree.min.js"
],
"styles": [
  "node_modules/jstree/dist/themes/default/style.min.css"
]
```

---

### 3. Import jQuery in Component

```ts
declare var $: any;
```

---

### 4. Create HTML Container

```html
<div id="jstree"></div>
```

---

### 5. Initialize JsTree in Component

```ts
// ngOnInit() {
//   $('#jstree').jstree({
//     'core': {
//       'data': [
//         {
//           "text": "Frontend",
//           "children": [
//             { "text": "Components" },
//             { "text": "Services" }
//           ]
//         },
//         {
//           "text": "Backend",
//           "children": [
//             { "text": "Auth Service" },
//             { "text": "User Service" }
//           ]
//         }
//       ]
//     }
//   });
// }
```

---

### 6. Run the Application

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---
 


##  Tech Stack

### Frontend

Angular
TypeScript
 
### Backend

FeathersJS V5

### DB

Mongodb


---

 

##  Run Commands

###  Start Backend (FeathersJS)

cd backend
npm install
npm run dev


### service creation
  feathers generate service 
### authentication service creation
  feathers generate authentication
### Hooks creation
  feathers generate hook

Runs API on:

```
http://localhost:3030
```

---

###  Start Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

Runs app on:

```
http://localhost:4200
```

---
 

---
## service creation
  ng g s user
## Guard creation
  ng g g checkauth
### component creation
  ng g c component_name


##  Module Mapping (Logical View)

```
Frontend (Angular)
├── Login Module
├── Dashboard Module
 
Backend (FeathersJS)
├── User Service
├── Product Service
├── Student Services
```

---
 