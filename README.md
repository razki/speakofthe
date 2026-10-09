# SPEAKOFTHE

Next.js 16 website for SPEAK OF THE LTD. Use Node.js 22 and Yarn 1.22.22.

```sh
corepack enable
corepack yarn install --frozen-lockfile
yarn dev --port 3003
```

If `.env.local` does not exist, copy `.env.example` to it. Set
`NEXT_PUBLIC_SITE_URL=http://localhost:3003` for local browsing and supply
`CONTACT_EMAIL` privately to enable contact reveal. Never commit real env files.

```sh
yarn lint
yarn test:deployment
yarn build
```

The app requires a server for its API and crawler routing. AWS packaging uses
Next standalone output, Lambda Web Adapter and the existing CloudFront site.
See the [AWS deployment runbook](obsidian/workflows/aws-deployment.md) for setup,
candidate testing, cutover and rollback. Deployment has not been performed yet.

The [Obsidian vault](obsidian/README.md) is the project documentation; read
[AGENTS.md](AGENTS.md) before changing the application.
