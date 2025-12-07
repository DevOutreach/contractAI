# contract-ai
Intelligent legal clause comparator using Airia AI — identifies risks, summarizes differences, suggests balanced terms, and flags fake or manipulated contract language.


# ⚖️ LegalEase AI — Contract Clause Comparator

LegalEase AI is a web app that analyzes and compares two contract clauses using AI.  
It detects key differences, highlights risks, and even suggests a neutral rewrite for balanced contracts.

---

## 🚀 Features

- ✍️ Compare **two clauses** instantly  
- 🧠 AI-generated **summary** and **topic detection**  
- ⚠️ Identifies **risk flags** and **imbalances**  
- 🪶 Suggests a **neutral rewritten version**  
- 🧩 Detects **fake or tampered contract signals**  
- 🌐 Built with **Express.js**, **TailwindCSS**, and **Airia AI API**

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML, TailwindCSS, JavaScript |
| Backend | Node.js, Express.js |
| AI Engine | [Airia AI API](https://airia.ai) |
| Deployment | Vercel |

---

## ⚙️ Setup Instructions

1. **Clone this repo**
   ```bash
   git clone https://github.com/YOUR-USERNAME/contract-ai.git
   cd contract-ai

2. Install dependencies

npm install


3. Create a .env file

AIRIA_KEY=your_airia_api_key_here


4. Run locally

node server.js


Your backend will run at http://localhost:5000

5. Open the frontend
Double-click index.html or open it via Live Server.

🧠 Example Input

Clause A:

Party A shall defend, indemnify, and hold harmless Party B for all losses.

Clause B:

Party B will indemnify Party A only for damages caused by its negligence.

🧾 Example Output (from AI)
{
  "topic": "Indemnification Obligations",
  "summary": "Two clauses with asymmetrical indemnification terms - one party has unlimited indemnification duties while the other has limited scope protection.",
  "differences": [
    "Party A must indemnify for all losses without limitation.",
    "Party B only indemnifies for damages caused by negligence."
  ],
  "who_benefits": "B",
  "risk_flags": ["Asymmetrical risk allocation favoring Party B"],
  "suggested_neutral_text": "Each party shall indemnify the other for losses arising from their own negligence or misconduct.",
  "fake_contract_score": 25,
  "fake_contract_signals": ["Clauses appear authentic but heavily one-sided."]
}

🌍 Deployment

Deployed on Vercel
➡️ https://contract-ai.vercel.app
