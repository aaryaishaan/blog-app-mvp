


````markdown
# 📝 ColdHours — Modern Blogging Platform

ColdHours is a modern, full-stack blogging web application built with **React**, **Firebase**, and **Tailwind CSS**.  
It allows users to **create, edit, and publish blogs** in a clean, distraction-free editor with real-time authentication and Firestore integration.

---

## 🚀 Features

### 🧠 Core
- **Create, Save & Publish** blogs in a clean, interactive editor.
- **User Authentication** with Firebase (Sign up / Login / Logout).
- **Dynamic Blog Management** — users can view, edit, and manage their own posts.
- **Auto-Draft Saving** (coming soon).
- **Dark Mode** support via Tailwind.
- **Interactive UI** built using components from [Aceternity UI](https://ui.aceternity.com) and `framer-motion`.

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React (Vite) |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Firebase (Authentication + Firestore) |
| Hosting (optional) | Firebase Hosting / Vercel |
| Icons | Tabler Icons |

---

## 🛠️ Getting Started (Local Setup)

Follow these steps to set up **ColdHours** locally on your machine 👇

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/coldhours.git
cd coldhours
````

### 2️⃣ Install dependencies

Make sure you have **Node.js (>=18)** installed.

```bash
npm install
```

or (if using Yarn):

```bash
yarn install
```

### 3️⃣ Set up Firebase

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a new project.
* Enable **Firestore Database** and **Email/Password Authentication**.
* Copy your Firebase config credentials.

Then, create a `.env` file in your project root and add:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

*(You can find these in your Firebase project settings → "General" → "Your apps")*

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.
You should see the **ColdHours homepage** and be able to sign up or create blogs!

---

## 📂 Project Structure

```
coldhours/
├── src/
│   ├── components/        # UI components (cards, navbar, effects)
│   ├── pages/             # App pages (Login, Signup, Blogs, CreateBlog, Contact)
│   ├── firebase.js        # Firebase config and initialization
│   ├── App.jsx            # Main app router
│   ├── index.css          # Tailwind styles
│   └── main.jsx           # Entry point
├── public/                # Static assets (icons, logo)
├── .env                   # Firebase credentials (not committed)
├── package.json
└── tailwind.config.js
```

---

## 🌈 Key Pages

| Page       | Description                 |
| ---------- | --------------------------- |
| `/`        | Homepage / Blog Feed        |
| `/login`   | User Login                  |
| `/signup`  | Create an Account           |
| `/create`  | Create New Blog (protected) |
| `/blogs`   | View All Blogs              |
| `/contact` | Contact / Info Page         |

---

## 💡 Future Enhancements

* 🔄 Auto-save draft feature (localStorage + Firestore)
* 🖼️ User profile pages
* 📱 Mobile responsive editor
* 💬 Blog comments and likes
* 🧾 Markdown support for writing blogs

---

## 🤝 Contributing

Pull requests are welcome!
If you’d like to add new features or fix bugs, please:

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Submit a PR 🎉

---

## 📜 License

This project is open-source under the **MIT License**.
Feel free to modify and share with attribution.

---

