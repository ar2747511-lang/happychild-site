# Happy Child Universe — Static Website

## Quick start (local)
Open `index.html` in Chrome.

## GitHub Pages
1. Upload `index.html`, `styles.css`, `script.js`, and the `assets/` folder to your repo root.
2. Repo Settings → Pages → Deploy from a branch → `main` + `/root` → Save.
3. Wait 1–2 minutes, then open your URL.

## Replace images
Put your own images in `assets/` and keep the same names:
- logo.jpg
- hero.jpg
- model-green.jpg
- model-blue.jpg
- model-shelf.jpg
- model-map.jpg
- room-1.jpg
- room-2.jpg


## Orders Dashboard (Protected)
This site includes:
- `order.html` : customer order form (writes to Firestore)
- `admin.html` : protected admin dashboard (Firebase Auth required)

### Setup (Firebase)
1) Create a Firebase project
2) Build > Firestore Database: create database (production or test)
3) Build > Authentication: enable **Email/Password**
4) Add a **Web App** and copy the Firebase config into: `js/firebase-config.js`

### Firestore Rules (recommended)
In Firestore > Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true;               // customers can submit orders
      allow read, update, delete: if request.auth != null; // only admin
    }
  }
}
```

### Create Admin User
Authentication > Users > Add user:
- email + password (use them to login in `admin.html`)

### Usage
- Buttons "Commander" now open `order.html?product=...`
- Admin opens `admin.html` and logs in to see orders
