# Bunny Purge Pull Zone Cache — GitHub Action

A GitHub Action that purges the CDN cache of one or more [Bunny.net](https://bunny.net) pull zones in a single step.

---

## Usage

```yaml
- uses: Naora/bunny-purge-pull-zone-action@2026-05-26
  with:
    api_key: ${{ secrets.BUNNY_API_KEY }}
    pull_zone_ids: "123456,789012"
```

### Inputs

| Input           | Required | Description                                                                          |
| --------------- | -------- | ------------------------------------------------------------------------------------ |
| `api_key`       | ✅        | Bunny.net **account** API key. Find it under *Account Settings → API*.               |
| `pull_zone_ids` | ✅        | Comma-separated list of pull zone IDs to purge (e.g. `"123456"` or `"123,456,789"`). |

---

## Full workflow example

```yaml
name: Deploy & Purge CDN Cache

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # … your deploy steps here …

      - name: Purge Bunny pull zone cache
        uses: Naora/bunny-purge-pull-zone-action@2026-05-26
        with:
          api_key: ${{ secrets.BUNNY_API_KEY }}
          pull_zone_ids: ${{ vars.BUNNY_PULL_ZONE_IDS }}
```

> **Tip:** Store your pull zone IDs as a repository *variable* (`vars.BUNNY_PULL_ZONE_IDS`) and your API key as a *secret* (`secrets.BUNNY_API_KEY`).
