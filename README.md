# NeoOS Documentation

Docusaurus-based documentation site for the NeoOS organization.

**Live at:** https://neoosorganization.github.io/neoos-docs/ (the org
login is `NeoOSOrganization`, not `NeoOS` — that name was unavailable,
so this is a project page under the org's default Pages domain, not
`neoos.github.io`). Deploys automatically on every push to `main` via
`.github/workflows/deploy.yml`.

## Build and Deploy

```bash
npm install
npm run build
npm run serve
```

View at http://localhost:3000

## Development

```bash
npm start
# Opens http://localhost:3000 with hot reload
```

## Edit Docs

Documentation lives in `docs/`. Edit `.md` files directly; changes auto-reload in dev mode.

See [Docusaurus docs](https://docusaurus.io/) for full guidance.