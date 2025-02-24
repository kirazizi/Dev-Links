# 🚀 Link-Sharing App

A full-stack link-sharing application for developers, allowing users to create, manage, and preview their links in a developer-friendly interface. This project includes user authentication, database storage, and an optimized UI for various devices.

## ✨ Features

- 🔗 **CRUD Operations**: Users can create, read, update, and delete links.
- ✅ **Form Validations**: Ensures proper URL formats and required fields.
- 🎯 **Drag-and-Drop Sorting**: Reorder links with a simple drag-and-drop interface.
- 👤 **User Profile**: Add profile details including profile picture, first name, last name, and email.
- 📋 **Clipboard Copy**: Easily copy the profile link.
- 📱 **Responsive Design**: Optimized for all screen sizes.
- 🎨 **Hover & Focus States**: Enhances UX with interactive feedback.
- 🔒 **Authentication**: Secure user accounts with Auth0.
- 🛢️ **Database Integration**: Saves user data and links persistently using Hasura (PostgreSQL).

## 🛠️ Tech Stack

### 🌐 Frontend:

- ⚛️ React.js
- 🎨 Tailwind CSS
- 🖱️ React DnD (Drag-and-Drop)
- 🚀 Apollo Client (GraphQL queries & mutations)
- 📝 React Hook Form (Form handling & validation)

### 💾 Backend:

- 🔗 Hasura (GraphQL API with PostgreSQL)
- 🔑 Auth0 (User authentication)

## ⚙️ Setup Instructions

### 📌 Prerequisites

Ensure you have the following installed:

- 🟢 Node.js & npm
- 🛢️ PostgreSQL

### 📥 Installation

#### 1️⃣ Clone the repository

```sh
git clone https://github.com/kirazizi/Dev-Links.git
cd Dev-Links
```

#### 2️⃣ Install dependencies

```sh
# Install frontend dependencies
npm install
```

#### 3️⃣ Set up environment variables

Create a `.env` file and configure:

```sh
VITE_AUTH0_DOMAIN = (your Auth0 tenant domain)
VITE_AUTH0_CLIENT_ID = (identifier for your application)
VITE_AUTH0_CLIENT_SECRET = (secret key for authenticating your application)
VITE_AUTH0_AUDIENCE = (the intended recipient of the Auth0 token, such as your API endpoint)
VITE_HASURA_GRAPHQL_URL = (endpoint for your Hasura GraphQL API)
VITE_HASURA_X_SECRET = (secret key for authorizing requests to Hasura)
VITE_CLOUDINARY_CLOUD_NAME = (identifier for your Cloudinary account)
VITE_BASE_LINK = (base URL for your local or production environment)
```

#### 4️⃣ Run the project

```sh
# Start frontend
npm run dev
```

## 🔍 GraphQL Queries & Mutations

### 🔐 Authentication

- Handled via Auth0 with JWT tokens

### 🔗 Links

- 📌 Query: Fetch user links from Hasura
- ✏️ Mutation: Create, update, and delete links via GraphQL API

### 👤 Profile

- 📌 Query: Fetch user profile data
- ✏️ Mutation: Update user profile

## 🚀 Deployment

- 🌍 **Frontend:** Deploy on Vercel or Netlify
- 🛢️ **Database & API:** Hasura Cloud
- 🔑 **Authentication:** Auth0

## 🔮 Future Improvements

- 🔓 Add social media login (Google, GitHub, etc.)
- 🌙 Implement dark mode
- 🔗 Enable custom domain linking

