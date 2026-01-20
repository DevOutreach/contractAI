# ✅ Import dependencies
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize app
app = Flask(__name__)
CORS(app)

# ✅ Config
AIRIA_KEY = os.getenv("AIRIA_KEY")
AIRIA_URL = "https://api.airia.ai/v2/PipelineExecution/b9791679-a12b-4cf4-b1e0-23534346baa6"

# ✅ Analyze route
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        user_input = request.json.get("userInput")
        print("🔹 Received input:", user_input)

        response = requests.post(
            AIRIA_URL,
            headers={
                "Content-Type": "application/json",
                "X-API-KEY": AIRIA_KEY,
            },
            json={
                "userInput": user_input,
                "asyncOutput": False,
            },
            timeout=30
        )

        print("🔹 Airia response status:", response.status_code)
        data = response.json()
        print("🔹 Raw response from Airia:", json.dumps(data, indent=2))

        parsed = None

        # ✅ Case 1: Newer Airia format (string under data.result)
        if "result" in data and isinstance(data["result"], str):
            parsed = json.loads(data["result"])

        # ✅ Case 2: Older Claude-style format
        elif (
            "output" in data
            and isinstance(data["output"], list)
            and len(data["output"]) > 0
            and "content" in data["output"][0]
            and len(data["output"][0]["content"]) > 0
            and "text" in data["output"][0]["content"][0]
        ):
            parsed = json.loads(data["output"][0]["content"][0]["text"])

        else:
            raise Exception("Unrecognized Airia API response format")

        return jsonify(parsed)

    except Exception as err:
        print("❌ Server error:", str(err))
        return jsonify({"error": str(err)}), 500


# ✅ Start backend
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
