from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import base64

app = Flask(__name__)
CORS(app)

# Configure the Gemini API key from environment variable
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
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
        # Use Gemini 2.5 Flash which supports vision
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Check if image data is provided
        if "image" in data and data["image"]:
            image_data = data["image"].get("data")  # base64 string
            mime_type = data["image"].get("mimeType", "image/jpeg")
            
            if image_data:
                # Gemini expects image as Part with inline_data
                image_part = {
                    "mime_type": mime_type,
                    "data": image_data  # base64 string (no need to decode)
                }
                # Send prompt + image to Gemini
                response = model.generate_content([user_input, image_part])
            else:
                # Text only
                response = model.generate_content(user_input)
        else:
            # Text only
            response = model.generate_content(user_input)

        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)
