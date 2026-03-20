# 🌻 Girasoles Sanos — Full Deployment & Google Bridge Guide
## Health Bridges International

---

## Part 1: Deploy the Dashboard to Production

### Step 1 — Prerequisites (install once)

| Tool | Download | Verify |
|------|----------|--------|
| Node.js 18+ | nodejs.org | `node --version` |
| Git | git-scm.com | `git --version` |
| VS Code | code.visualstudio.com | optional |

### Step 2 — Create the Next.js project

```bash
npx create-next-app@latest girasoles-sanos \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd girasoles-sanos

npm install @supabase/supabase-js recharts lucide-react date-fns \
            googleapis @types/node
```

### Step 3 — Add your dashboard file

Copy `girasoles_sanos_dashboard.jsx` into `src/app/page.tsx`  
(rename the export from `App` to `default` if needed, or wrap it):

```tsx
// src/app/page.tsx
import GirasolesDashboard from "@/components/GirasolesDashboard";
export default function Page() { return <GirasolesDashboard />; }
```

### Step 4 — Set up Supabase

1. Go to **supabase.com** → New Project → Name: `girasoles-sanos`
2. Region: **South America (São Paulo)**  
3. Save your database password  
4. In SQL Editor → run `supabase_schema.sql` (from your original zip)  
5. Also run `google_bridge_schema.sql` (from this package)  
6. Go to **Settings → API** → copy:
   - Project URL  
   - `anon` key  
   - `service_role` key (for the bridge API only — keep private!)

### Step 5 — Configure environment variables

Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server-side only — never expose to client

# Anthropic (for AI care plans)
ANTHROPIC_API_KEY=sk-ant-...

# Google Bridge
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
GOOGLE_BRIDGE_SECRET=choose-a-random-32-char-secret-string
```

> ⚠️ **Never commit `.env.local` to Git.** It's already in `.gitignore`.

### Step 6 — Add the Google Bridge API route

Copy `google_bridge_api.ts` to:  
`src/app/api/google-bridge/route.ts`

### Step 7 — Test locally

```bash
npm run dev
# Open http://localhost:3000
```

### Step 8 — Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial Girasoles Sanos deployment"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR-ORG/girasoles-sanos.git
git push -u origin main
```

On **vercel.com**:
1. Import your GitHub repository  
2. Before deploying, add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_SERVICE_ACCOUNT_JSON`
   - `GOOGLE_BRIDGE_SECRET`
3. Click **Deploy**  

Your live URL: `https://girasoles-sanos.vercel.app` 🎉

### Step 9 — Connect your domain (optional)

In Vercel → Settings → Domains → add `girasoles.healthbridges.org`  
Follow DNS instructions. HTTPS is automatic.

---

## Part 2: Google Forms & Sheets Bridge Setup

The bridge lets Google Forms automatically send data into your Supabase database in real time.

### Architecture Overview

```
Google Form submission
        ↓
  Google Apps Script (webhook sender)
        ↓  HTTPS POST with secret
  /api/google-bridge  (Next.js route on Vercel)
        ↓
  Supabase Database
        ↓
  Girasoles Sanos Dashboard (real-time update)
```

### Step A — Create a Google Service Account

1. Go to **console.cloud.google.com**
2. Create a new project: `girasoles-sanos-bridge`
3. Enable **Google Sheets API** and **Google Forms API**
4. IAM & Admin → Service Accounts → Create Service Account
5. Name: `girasoles-bridge`
6. Grant role: **Viewer** (read-only is sufficient)
7. Create Key → JSON → download the `.json` file
8. Copy the entire JSON content as the value of `GOOGLE_SERVICE_ACCOUNT_JSON` in your `.env.local` and Vercel environment variables

### Step B — Set up Forms (one per data type)

#### Form 1: Daily Mood Check-in
Create a Google Form with these exact question titles:
- `Código del Residente` (Short answer)
- `Estado Anímico (1-5)` (Multiple choice: 1, 2, 3, 4, 5)
- `Observaciones del Cuidador` (Paragraph)
- `Nombre del Cuidador` (Short answer)

#### Form 2: Teacher Quarterly Report
- `Código del Residente` (Short answer)
- `Nombre de la Institución Educativa` (Short answer)
- `Grado y Sección` (Short answer)
- `Porcentaje de Asistencia (%)` (Short answer)
- `Calificación General` (Short answer: A, B, C)
- `Nivel de Lectura (palabras/min)` (Short answer)
- `Conectividad Social (1-5)` (Multiple choice: 1, 2, 3, 4, 5)
- `Observaciones del Docente` (Paragraph)
- `Nombre del Docente` (Short answer)
- `Período Evaluado` (Short answer: e.g., "2026-Q1")

#### Form 3: Health Visit Record
- `Código del Residente`
- `Fecha de Visita`
- `Motivo de Consulta`
- `Diagnóstico (texto)`
- `Código CIE-10`
- `Establecimiento de Salud`
- `Médico Tratante`
- `Prescripción / Tratamiento`
- `Peso (kg)` and `Talla (cm)`

#### Form 4: Incident Report
- `Código del Residente`
- `Fecha del Incidente`
- `Descripción del Incidente`
- `Plan de Acción`
- `Seguimiento`
- `Notificado a UPE/DEMUNA` (Yes/No)
- `Nombre del Reportante`

### Step C — Add Apps Script to each Form

For each Google Form:

1. Open the form → **Extensions → Apps Script**
2. Delete any existing code
3. Paste the contents of `google_apps_script_webhook.js`
4. Update the three config values at the top:
   ```js
   const WEBHOOK_URL = "https://your-domain.vercel.app/api/google-bridge";
   const WEBHOOK_SECRET = "your-bridge-secret";   // Must match your env var
   const FORM_TYPE = "mood_checkin";  // Change per form
   ```
5. **Save** (Ctrl+S)
6. Run `setupTrigger()` once — grant permissions when prompted
7. Run `testWebhook()` to verify the connection works

### Step D — Share Sheets with Service Account

If you're also using Google Sheets as a data source (e.g., existing data):

1. Open the Google Sheet
2. Click **Share**
3. Add the service account email (from your JSON: `"client_email"` field)
4. Set permission to **Viewer**

### Step E — Bulk sync from existing Sheets

If you have existing data in a Google Sheet to import:

```
GET https://your-domain.vercel.app/api/google-bridge
  ?sync=SPREADSHEET_ID
  &type=teacher_report
  &range=Sheet1!A:Z
  &secret=your-bridge-secret
```

Or via curl:
```bash
curl -H "x-bridge-secret: your-secret" \
  "https://your-domain.vercel.app/api/google-bridge?sync=SHEET_ID&type=teacher_report"
```

---

## Part 3: Security Checklist

- [ ] `.env.local` is in `.gitignore` (default in Next.js)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only used in server-side routes — never the client
- [ ] `GOOGLE_BRIDGE_SECRET` is a random 32+ character string
- [ ] Row Level Security (RLS) is enabled on all Supabase tables
- [ ] Google Service Account has **Viewer** access only
- [ ] 2FA is enabled on GitHub, Supabase, Vercel, and Google Cloud accounts
- [ ] Database backups are enabled in Supabase (Settings → Database → Backups)
- [ ] API keys rotated every 90 days

---

## Part 4: Day-to-Day Workflows

### Adding a new resident
`Residentes → Nuevo Ingreso` → fill MIMP-required fields

### Daily mood check-in
Share the Mood Check-in Google Form with all caregivers. Each morning, they fill it out → data flows automatically to the dashboard.

### Teacher quarterly report
Share the Teacher Report Form with school teachers. Each quarter, teachers submit one form per resident → educational records update automatically.

### Generating a MIMP report
`Informes MIMP → Select resident → Exportar Plan de Trabajo Individual (PDF)`

### AI care plans
`IA — Planes de Atención → Select resident → Generar con IA`  
Cost: ~$0.003–0.01 per plan. For 10 residents × 2 plans/week ≈ $1–2/month.

### Updating the dashboard
```bash
# Make changes locally, then:
git add . && git commit -m "Description" && git push
# Vercel auto-deploys in ~60 seconds
```

---

*Built with care by Health Bridges International for the children of Girasoles Sanos.*  
*"La excelencia no es hacer. Es ser."*
export default function Page()