import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(override=True)

app = Flask(__name__)

# Configure the Gemini API
try:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key or api_key == 'YOUR_API_KEY_HERE':
        raise KeyError("Google API Key not found or not set in .env file.")
    
    print(f"--- Loaded API Key ending in: ...{api_key[-4:]} ---")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    # Start a chat session to maintain conversation history
    chat_session = model.start_chat(history=[])
    print("--- Chat session started ---")
except KeyError as e:
    print(e)
    model = None
    chat_session = None
except Exception as e:
    print(f"An error occurred during API configuration: {e}")
    model = None
    chat_session = None


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if not chat_session:
        return jsonify({'error': 'Chat session not initialized.'}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Send message to the ongoing chat session
        response = chat_session.send_message(user_message)
        return jsonify({'response': response.text})
    except Exception as e:
        app.logger.error(f"An error occurred during chat generation: {e}", exc_info=True)
        return jsonify({'error': f'Server Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
