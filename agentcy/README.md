# Agentcy fork of Twenty

Agentcy's CRM: Twenty with our own changes, deployed to our Lightsail server.

## Branches
- `agentcy` (default): what runs in production. Put our changes here.
- `main`: untouched mirror of upstream `twentyhq/twenty`.
- `agentcy/UPSTREAM_VERSION`: the upstream release `agentcy` is based on. It becomes the image's `APP_VERSION`.

## Remotes (local clone)
- `origin` = github.com/ethanolle/agentcy-crm (this fork)
- `upstream` = github.com/twentyhq/twenty

## Build
Every push to `agentcy` runs `.github/workflows/agentcy-image.yaml` and pushes
`ghcr.io/ethanolle/agentcy-crm:<upstream-version>-<short-sha>` (and the moving tag `agentcy`).
Deploying that tag to the server is in the Agentcy ops repo: `ops/sops/twenty.md`.

## Update to a new upstream release
```
git fetch upstream --tags
git checkout agentcy
git merge twenty/vX.Y.Z          # resolve conflicts, keep our changes
echo vX.Y.Z > agentcy/UPSTREAM_VERSION
git commit -am "Merge upstream twenty/vX.Y.Z" && git push
```
Snapshot the server before deploying a new upstream version: its DB migrations don't roll back.

## License
Twenty is AGPL-3.0 (see LICENSE). This fork is public, which also covers the AGPL duty to share source with users of a modified version.
