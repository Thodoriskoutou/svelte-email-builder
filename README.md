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
bunx playwright install firefox
bunx playwright install-deps
# or
npm install
npx playwright install firefox
npx playwright install-deps
```
### Test the Project
```bash
bun run dev
# or
npm run dev
```

# ⚙️ Setup
PocketBase Configuration
Import the pb_schema.json to your PocketBase instance (merge)

Make sure your PocketBase server is running

Environment Variables
See .env.example for required variables:
```bash
POCKETBASE_URL=http://127.0.0.1:8090
OAUTH2_PROVIDER=mailcow
AUTOSAVE_INTERVAL=60
```

# ☁️ Deploy to production
[Install docker](https://docs.docker.com/engine/install/)

```bash
git clone https://github.com/Thodoriskoutou/svelte-email-builder
cd svelte-email-builder
docker compose pull
docker compose build email-builder
```

Use your editor of choice to edit `docker-compose-yml` to your liking. Notably you should edit the pocketbase url with an FQDN

```bash
docker compose up -d
```

Set up a reverse proxy for both pocketbase and the email-builder and don't forget to import the pocketbase schema (merge).

# 📚 Project Overview
This email builder was created as part of a Full Stack Internship Assignment. Key features:

- Drag-and-drop email template creation
- Newsletter management
- Responsive design
- Type-safe development with TypeScript

# ⚠️ Known Issues

- Although the ground work for multi-user workflow is there, there's no ACL whatsoever. All users can see and edit all templates.
- Due to the above multiple users editing the same template can result in data loss.
- You need a reverse proxy and 2 FQDNs (1 for pocketbase and 1 for email builder) in order to use the docker deployment, else images will be uploaded, but won't show in the frontend
- oAuth2 needs:
  1. to use email builder's `/auth/callback/[provider]` as your redirect url, instead if pocketbase's
  2. a realtime (websocket) connection, which needs to be supported by your reverse proxy/ies. e.g. Cloudflare uses quik (HTTP 3), which needs to be enabled locally. For chromium based browsers: `chrome://flags/#enable-quic`
  3. to open a popup, which might be blocked. check your address bar. For Safari see here: https://github.com/pocketbase/pocketbase/discussions/2429#discussioncomment-5943061

# 🛠️ Tech Stack
- Frontend: Svelte 5
- Backend: PocketBase
- Editor: React Email Editor
- Package Manager: Bun (Node.js compatible)

# 🔄 Contributing
Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

# 📧 Resources
- [Unlayer React Email Editor Docs](https://docs.unlayer.com/builder/react-component)
- [Svelte Documentation](https://svelte.dev/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)

Happy coding! 👨‍💻👩‍💻