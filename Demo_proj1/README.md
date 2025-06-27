# AI Story Generator Website

This project is a simple web application that allows users to generate short stories using Google's Gemini AI.
Users can input a prompt, select a genre, tone, and style to customize the generated story.

## Features

-   User-friendly interface for story generation.
-   Customizable options for:
    -   Genre (Fantasy, Sci-Fi, Mystery, Romance, Horror, etc.)
    -   Tone (Funny, Serious, Suspenseful, etc.)
    -   Style (Narrative, Descriptive, Poetic, etc.)
-   Displays generated stories directly on the page.
-   Modern and responsive design.

## Project Structure

```
/story-generator
├── index.html       # Main HTML file
├── style.css        # CSS for styling
├── script.js        # JavaScript for application logic and API calls
└── README.md        # This file
```

## Setup and Usage

1.  **Clone or Download the Repository (or create the files as provided).**

2.  **Get a Google Gemini API Key:**
    *   Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) (or Google Cloud Console for Gemini API access).
    *   Create a new API key if you don't have one.
    *   Ensure the Gemini API (Generative Language API) is enabled for your project if using Google Cloud.

3.  **Add Your API Key:**
    *   Open the `script.js` file.
    *   Find the following line:
        ```javascript
        const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
        ```
    *   Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual Google Gemini API key.

4.  **Open in Browser:**
    *   Open the `index.html` file in your web browser.

5.  **Generate Stories:**
    *   Enter a prompt in the text area.
    *   Select your desired genre, tone, and style.
    *   Click the "Generate Story" button.
    *   The generated story will appear below the input section.

## How It Works

-   The `index.html` file provides the structure of the webpage, including input fields and an area to display the story.
-   `style.css` adds styling to make the page visually appealing and responsive.
-   `script.js` handles the following:
    -   Capturing user input (prompt, genre, tone, style).
    -   Constructing a request to the Google Gemini API.
    -   Sending the request via the `fetch` API.
    -   Processing the API response and displaying the generated story or any errors.

## Important Notes

-   **API Key Security:** Your API key is included directly in the client-side JavaScript. For a production application, especially one with high traffic, you should **never** expose your API key directly in client-side code. Instead, you would typically use a backend server to proxy requests to the Gemini API. This example is simplified for ease of setup and demonstration.
-   **API Usage Costs:** Be mindful of the usage costs associated with the Google Gemini API. Monitor your usage in the Google Cloud Console.
-   **Error Handling:** The script includes basic error handling for API requests and responses.

## Customization

-   **Styling:** Feel free to modify `style.css` to change the look and feel of the website.
-   **Options:** You can add more genres, tones, or styles by updating the `<select>` elements in `index.html` and adjusting the prompt construction in `script.js` if necessary.
-   **API Parameters:** Explore the [Google Gemini API documentation](https://ai.google.dev/docs/gemini_api_overview) to customize `generationConfig` (e.g., `temperature`, `maxOutputTokens`) in `script.js` for different generation behaviors.
