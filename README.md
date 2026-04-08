# KUBERSCAN - KuberScan_Static

This repository contains:

- `KuberScan_Static`: Image scan backend (Express + Mongo + Trivy).

## Current Features (Updated)

### Static Scan Backend (KuberScan_Static)

- **Asynchronous Image Scanning**
  - Uses **Trivy** as the core security engine to analyze container images.
  - Background execution to handle long-running scan processes without blocking the API.

- **Scan Management API**
  - `POST /static/save`: Initializes and stores a new scan record in the database.
  - `POST /static/scan`: Triggers the actual Trivy execution for a specific image.
  - `GET /static/:scanid`: Retrieves scan status (`pending`, `completed`, `failed`) and full vulnerability results.

- **Data Persistence**
  - Full integration with **MongoDB** to store scan history and CVE reports.
  - Efficient storage of scan metadata for quick retrieval by the Frontend.

- **Trivy Integration**
  - Automated binary execution to detect OS packages vulnerabilities and application dependencies.
  - Standardized JSON output processing.

## End-to-End Static Flow

1. **Initialization**: Frontend sends image data to `POST /static/save`.
2. **Scanning**: System triggers `POST /static/scan` which launches a Trivy job.
3. **Storage**: Upon completion, results are parsed and saved to the `static_scans` collection in MongoDB.
4. **Delivery**: Frontend requests results via `GET /static/:scanid` to display vulnerability charts and details.

## Quick Start

### Prerequisites
- **Deno** runtime.
- **Trivy** installed (or running via Docker).
- **MongoDB** instance.

### Development

```bash
# Navigate to the project directory
cd KuberScan_Static

# Run the development server
deno task dev
