
# AI Career Counselor

Welcome to the AI Career Counselor! This application leverages a local Llama 3 model via Ollama to provide users with personalized career advice, job role suggestions, and detailed learning timetables. It features a modern, responsive UI with dark/light mode, and allows users to save their generated plans.

## ✨ Features

*   **Personalized Career Insights:** Generates job role suggestions based on user's background, skills, and interests.
*   **Dynamic Skills & Interests Selection:**
    *   Categorized selection of skills and interests.
    *   Search functionality within categories.
    *   Ability for users to add custom skills and interests, which are incorporated into the AI's context (dynamic RAG).
*   **Detailed Job Roadmaps & Timetables:**
    *   Provides high-level roadmaps for suggested job roles.
    *   Generates structured, multi-phase learning timetables based on a selected job and user-defined timeframe (e.g., "2 months", "1 year").
    *   The AI is strictly instructed to adhere to the specified duration for timetables.
*   **AI-Powered by Local LLM:**
    *   Utilizes a local Llama 3 model (e.g., `llama3:8b`) via Ollama.
    *   Employs Retrieval Augmented Generation (RAG) with both static knowledge bases and dynamic user-defined items to enhance response quality.
    *   Prompts are engineered to request and parse JSON output from the LLM.
*   **User Experience:**
    *   Responsive design for various screen sizes.
    *   Dark/Light mode theme, with persistence in localStorage.
    *   Inspirational quotes displayed during AI processing.
    *   Interactive progress stepper to guide users.
    *   Modal dialogs for user notifications and confirmations.
*   **Plan Persistence:** Users can save their generated career plans (including inputs, selected job, and timetable) to localStorage and view them later.
*   **Modern UI:** Built with React and Tailwind CSS for a polished look and feel.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript
*   **Styling:** Tailwind CSS (with JIT compilation via CDN script in `index.html`)
*   **Build Tool:** Vite
*   **Local Language Model:** Llama 3 (via Ollama)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
*   **Routing:** Simple state-machine based routing within `App.tsx`
*   **HTTP Client:** Native `fetch` API for Ollama communication

## 🚀 Getting Started

Follow these instructions to set up and run the AI Career Counselor locally.

**Prerequisites:**

1.  **Node.js:** Ensure you have Node.js installed (LTS version recommended). You can download it from [nodejs.org](https://nodejs.org/).
2.  **npm (or yarn):** npm is included with Node.js.
3.  **Ollama:**
    *   Install Ollama from [ollama.com](https://ollama.com/).
    *   Ensure the Ollama application is running.
4.  **Llama 3 Model:**
    *   Pull the Llama 3 model using Ollama. The application is configured to use `llama3:8b` by default.
        ```bash
        ollama pull llama3:8b
        ```
    *   You can verify the model is available by running `ollama list`.

**Installation & Setup:**

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer yarn)

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of your project (you can duplicate `.env.example` if provided, or create it from scratch). Add the following:

    ```env
    # .env
    LLAMA_API_ENDPOINT="http://localhost:11434/api/generate"
    LLAMA_API_KEY=""
    ```
    *   `LLAMA_API_ENDPOINT`: This is the endpoint for your local Ollama instance's generate API. The default `http://localhost:11434/api/generate` should work if Ollama is running on its default port.
    *   `LLAMA_API_KEY`: This is **not required** for local Ollama setups and can be left blank or omitted. It's included as a placeholder in case of future integrations with hosted models.

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## ⚙️ AI Integration: Ollama & RAG

The application's core AI capabilities are powered by a local Llama 3 model accessed through Ollama.

*   **Model:** By default, `llama3:8b` is used (configured in `services/aiService.ts`).
*   **Communication:** The `services/aiService.ts` handles all communication with the Ollama API endpoint specified by `LLAMA_API_ENDPOINT`.
*   **JSON Output:** Prompts sent to the LLM are carefully constructed to instruct it to return responses in JSON format. The service then parses this JSON.
*   **Streaming:** Responses from Ollama are streamed to update the UI progressively where applicable (though the final output is parsed as a whole JSON).

**Retrieval Augmented Generation (RAG):**

This project includes a **simulated and dynamic** implementation of RAG to improve the relevance and quality of AI responses:

1.  **Static Knowledge Bases:**
    *   `CAREER_ADVICE_KB`: Contains expert tips for various career fields.
    *   `TIMETABLE_RESOURCES_KB`: Provides study tips and resource suggestions for learning plans.
    *   These are hardcoded arrays of objects in `services/aiService.ts`.

2.  **Dynamic User-Defined Knowledge:**
    *   When users add custom skills or interests via the UI, these items are saved to `localStorage` using `services/localStorageService.ts`.
    *   This dynamic list of user-defined items is retrieved and considered during context generation for career advice.

3.  **Context Retrieval (`retrieveRelevantContext` in `aiService.ts`):**
    *   A simple keyword-matching mechanism scores and selects relevant entries from the static KBs based on the user's input (skills, interests, field of study, job title for timetables).
    *   It also incorporates the names of relevant user-defined skills/interests from `localStorage`.
    *   A limited number of the most relevant context snippets are chosen.

4.  **Augmented Prompts:**
    *   The retrieved context (both static and dynamic) is then injected into the prompt sent to Llama 3.
    *   The LLM is instructed to consider this augmented context alongside the user's direct input to generate more informed and tailored advice.

**Note on RAG:** This implementation demonstrates the RAG concept. Production-grade RAG systems typically involve more sophisticated techniques like vector databases, semantic search, and larger, external knowledge sources. The primary goal here is to show how RAG can enhance response quality by providing the LLM with targeted, relevant information.

## 📁 Project Structure

```
.
├── public/                     # Static assets (if any, currently minimal)
├── index.html                  # Main HTML entry point
├── App.tsx                     # Main React application component, manages state and routing
├── index.tsx                   # React root rendering
├── vite.config.ts              # Vite configuration (env variables, aliases)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # (Inline in index.html) Tailwind CSS configuration
├── metadata.json               # Application metadata
├── README.md                   # This file
├── components/                 # UI React Components
│   ├── BackgroundPage.tsx      # User background input form
│   ├── ErrorDisplay.tsx        # Error message display
│   ├── Footer.tsx              # Application footer
│   ├── Header.tsx              # Application header (name, theme toggle, nav)
│   ├── HomePage.tsx            # Initial landing page
│   ├── ItemCard.tsx            # Card for individual skills/interests
│   ├── JobDetailPage.tsx       # Displays job details and timetable
│   ├── LoadingIndicator.tsx    # Loading animation and text
│   ├── Modal.tsx               # Reusable modal dialog
│   ├── ProgressStepper.tsx     # Visual progress indicator for user journey
│   ├── QuoteDisplay.tsx        # Displays inspirational quotes
│   ├── ResultsDisplay.tsx      # Displays AI-generated career advice
│   ├── SaveSessionButton.tsx   # Floating button to save plan
│   ├── SavedPlansPage.tsx      # Page to view and manage saved plans
│   └── SelectionGridPage.tsx   # Generic page for selecting skills/interests from a grid
├── data/                       # Static data arrays
│   ├── interests.ts            # Predefined interests and categories
│   ├── skills.ts               # Predefined skills and categories
│   └── quotes.ts               # Inspirational quotes
├── services/                   # Business logic and external service integrations
│   ├── aiService.ts            # Handles communication with Ollama, RAG logic, prompt generation
│   └── localStorageService.ts  # Manages saving/loading user-defined items and saved sessions
└── types.ts                    # TypeScript type definitions for the application
```

*   **`@/` alias:** Vite is configured to use `@/` as an alias for the project root directory (`./`).

## 💡 Key Functionality Notes

*   **Timetable Generation:** The AI is specifically prompted to adhere to user-defined timeframes (e.g., "2 months" must be an 8-week plan). If a roadmap is too extensive, the AI is instructed to condense it rather than extend the duration.
*   **User Data Persistence:**
    *   Selected career plans (user inputs, chosen job, generated timetable) are saved to browser `localStorage`.
    *   User-defined skills/interests added via the "Add Custom" feature are also saved to `localStorage` for dynamic RAG.
    *   Theme preference (dark/light mode) is persisted in `localStorage`.

This project serves as a powerful demonstration of how local LLMs can be integrated into web applications to provide intelligent, personalized user experiences.
