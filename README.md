# StaticAlerts API

`StaticAlerts` is the static image scan backend for KUBERSCAN. It runs Trivy
scans, stores scan jobs/results in MongoDB, and exposes endpoints to create,
run, and read scans.

## Current Status

Basic project check is OK:

- `deno check server.ts` passes.
- Deno prints a non-blocking warning that `target` in `deno.json` is ignored.

## Tech Stack

- Deno + Express
- MongoDB + Mongoose
- Trivy CLI

## Project Structure

- `server.ts`: API bootstrap, Mongo connection, route mounting.
- `routes/static.ts`: scan API routes.
- `DB/static.ts`: Mongoose schema/model for scan documents.
- `util.ts`: Trivy execution helper.
- `types.ts`: TypeScript interfaces.
- `Dockerfile`: container image with Trivy installed.

## Data Model

Mongo collection model: `KuberStaticScan`

Fields:

- `ScanID` (string, required)
- `image` (string, required)
- `Vulnerability` (array)
- `status` (string, default: `pending`)

## API Endpoints

Base URL example (local):

- `http://localhost:8000`

### `POST /static/save`

Creates a scan document without executing Trivy.

Request body:

```json
{
  "image": "nginx:latest"
}
```

Response:

- `200` with created scan object.

### `POST /static/scan`

Creates a scan job and launches Trivy asynchronously.

Request body:

```json
{
  "image": "nginx:latest"
}
```

Behavior:

- Creates scan with `status: "pending"`.
- Runs Trivy in background.
- Updates document:
  - `status: "done"` on success
  - `status: "Error: ..."` on failure
  - fills `Vulnerability` from Trivy output.

Response:

- `200` with `{ "scanId": "..." }`.

### `GET /static/:scanid`

Fetches scan data by `ScanID`.

Response:

- `200` scan document
- `404` not found

## Environment

Create `.env` from `.env.example` and set:

- `MONGO_URI=<your-mongodb-connection-string>`

## Run

### Development

```bash
deno task dev
```

### Start (with required permissions)

```bash
deno task start
```

## Docker

Build and run:

```bash
docker build -t deno-trivy-app .
docker run -it -p 8000:8000 --env-file .env deno-trivy-app
```

## Notes

- Trivy binary must be available in runtime (Dockerfile already installs it).
- Image input is sanitized in `util.ts` before command execution.
- `POST /static/scan` is async: call `GET /static/:scanid` to poll status.
