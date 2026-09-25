-- ==========================================================
-- Database Schema Initialization : TALENTPULSE ATS PLATFORM
-- Target DBMS : PostgreSQL 16
-- ==========================================================

CREATE TYPE candidate_stage AS ENUM ('APPLIED', 'TECH_SCREENING', 'CODE_TEST', 'FINAL_INTERVIEW', 'OFFER', 'HIRED', 'REJECTED');
CREATE TYPE job_role AS ENUM ('FULLSTACK_DEV', 'GROWTH_ENGINEER', 'QA_ENGINEER', 'PRODUCT_DESIGNER');

-- 1. Table des Offres d'Emploi
CREATE TABLE IF NOT EXISTS job_offers (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Équipe Tech & Produit',
    location VARCHAR(100) NOT NULL DEFAULT 'Cotonou, Bénin',
    contract_type VARCHAR(30) DEFAULT 'CDI Local',
    open_slots INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Principale des Candidats
CREATE TABLE IF NOT EXISTS candidates (
    id BIGSERIAL PRIMARY KEY,
    job_offer_id BIGINT REFERENCES job_offers(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    target_role job_role NOT NULL,
    stage candidate_stage DEFAULT 'APPLIED',
    years_experience INT NOT NULL CHECK (years_experience >= 0),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    resume_path VARCHAR(255),
    overall_score NUMERIC(5, 2) DEFAULT 0.00,
    skills JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table des Évaluations Techniques Collaboratives
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    evaluator_name VARCHAR(100) NOT NULL,
    backend_score NUMERIC(5, 2) NOT NULL CHECK (backend_score BETWEEN 0 AND 100),
    frontend_score NUMERIC(5, 2) NOT NULL CHECK (frontend_score BETWEEN 0 AND 100),
    clean_code_score NUMERIC(5, 2) NOT NULL CHECK (clean_code_score BETWEEN 0 AND 100),
    culture_fit_score NUMERIC(5, 2) NOT NULL CHECK (culture_fit_score BETWEEN 0 AND 100),
    weighted_score NUMERIC(5, 2) NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index d'optimisation
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_role ON candidates(target_role);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate ON evaluations(candidate_id);

-- Données initiales
INSERT INTO job_offers (id, title, department, location, contract_type, open_slots)
VALUES
(1, 'Développeur Full Stack (Laravel & React)', 'Équipe Tech & Produit', 'Cotonou, Bénin', 'CDI Local', 2),
(2, 'Growth Engineer', 'Équipe Tech & Produit', 'Cotonou, Bénin', 'CDI Local', 1),
(3, 'QA Engineer / Test Automation', 'Équipe Tech & Produit', 'Cotonou, Bénin', 'CDI Local', 1),
(4, 'Product Designer UI/UX', 'Équipe Tech & Produit', 'Cotonou, Bénin', 'CDI Local', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO candidates (id, job_offer_id, first_name, last_name, email, phone, target_role, stage, years_experience, github_url, overall_score, skills)
VALUES
(1, 1, 'Christophe', 'WAVOEKE', 'wchristophe960@gmail.com', '+229 97 00 00 00', 'FULLSTACK_DEV', 'CODE_TEST', 5, 'github.com/christophe-wavoeke', 96.00, '["Laravel 11", "React 18", "TypeScript", "PostgreSQL", "Redis", "Docker"]'::jsonb),
(2, 3, 'Kafui', 'Lawson', 'klawson@example.com', '+229 95 11 22 33', 'QA_ENGINEER', 'FINAL_INTERVIEW', 4, 'github.com/klawson-qa', 92.00, '["Playwright", "Cypress", "Postman", "CI/CD GitHub Actions"]'::jsonb),
(3, 2, 'Bernice', 'Dossou', 'bdossou@example.com', '+229 96 33 44 55', 'GROWTH_ENGINEER', 'TECH_SCREENING', 3, 'github.com/bdossou-growth', 88.00, '["n8n", "GA4 / GTM", "SQL Analytique", "Webhooks", "APIs"]'::jsonb),
(4, 4, 'Marc-Aurèle', 'Agbo', 'magbo@example.com', '+229 40 55 66 77', 'PRODUCT_DESIGNER', 'OFFER', 4, 'figma.com/@marcau-design', 95.00, '["Figma", "Design System", "User Flows", "Prototypage"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
