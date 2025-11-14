# GitHub Secrets (required)

This project reads sensitive configuration from environment variables at runtime. In CI /GitHub Actions you should store these values as repository secrets and the workflows will expose them as environment variables.

Recommended secrets to add (Repository > Settings > Secrets and variables > Actions):

- `SUPABASE_URL` – Your Supabase project URL (e.g. `https://xxxx.supabase.co`).
- `SUPABASE_ANON_KEY` – Supabase anon/public key (for client access if used).
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service_role key (server-only; required for certain DB operations).
- `GEMINI_API_KEY` – Google Gemini API key (for the Gemini provider).
- `DEEPSEEK_API_KEY` – DeepSeek API key (if using DeepSeek provider).
- `GITHUB_TOKEN` – Personal access token used to push reports (if not using the built-in `GITHUB_TOKEN`).
- `GITHUB_REPO` – The repo target for publishing reports (format: `owner/repo`).
- `GITHUB_BRANCH` – (optional) Branch to publish to, defaults to `main`.

How the project reads the secrets

The monorepo exposes a `getConfig()` helper (`packages/config`) which reads these values from `process.env`. GitHub Actions workflows should map repository secrets into the environment so the scheduler and publisher can access them at runtime.

Example: in a workflow step

```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  GITHUB_REPO: ${{ secrets.GITHUB_REPO }}
```

Security notes

- Keep the `SUPABASE_SERVICE_ROLE_KEY` and other service keys as repository secrets — never commit them to the repo.
- Prefer using the built-in `GITHUB_TOKEN` when possible. If you need a personal access token, scope it minimally (repo:public_repo or repo as needed).

If you want, I can add an example GitHub Actions workflow that runs the scheduler daily and uses these secrets.
