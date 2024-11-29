from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Configure the Gemini API key from environment variable
GENAI_API_KEY = os.getenv("GENAI_API_KEY")  # Set this in Heroku
if not GENAI_API_KEY:
    raise RuntimeError("Missing GENAI_API_KEY environment variable")

genai.configure(api_key=GENAI_API_KEY)

@app.route("/", methods=["GET"])
def home():
    return "Hello, world! The server is running."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Prompt is required."}), 400

    user_input = data["prompt"]

    try:
        # Use the Gemini API to generate a response
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_input)

        # Return the generated content as a response
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))  # Use Heroku's port if available
    app.run(host="0.0.0.0", port=port)
