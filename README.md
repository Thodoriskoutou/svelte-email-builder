# 📧 Email Builder with Svelte 5 & PocketBase

Welcome to the Email Builder project! This application lets you create and manage newsletter designs using Svelte 5, PocketBase, and TypeScript with the powerful Unlayer React Email Editor.

![Tech Stack](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)
![PocketBase](https://img.shields.io/badge/PocketBase-DB-2C4D7E)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js
- PocketBase instance

### Installation
Clone the repository
```bash
git clone https://github.com/yourusername/email-builder.git
cd email-builder

```
### Install dependencies
```bash
bun install
# or
npm install
```
### Running the Project
```bash
bun run dev
# or
npm run dev
```
# ⚙️ Setup
PocketBase Configuration
Import the pb_schema.json to your PocketBase instance

Make sure your PocketBase server is running

Environment Variables
See .env.example for required variables:
```bash
POCKETBASE_URL=http://127.0.0.1:8090
OAUTH2_PROVIDER=mailcow
AUTOSAVE_INTERVAL=60
```
# 📚 Project Overview
This email builder was created as part of a Full Stack Internship Assignment. Key features:

Drag-and-drop email template creation

Newsletter management

Responsive design

Type-safe development with TypeScript

🛠️ Tech Stack
Frontend: Svelte 5

Backend: PocketBase

Editor: React Email Editor

Package Manager: Bun (Node.js compatible)

# 🔄 Contributing
Contributions are welcome! Please:

Fork the repository

Create your feature branch

Commit your changes

Push to the branch

Open a pull request

# 📧 Resources
Unlayer React Email Editor Docs

Svelte Documentation

PocketBase Documentation

Happy coding! 👨‍💻👩‍💻