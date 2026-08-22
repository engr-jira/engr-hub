# AGENTS.md

## Role
You are assisting with ENGR HUB, an internal security engineering operations web app.

## Core principles
- Analyze first, then propose a change plan.
- Prefer minimal, localized changes.
- Preserve existing behavior unless explicitly asked to change it.
- Separate confirmed facts from assumptions.
- Never hardcode secrets, API keys, credentials, customer data, or personal data.
- UI hiding is not security. Access control must be enforced at Worker/API/server level.
- Do not push, deploy, delete data, rotate secrets, or change production configuration unless explicitly approved.

## Workflow
For every coding task:
1. Summarize the requested change.
2. Identify affected files.
3. Explain the minimal change plan.
4. Apply changes only within scope.
5. Run available checks.
6. Show diff summary.
7. Provide verification steps.

## Git rules
- Never commit directly to main.
- Use feature branches.
- Do not force push.
- Do not rewrite history unless explicitly approved.
- Keep commits small and descriptive.

## Security rules
- Do not log secrets, cookies, session values, customer data, or personal data.
- Do not expose environment variables to frontend code.
- Do not rely on client-side-only authorization.
- Validate authentication and authorization at Worker/API/server level.
- Review CORS, redirects, error messages, and debug logs for data exposure.

## Validation
For frontend/UI changes:
- Check desktop and mobile layout.
- Verify no horizontal overflow.
- Verify login/session behavior.
- Verify existing buttons and navigation still work.

For Worker/API changes:
- Verify authentication and authorization path.
- Verify error handling.
- Verify no secrets are exposed to frontend.
- Verify audit logging if applicable.

## Output format
After work, report:
- Changed files
- Summary of changes
- Tests/checks run
- Risks
- Manual verification steps
- Recommended next action
