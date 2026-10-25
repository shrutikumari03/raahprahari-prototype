# RaahPrahari — Know before you go · सफ़र से पहले सुरक्षा की ख़बर

A prototype road-hazard advisory and reporting app for Uttarakhand. Travellers pick a FROM and TO place and see seeded route options. Each road section shows its advisory level, how fresh the evidence is, and any official restriction. All data is synthetic.

**Stack:** TanStack Start (React 19, TanStack Router), Vite, Tailwind CSS 4, shadcn/ui, lucide-react, Zod, Vitest. Deployed on Netlify.

## Run locally
```bash
pnpm install
npm run dev      # http://localhost:3000
npm test         # includes advisory-rule tests
```

## Roadmap
See [PLAN.md](PLAN.md). Next up: mount the report flow at `/report`, add `/about`, then build the traveller dashboard, the reviewer and official workspaces, demo roles and the PWA.
