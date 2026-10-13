# BS Playground

A simple chatbot built with a signals-based, zoneless Angular frontend and a Node / Express backend that talks to the OpenAI API.

- Frontend: https://bdps34.github.io/BS-Playground/ (GitHub Pages)
- Backend: https://bs-playground-api.onrender.com (Render)

## Prerequisites

Node 24 LTS.

## Setup

    git clone https://github.com/bdps34/BS-Playground.git
    cd BS-Playground
    npm ci

Copy `.env.example` to `.env` and fill in `JWT_SECRET` and `OPENAI_API_KEY`.

## Running locally

Backend (http://localhost:9000):

    npm run server

Frontend (http://localhost:4200, proxies `/api` to the backend):

    npm start

Sign in with the seeded user `test@test.io` / `test`, or create an account. Users and conversations are kept in memory and reset when the server restarts.

## Checks

    npm run lint
    npm test -- --watch=false

## Deployment

- **Frontend:** `.github/workflows/deploy-pages.yml` runs lint and build in parallel, then the unit tests, and deploys to GitHub Pages only if everything passes.
- **Backend:** Render runs `npm ci` and `npm run start:server`, with `NODE_ENV`, `JWT_SECRET`, `OPENAI_API_KEY` and `CORS_ORIGIN` set in its dashboard.
