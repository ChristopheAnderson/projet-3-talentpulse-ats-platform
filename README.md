# 🎯 TalentPulse / HireHub Enterprise — ATS & Tech Recruitment Platform

[![PHP Version](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat&logo=php)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

Plateforme collaborative de gestion des recrutements (ATS) pour équipes Tech & Produit, avec pipeline en colonnes Kanban, grille d'évaluation technique normalisée (Back-end, Front-end, QA, Culture Fit), parsing de CV et workflows automatisés d'e-mails.

---

## 🏛️ Architecture Technique

```mermaid
graph TD
    Candidate[Candidat - Portail PWA] -->|Dépôt Candidature & CV PDF| LaravelAPI[API Laravel 11 Backend]
    Recruiter[Équipe Recrutement & Tech Leads] -->|Dashboard React Kanban| LaravelAPI

    subgraph Backend [Backend Laravel 11]
        JobEngine[Job & Pipeline Manager]
        ScoreEngine[Candidate Evaluation & Scoring Service]
        DocParser[CV Document Processor]
        Notifier[Automated Mailer & Webhook Trigger]
        
        JobEngine --> ScoreEngine
        ScoreEngine --> Notifier
    end

    LaravelAPI --> DB[(PostgreSQL 16)]
    LaravelAPI --> Storage[(Local / S3 Storage - CVs & Portfolios)]

    subgraph Frontend [Dashboard Recrutement React]
        KanbanBoard[Pipeline Kanban Drag-and-Drop]
        ScoreModal[Grille de Notation Technique Pondérée]
        PDFPreview[Visualiseur Intégré de CV]
    end

    Frontend <-->|REST API JSON| LaravelAPI
```

---

## 📂 Structure du Répertoire

```text
projet-3-talentpulse-ats-platform/
├── docker-compose.yml          # Orchestration complète (Postgres, Laravel, React)
├── README.md                   # Documentation technique
├── backend/                    # API Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/   # CandidateController, JobOfferController
│   │   ├── Models/             # Candidate, JobOffer, EvaluationScore
│   │   └── Services/           # CandidateScoringService
│   ├── routes/api.php          # Endpoints ATS
│   ├── composer.json
│   └── Dockerfile
└── frontend/                   # Interface ATS React
    ├── src/
    │   ├── components/         # Pipeline Kanban, Modale d'évaluation
    │   ├── types/              # Types candidats, offres, scores
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Démarrage Rapide

```bash
cd projet-3-talentpulse-ats-platform
docker-compose up -d --build
# Dashboard sur http://localhost:3002
# API Backend sur http://localhost:8002/api/v1
```
