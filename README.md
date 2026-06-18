# Grant Maestro UI

The frontend React application for Grant Maestro.

## Prerequisites

- Node.js 22.x
- Yarn package manager

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BigLittleBusiness/grantmaestroui.git
   cd grantmaestroui
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `REACT_APP_API_URL` points to your running local API instance.*

4. **Start the development server**
   ```bash
   yarn start
   ```
   The application will be available at `http://localhost:3000`.

## Tech Stack

- **Framework:** React 19
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v6
- **Styling:** Bootstrap 5 + custom CSS
- **HTTP Client:** Axios

## Deployment (AWS EC2 / Nginx)

This repository includes a GitHub Actions workflow (`.github/workflows/aws.yml`) that automatically builds the React app and deploys the static files to an EC2 instance.

**Required GitHub Secrets:**
- `EC2_HOST`: The Elastic IP of the EC2 instance
- `EC2_USERNAME`: Usually `ubuntu`
- `EC2_SSH_KEY`: The private SSH key for the instance
- `EC2_TARGET_DIR`: The directory Nginx serves from (e.g., `/var/www/grantmaestroui/build`)

**Server Requirements:**
- Nginx configured to serve static files and fallback to `index.html` for React Router
- Directory permissions allowing the deployment user to write to the target directory
