# TogoSite GitHub Actions

## Deployment

### Settings

- `production-production`
  - Trigger: `main` branch
  - Frontend refers `properties.json` at `main`
  - `properties.json` refers SPARQList endpoints at `integbio.jp/togosite`
- `dev-production`
  - Trigger: `develop` branch
  - Frontend refers `properties.json` at `develop`
  - `properties.json` refers SPARQList endpoints at `integbio.jp/togosite`
- `dev-dev`
  - Trigger: `develop` branch
  - Frontend refers `properties.json` at `sparqlist-develop`
  - `properties.json` refers SPARQList endpoints at `integbio.jp/togosite_dev`

### Procedures

On development:

1. PR from a feature branch to the `develop` branch and merge
2. upload source code to the `dev-production` bucket
3. edit `properties.json` to refer `integbio.jp/togosite_dev` API endpoints
4. edit frontend source to refer config files on the `sparqlist-develop` branch
5. commit and push to the `sparqlist-develop` branch
6. upload source code to the `dev-dev` bucket

On prodcution:

1. PR from `develop` branch to `main` and merge
2. edit frontend source to refer config files on the `main` branch
3. upload source code to the production bucket

## Build Documentation

(TBA)
