# LegalEase AI - Contract Clause Comparator

## Project Overview

**LegalEase AI** is an intelligent legal contract analysis tool that helps users compare and analyze contract clauses using AI. The application serves as a legal risk assessment platform that compares two contract clauses side-by-side, identifies differences, risks, and imbalances, and provides AI-powered insights.

**Important Note**: Despite the name "contract-ai", this project focuses on **legal contract analysis**, not blockchain smart contracts.

## Purpose and Main Functionality

The application provides the following capabilities:

- **Side-by-Side Clause Comparison**: Compare two contract clauses simultaneously
- **Risk Identification**: Detect potential legal risks and imbalances
- **Beneficiary Analysis**: Identify which party benefits more from contract terms
- **Neutral Rewrites**: Suggest balanced versions of biased clauses
- **Authenticity Detection**: Analyze and score contract authenticity to detect fake or manipulated language
- **Topic Categorization**: Automatically categorize clauses by legal subject matter
- **Comprehensive Summaries**: Generate concise overviews of clause comparisons

## Project Structure

```
contract-ai/
├── .env                    # Environment variables (API keys)
├── .git/                   # Git repository
├── index.html              # Frontend single-page application
├── server.js               # Backend Express API server
├── package.json            # Node.js dependencies and scripts
├── package-lock.json       # Dependency lock file
├── README.md               # Project documentation
└── node_modules/           # Installed dependencies
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | Frontend interface with embedded HTML, CSS, and JavaScript | 127 |
| `server.js` | Backend API server with Express.js | 63 |
| `.env` | API credentials and environment configuration | - |
| `package.json` | Dependency management and project metadata | - |

## Tech Stack

### Frontend

- **HTML5** - Structure and markup
- **TailwindCSS** (via CDN) - Modern utility-first CSS framework for styling
- **Vanilla JavaScript** - Client-side logic and API communication
- **Fetch API** - HTTP requests to backend

**No frontend frameworks used** - Pure JavaScript implementation

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** (v5.2.1) - Web application framework
- **node-fetch** (v3.3.2) - HTTP client for external API calls
- **cors** (v2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (v17.2.3) - Environment variable management

### AI/ML Integration

- **Airia AI API** - Third-party AI service for contract analysis
- **Pipeline ID**: `fc5c7a99-3cd3-45bb-8678-1db4f09901c0`

### Deployment Platforms

- **Vercel** - Production deployment
- **GitHub Pages** - Live demo at https://suprakash-dhar-pw.github.io/contract-ai/
- **Local Development** - Port 5000

## Features and Capabilities

### Core Features

#### 1. Dual Clause Comparison
Users can input two contract clauses (Clause A and Clause B) for comprehensive analysis.

#### 2. AI-Powered Analysis Output

The system provides eight key analysis components:

- **Topic Detection**: Identifies the legal category or subject matter of the clauses
- **Summary**: Provides a concise overview of the comparison
- **Differences**: Lists specific distinctions between Clause A and Clause B
- **Beneficiary Analysis**: Identifies which party (A or B) benefits more from the terms
- **Risk Flags**: Highlights potential legal risks and imbalances
- **Neutral Rewrite**: Suggests a balanced, fair version of the clause
- **Fake Contract Score**: Authenticity score from 0-100 (higher = more likely fake)
- **Fake Contract Signals**: Lists suspicious signals that indicate manipulation

#### 3. User Interface Features

- Clean, modern design with TailwindCSS
- Single textarea input for both clauses
- Real-time status updates during analysis
- Color-coded result cards:
  - Blue: Topic
  - Green: Summary
  - Yellow: Differences
  - Red: Risk flags
  - Indigo: Neutral rewrite
  - Gray: Fake contract analysis
- Fully responsive design for various screen sizes

#### 4. Backend API

- **Endpoint**: `/analyze` (POST)
- JSON request/response format
- Integration with Airia AI pipeline
- Comprehensive error handling
- Request logging for debugging

## Workflow and Architecture

### Data Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1. Inputs two clauses
       ▼
┌─────────────────────────┐
│   Frontend (HTML/JS)    │
│  - Input validation     │
│  - Status updates       │
│  - Results rendering    │
└──────────┬──────────────┘
           │ 2. POST /analyze
           ▼
┌─────────────────────────┐
│   Backend (Express)     │
│  - CORS handling        │
│  - Request forwarding   │
│  - Response parsing     │
└──────────┬──────────────┘
           │ 3. API request
           ▼
┌─────────────────────────┐
│     Airia AI API        │
│  - AI processing        │
│  - Contract analysis    │
└──────────┬──────────────┘
           │ 4. JSON response
           ▼
┌─────────────────────────┐
│   Response Processing   │
│  - Format detection     │
│  - JSON parsing         │
└──────────┬──────────────┘
           │ 5. Display results
           ▼
┌─────────────────────────┐
│   User sees analysis    │
└─────────────────────────┘
```

### Detailed Workflow Steps

1. **User Input** (Frontend)
   - User pastes two clauses in the textarea
   - Clicks "Analyze Clauses" button
   - Input validation ensures non-empty content

2. **Client-Side Processing** (index.html)
   - JavaScript captures input from DOM
   - Sends POST request to `http://localhost:5000/analyze`
   - Displays loading status to user
   - Hides previous results

3. **Backend Processing** (server.js)
   - Express server receives request at `/analyze` endpoint
   - Extracts `userInput` from request body
   - Forwards request to Airia AI API with:
     - Authentication via X-API-KEY header
     - User input payload
     - asyncOutput: false (synchronous processing)
   - Logs request for debugging

4. **Response Parsing** (server.js)
   - Handles two different API response formats:
     - **Newer format**: `data.result` (string requiring JSON parsing)
     - **Older format**: `data.output[0].content[0].text` (Claude-style response)
   - Parses JSON string to JavaScript object
   - Returns structured data to frontend

5. **Results Rendering** (index.html)
   - `renderResults()` function processes the API response
   - Creates styled cards for each analysis component
   - Dynamically injects HTML into results container
   - Displays all analysis components with appropriate styling

### API Endpoint Specification

#### POST /analyze

**Request:**
```json
{
  "userInput": "Clause A: [First clause text]\n\nClause B: [Second clause text]"
}
```

**Response:**
```json
{
  "topic": "Contract Law - Liability",
  "summary": "Comparison summary...",
  "differences": [
    "Difference 1",
    "Difference 2"
  ],
  "who_benefits": "A",
  "risk_flags": [
    "Risk 1",
    "Risk 2"
  ],
  "suggested_neutral_text": "Balanced clause text...",
  "fake_contract_score": 15,
  "fake_contract_signals": [
    "Signal 1",
    "Signal 2"
  ]
}
```

**Status Codes:**
- `200 OK`: Successful analysis
- `500 Internal Server Error`: Processing error

## Frontend Architecture

### Structure
- **Type**: Single Page Application (SPA)
- **File**: Monolithic HTML file with embedded CSS and JavaScript
- **State Management**: DOM-based manipulation (no framework)
- **Rendering**: Vanilla JavaScript with template literals

### Components

1. **Input Section**
   - Textarea for clause entry with placeholder instructions
   - Submit button with hover effects

2. **Status Display**
   - Dynamic status messages
   - Loading and completion states

3. **Output Section**
   - Container for dynamically generated result cards
   - Color-coded cards for different analysis types

### Key JavaScript Functions

- `analyzeClause()`: Handles form submission and API communication
- `renderResults(data)`: Generates and displays result cards
- Event listeners: Button click handling

## Backend Architecture

### Pattern
- **Type**: RESTful API server
- **Architecture**: Middleware-based request processing

### Middleware Stack

```javascript
Express App
├── CORS Middleware        // Enable cross-origin requests
├── JSON Parser Middleware // Parse request bodies
└── /analyze Route Handler // Main analysis endpoint
    ├── Input validation
    ├── External API call (Airia AI)
    ├── Response format detection
    ├── JSON parsing
    └── Error handling
```

### Configuration

- **Port**: 5000
- **Environment Variables**: Loaded via dotenv
- **API Key**: Stored in .env file
- **Async Pattern**: Async/await for asynchronous operations
- **Logging**: Console-based for debugging

### Error Handling

- Try-catch blocks around async operations
- 500 status responses for errors
- Detailed error logging to console

## Security Considerations

1. **API Key Management**
   - API key stored in `.env` file
   - Should never be committed to version control
   - Current implementation uses environment variables correctly

2. **CORS Configuration**
   - CORS enabled for all origins in development
   - Should be restricted to specific domains in production

3. **Input Validation**
   - Basic validation on frontend (non-empty check)
   - Should add backend validation and sanitization

4. **Environment Configuration**
   - Frontend hardcoded to `localhost:5000`
   - Needs environment-based URL configuration for production

## Deployment

### Current Deployment Options

1. **Local Development**
   ```bash
   npm install
   npm start
   # Server runs on http://localhost:5000
   ```

2. **GitHub Pages**
   - Live at: https://suprakash-dhar-pw.github.io/contract-ai/
   - Static frontend deployment

3. **Vercel**
   - Production backend deployment
   - Environment variables configured in Vercel dashboard

### Deployment Considerations

- Frontend requires backend URL update for production
- Environment variables must be set on deployment platform
- CORS configuration should be restricted to production domains

## Development Setup

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd contract-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   # Create .env file
   echo "API_KEY=your_airia_api_key" > .env
   ```

4. Start the server
   ```bash
   npm start
   # or
   node server.js
   ```

5. Open the application
   - Navigate to `http://localhost:5000` in your browser
   - Open `index.html` in a browser

## Code Quality and Patterns

### Strengths
- Clean, well-commented code
- Minimal dependencies (lightweight application)
- Good separation of concerns (frontend/backend)
- Basic error handling implemented
- Console logging for debugging

### Areas for Enhancement
- Add input sanitization and validation on backend
- Implement rate limiting to prevent API abuse
- Add unit and integration tests
- Enhance error messages for better user experience
- Add loading spinners or progress indicators
- Implement request caching to reduce API calls
- Add analytics and usage tracking
- Environment-based configuration for URLs

## Project Timeline

Based on Git history:
- **Initial Commit**: December 2025
- **Recent Updates**: README enhancements, deployment information
- **Current Status**: Functional MVP ready for enhancement

## Future Enhancement Opportunities

### Features
- User authentication and session management
- History of previous analyses
- Export results to PDF or Word format
- Batch clause comparison
- Custom clause templates
- Integration with document management systems
- Multi-language support

### Technical Improvements
- Migrate to a modern frontend framework (React, Vue, or Svelte)
- Add TypeScript for type safety
- Implement comprehensive testing suite
- Add API rate limiting and caching
- Enhance security with input sanitization
- Create admin dashboard for monitoring
- Add websocket support for real-time updates
- Implement progressive web app (PWA) features

### Scalability
- Database integration for storing analysis history
- Redis caching for frequently analyzed clauses
- Load balancing for high traffic
- Microservices architecture for different analysis types
- CDN integration for faster content delivery

## Support and Contribution

### Repository
- Git repository initialized and active
- Main branch: `main`
- Current status: Clean working directory

### Key Team Members
Based on Git commits and file paths, the project is maintained by the development team.

## License

Refer to the repository for licensing information.

---

**Document Version**: 1.0
**Last Updated**: December 21, 2025
**Generated by**: Claude Code - AI Assistant
