# 🎓 EduNexus — School Management System

> A unified EdTech platform designed to simplify and modernize school management by bringing students, teachers, academic activities, and administrative operations into one centralized system.

---

## 🌐 Live Links

| Resource             | Link                                           |
| -------------------- | ---------------------------------------------- |
| 🚀 Live Website      | [Visit EduNexus](https://school-management-system-psi-ten.vercel.app/)       |
| 💻 GitHub Repository | [View Source Code](https://github.com/JubairAhammedJubu/school-management-system) |


---

## 📌 About The Project

**EduNexus** is a full-stack **School Management System** developed as an EdTech project.

The main goal of this project is to reduce dependency on manual and disconnected school management processes by providing a **unified digital platform** for managing academic and administrative activities.

EduNexus connects three primary user roles:

- 👨‍💼 **Admin**
- 👨‍🏫 **Teacher**
- 🎓 **Student**

Each role has access to specific features and functionalities based on their responsibilities.

---

# 🎯 Problem Statement

Many schools still rely on manual processes, spreadsheets, paper records, and disconnected systems to manage their daily operations.

This can create several problems:

- Difficulty managing student records
- Manual attendance tracking
- Complicated examination and result management
- Difficulty tracking school fees
- Disconnected notices and announcements
- Poor visibility into student performance
- Time-consuming administrative operations
- Limited access to centralized academic information

### 💡 Our Solution

**EduNexus** brings essential school operations together into **one unified platform**.

The system allows administrators, teachers, and students to manage and access the information they need through a role-based system.

---

# ✨ Core Features

## 1. 👨‍🎓 Student Management

Manage student information from a centralized platform.

- Student profiles
- Student records
- Class assignment
- Academic information
- Enrollment information

---

## 2. 👨‍🏫 Teacher Management

Manage teacher information and academic responsibilities.

- Teacher profiles
- Subject assignment
- Class assignment
- Teacher records
- Academic responsibilities

---

## 3. 🏫 Class & Subject Management

Administrators can organize the academic structure of the school.

- Create and manage classes
- Manage sections
- Manage subjects
- Assign teachers to subjects
- Organize students by class

---

## 4. 📋 Attendance Management

Teachers can record and manage student attendance.

Students can also view their attendance information and history.

Key functionality includes:

- Daily attendance
- Attendance history
- Attendance percentage
- Student attendance tracking
- Teacher attendance management

---

## 5. 📝 Examination & Result Management

Manage examinations and student academic results.

- Create examinations
- Add examination marks
- Manage grades
- Publish results
- View examination results
- Track academic performance

---

## 6. 💳 Fee Management

Manage student fee-related information.

- Fee records
- Payment status
- Due amounts
- Payment history
- Fee tracking

---

## 7. 📢 Notice & Announcement Management

Keep students and teachers informed about important school activities.

- Create notices
- Publish announcements
- View notices
- School-wide announcements
- Important academic updates

---

## 8. 📚 Assignment & Homework Management

Teachers can create and manage assignments and homework.

Students can:

- View assignments
- Check deadlines
- Submit academic tasks
- Track assignment status

---

## 9. 📊 Student Performance Analytics

The system can provide insights into student academic performance using information such as:

- Attendance
- Examination results
- Assignment completion
- Performance trends

This helps teachers and administrators better understand student progress.

---

## 10. 📅 Academic Calendar & Events

Manage and display important academic activities.

Examples include:

- Examination dates
- School events
- Academic activities
- Important deadlines
- Holidays

---

## 11. 🤖 AI-Powered At-Risk Student Prediction

EduNexus includes an AI-assisted feature designed to identify students who may require additional academic attention.

The system can consider factors such as:

- Attendance
- Examination performance
- Assignment completion
- Academic performance trends

The purpose is to provide **early supportive insights** to teachers and administrators.

> ⚠️ The AI system is intended to support educational decision-making and does not replace teachers or educational professionals.

---

## 12. 📄 Reports & Documents

Generate useful academic and administrative information based on available school data.

Examples include:

- Attendance reports
- Result reports
- Student performance reports
- Fee reports
- Academic reports

---

# 👥 User Roles

EduNexus is designed around three main roles.

### 👨‍💼 Admin

The Admin manages the overall school system.

Main responsibilities:

- Manage students
- Manage teachers
- Manage classes
- Manage subjects
- Manage fees
- Publish notices
- Manage academic information
- View reports and analytics

---

### 👨‍🏫 Teacher

Teachers manage academic activities and student performance.

Main responsibilities:

- Take attendance
- Manage examinations
- Enter results
- Create assignments
- Manage homework
- Monitor student performance
- Access relevant notices and academic information

---

### 🎓 Student

Students can access their academic information from one place.

Main functionality:

- View attendance
- View examination results
- View assignments
- Check homework
- View fee information
- Read notices
- Track academic performance
- View academic events

---

# 🛠️ Technology Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

## Backend

- **Node.js**
- **Express.js**
- **REST API**

## Database

- **PostgreSQL**
- **Prisma ORM**

## AI

- **AI/ML-based Student Performance Analysis**

## Development Tools

- **Git**
- **GitHub**
- **VS Code**
- **Postman**

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       EduNexus       │
                         │ School Management    │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │    Admin    │    │   Teacher   │    │   Student   │
          └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Next.js        │
                         │    React Frontend    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      REST API        │
                         │   Node.js + Express  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Prisma         │
                         │         ORM          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      PostgreSQL      │
                         │       Database       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   AI Performance     │
                         │      Analysis        │
                         └──────────────────────┘
```

---

# 🔐 Role-Based Access Control

EduNexus follows a role-based access control approach.

```text
                    EduNexus
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
        Admin        Teacher        Student
          │             │             │
          ▼             ▼             ▼
       Full School    Academic      Academic
       Management     Management    Access
```

Each role can access only the functionality relevant to that role.

---

# 🎨 Project Highlights

### 🔐 Role-Based Access

Different users receive different permissions according to their roles.

### 📱 Responsive Design

The platform is designed to provide a smooth experience across different screen sizes.

### ⚡ Modern Full-Stack Architecture

The project uses a modern frontend, backend, API, database, and ORM architecture.

### 🤖 AI Integration

AI-assisted academic analysis provides additional insights into student performance.

### 📊 Centralized Management

School information and academic activities are managed through one centralized platform.

### 🔄 Real-World Workflow

The system is designed around real-world school operations rather than isolated CRUD functionality.

---

<!-- # 📂 Project Structure

```text
EduNexus/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── README.md
│
└── package.json
```

> The exact project structure may change during development. -->

---

# 🚀 Getting Started

## Prerequisites

Before running the project locally, make sure you have installed:

- Node.js
- npm
- PostgreSQL
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/JubairAhammedJubu/school-management-system.git
```

---

## 2. Navigate to the Project

```bash
cd EduNexus
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file in the appropriate project directory.

Example:

```env
DATABASE_URL="your_postgresql_database_url"

NEXT_PUBLIC_SERVER_URL="your_api_url"

# Add other required environment variables here
```

> Never commit your `.env` file or secret credentials to GitHub.

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Run Database Migrations

```bash
npx prisma migrate dev
```

---

## 7. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 🧪 Testing

The project will include testing for important application functionality.

Testing areas may include:

- Authentication
- Authorization
- Role-based access
- API endpoints
- Database operations
- Student management
- Attendance management
- Result management
- Fee management
- Assignment management
- AI-related functionality

---

# 🔮 Future Improvements

The project may be extended with additional features in the future.

Potential improvements include:

- 📱 Mobile application
- 💬 Parent-teacher communication
- 🗓️ Intelligent timetable scheduling
- 💳 Online fee payment
- 📈 Advanced analytics
- 🤖 Personalized homework recommendations
- 🔔 Automated notifications
- 📧 Email/SMS notifications
- 🧠 More advanced AI-powered insights
- 📄 Advanced report generation

---

# 👨‍💻 Development Team

This project is being developed by a team of **6 members**.

| #   | Name                    | Role           | GitHub Profile                                   |
| --- | ----------------------- | -------------- | ------------------------------------------------ |
| 1   | **Jubair Ahammed Jubu** | 🏆 Team Leader | [Profile](https://github.com/JubairAhammedJubu)  |
| 2   | **Tanzim Ahmed**        | 💻 Team Member | [Profile](https://github.com/Tah56)              |
| 3   | **Tarif Hasan Samin**   | 💻 Team Member | [Profile](https://github.com/Samincode01)        |
| 4   | **Md Rahim Miah**       | 💻 Team Member | [Profile](https://github.com/Rahim-Ahmed-10)                     |
| 5   | **Tasfia Islam Raisha** | 💻 Team Member | [Profile](https://github.com/tash-9)                    |
| 6   | **Amit Chandra Das**    | 💻 Team Member | [Profile](https://github.com/amitchandradas2004) |

---

# 🤝 Team Collaboration

The project is being developed collaboratively by all six team members.

Our development workflow focuses on:

- Git & GitHub
- Feature-based development
- Branch management
- Pull requests
- Code reviews
- API integration
- Database design
- Responsive UI development
- Testing
- Documentation
- Team communication

---

# 📸 Project Preview

Screenshots and demonstrations will be added as the project progresses.

## 🏠 Homepage

Coming soon...

## 👨‍💼 Admin Portal

Coming soon...

## 👨‍🏫 Teacher Portal

Coming soon...

## 🎓 Student Portal

Coming soon...

---

# 📌 Project Status

🚧 **Currently in Development**

EduNexus is actively being developed by our team.

We are continuously working on new features, improvements, integrations, and optimizations.

### 🚀 More updates coming soon!

---

# 📄 Project Documentation

| Document                               | Link                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 📄 Project Proposal                    | [View Proposal](https://docs.google.com/document/d/13FT6DJzoseEc-Pd6wnyzvUCe5kQggapIKbgSh0DHdYc/edit?tab=t.0#heading=h.88wxofd6cz0b) |
| 📋 Software Requirements Specification | [View SRS](https://docs.google.com/document/d/1y9T6nhDedXsRsU9_vOxTAKLPG4g3fpsdb3dIsyrz5Ns/edit?tab=t.0)                                                                                                            |
| 💻 Source Code                         | [GitHub Repository](https://github.com/JubairAhammedJubu/school-management-system)                                                   |
| 🌐 Live Project                        | [Visit Website](https://school-management-system-psi-ten.vercel.app)                                                                 |

---

# ⭐ Project Goals

The main goals of EduNexus are to:

- Reduce manual school operations
- Centralize academic information
- Improve communication between school users
- Simplify attendance and result management
- Improve fee tracking
- Provide better academic visibility
- Support teachers with useful student insights
- Introduce AI-assisted academic analysis
- Create a scalable real-world EdTech platform

---

# 📜 License

This project is developed for **educational and project purposes**.

---

# ❤️ Acknowledgement

This project is being developed as a collaborative learning experience where we are applying full-stack development concepts to solve a real-world problem in the **EdTech** sector.

---

<div align="center">

## 🎓 EduNexus

### One School. One Platform. Smarter Management.

**Built with ❤️ by our team of six developers.**

🚧 **Currently under development — more updates coming soon! 🚀**

</div>
