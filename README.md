# Saunf 🌿 

**Saunf** is a lightweight, open-source project management tool and Jira clone. Built with the MERN stack, it provides a streamlined experience for tracking issues, managing tasks, and collaborating with teams in a clean, modern interface.

## 🚀 Key Features

* **Kanban Boards:** Drag-and-drop interface to manage task workflows (To-Do, In Progress, Done).
* **Issue Tracking:** Create, edit, and delete issues with detailed descriptions and priorities.
* **User Management:** Assign tasks to team members and track individual progress.
* **Search & Filter:** Quickly find tasks using powerful search and category filters.
* **Responsive Design:** Fully optimized for both desktop and mobile views.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, React Beautiful DnD
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **State Management:** Context API / Redux
* **Authentication:** JWT (JSON Web Tokens)

## 🏁 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* MongoDB (Local instance or MongoDB Atlas)
* Redis (local or valkey)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Snedit/Saunf.git](https://github.com/Snedit/Saunf.git)
    cd Saunf
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    Create a `.env` file in the `server` folder:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend 
    npm install
    npm run dev
    ```

## 🤝 Contributing
Contributions make the open-source community an amazing place to learn and create. 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
