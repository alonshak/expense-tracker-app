# Expense Tracker — DevOps Final Project

Production-grade DevOps project demonstrating a full CI/CD and GitOps workflow on AWS.

---

## 📌 Project Overview

**Expense Tracker** is a simple web application for non-technical users to track personal expenses.

The project focuses on **DevOps architecture and delivery**, not on business features.

### Application Stack
- **Frontend:** React (Vite) → Static build → Nginx
- **Backend:** Python Flask (REST API)
- **Database:** PostgreSQL
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Container Registry:** Amazon ECR
- **Target Platform:** Kubernetes (Amazon EKS)

---

## 📂 Repository Structure

# Expense Tracker — DevOps Final Project

Production-grade DevOps project demonstrating a full CI/CD and GitOps workflow on AWS.

---

## 📌 Project Overview

**Expense Tracker** is a simple web application for non-technical users to track personal expenses.

The project focuses on **DevOps architecture and delivery**, not on business features.

### Application Stack
- **Frontend:** React (Vite) → Static build → Nginx
- **Backend:** Python Flask (REST API)
- **Database:** PostgreSQL
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Container Registry:** Amazon ECR
- **Target Platform:** Kubernetes (Amazon EKS)

---

## 📂 Repository Structure

spendly-app/
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── config.py
│ │ ├── db.py
│ │ ├── models.py
│ │ └── routes.py
│ ├── requirements.txt
│ ├── wsgi.py
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ExpenseForm.jsx
│ │ │ ├── ExpenseTable.jsx
│ │ │ ├── Filters.jsx
│ │ │ └── Summary.jsx
│ │ ├── App.jsx
│ │ ├── api.js
│ │ └── main.jsx
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
├── docker/
│ ├── backend/
│ │ └── Dockerfile
│ └── frontend/
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md


---

## 🚀 Local Development

The entire application can be run locally using Docker Compose.

### Prerequisites
- Docker
- Docker Compose

### Run locally
```bash
docker compose up --build

## 🟦 Milestone 9 — Continuous Integration (CI)

**Status:** ✅ Completed

### Goal
Implement a complete CI pipeline that automatically builds and packages the application.

### Scope
This milestone focuses **only** on Continuous Integration:
- Building Docker images
- Pushing artifacts to a container registry
- No deployment to Kubernetes

### What was done
- Created Dockerfiles for:
  - Backend (Flask + Gunicorn)
  - Frontend (React build served via Nginx)
- Implemented GitHub Actions workflows
- Automated Docker image build on push to `main`
- Successfully pushed backend image to Amazon ECR
- Verified image availability and integrity in ECR

### Key Principles
- CI is responsible **only** for build and push
- CI does **not** interact with Kubernetes
- Deployment is handled later via GitOps

### Outcome
- Application is fully containerized
- CI pipeline is stable and reproducible
- Docker images are ready for GitOps-based deployment
