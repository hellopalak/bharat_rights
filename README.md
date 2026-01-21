# BharatRights 🇮🇳

BharatRights is a comprehensive platform designed to empower Indian citizens by providing easy access to government schemes, legal rights information, and essential document management tools. The platform aims to bridge the gap between citizens and their entitlements through a user-friendly, accessible interface.

## 🌟 Key Features

*   **Scheme Explorer**: Browse and filter government schemes based on various criteria to find those applicable to you.
*   **Document Locker**: Securely store and manage your essential documents in one place.
*   **Application Tracker**: Keep track of your applications for different schemes and services.
*   **AI Chat Assistant**: Get instant answers to your queries regarding rights and schemes (powered by AI).
*   **Community Forum**: Connect with others, share experiences, and get community support.
*   **Multi-language Support**: Accessible in multiple Indian languages (Foundation laid).
*   **Profile Management**: Personalized experience based on user profile and eligibility.

## 🛠️ Technology Stack

*   **Frontend**: [React](https://react.dev/) (v19)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Backend / Database**: [Supabase](https://supabase.com/)
*   **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
*   npm (comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd bharat-rights
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Fill in your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:5173`.

## 🌐 Deployment

This project is currently deployed and live on **Render**.

### **[🔗 Click Here to View Live Demo](https://bharat-rights.onrender.com)**

The deployment is automated using Render's continuous deployment pipeline.

### How it Works

1.  **Source**: The deployment is connected to the GitHub repository.
2.  **Build**: Automatic builds are triggered on every push to the `main` branch.
    *   Command: `npm run build`
3.  **Publish**: The `dist` directory is served as a static site.

### Redeploying / Forking

If you wish to deploy your own version:
1.  Fork the repository.
2.  Create a new **Static Site** on Render.
3.  Connect your forked repository.
4.  Use the build settings:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
5.  **Environment Variables**:
    Add the following environment variables in the Render dashboard (under the **Environment** tab):

    | Variable Name | Description | Example Value |
    | :--- | :--- | :--- |
    | `VITE_SUPABASE_URL` | The URL of your Supabase project. Found in Supabase Dashboard > Settings > API. | `https://xyz.supabase.co` |
    | `VITE_SUPABASE_ANON_KEY` | The anonymous public key for your Supabase project. Found in Supabase Dashboard > Settings > API. | `eyJhbGciOiJIUzI...` |

    > **Note**: These variables function as build-time variables in Vite. Ensure they are set before triggering the build on Render.

## 📄 License

This project is licensed under the MIT License.
