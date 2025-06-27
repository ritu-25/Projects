document.addEventListener('DOMContentLoaded', () => {
    const userPromptInput = document.getElementById('userPrompt');
    const genreSelect = document.getElementById('genre');
    const toneSelect = document.getElementById('tone');
    const styleSelect = document.getElementById('style');
    const generateBtn = document.getElementById('generateBtn');
    const storyOutputDiv = document.getElementById('storyOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // IMPORTANT: Replace with your actual Google Gemini API Key
    const GEMINI_API_KEY = 'AIzaSyAjZ24X-JN8znsxPbd8kOdA4ziil3-B-jw'; 
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`; // Updated to a more current model

    generateBtn.addEventListener('click', async () => {
        const prompt = userPromptInput.value.trim();
        const genre = genreSelect.value;
        const tone = toneSelect.value;
        const storyStyle = styleSelect.value;

        if (!prompt) {
            storyOutputDiv.innerHTML = '<p style="color: red;">Please enter a prompt to generate a story.</p>';
            return;
        }

        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            storyOutputDiv.innerHTML = '<p style="color: orange;">Please replace "YOUR_GEMINI_API_KEY_HERE" with your actual Google Gemini API key in script.js.</p>';
            // Display a sample story for UI testing purposes
            setTimeout(() => {
                 storyOutputDiv.innerHTML = `<p><strong>Sample Story (API Key Needed for Real Generation):</strong></p>
                 <p>Once upon a time, in a land of ${genre}, a ${tone} hero embarked on a quest. The story was told in a ${storyStyle} manner, captivating all who read it. The prompt was: "${prompt}".</p>
                 <p><em>This is a placeholder. Add your Gemini API key to generate a real story.</em></p>`;
            }, 500);
            return;
        }

        storyOutputDiv.innerHTML = ''; // Clear previous story
        loadingIndicator.style.display = 'flex'; // Show loading indicator
        generateBtn.disabled = true;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `Generate a short story based on the following details:\nPrompt: ${prompt}\nGenre: ${genre}\nTone: ${tone}\nStyle: ${storyStyle}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,       // Controls randomness: lower = more deterministic, higher = more creative
                topK: 1,                // Consider the top K most probable tokens
                topP: 1,                // Consider tokens with cumulative probability >= topP
                maxOutputTokens: 8192, // Maximum number of tokens in the generated text
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                storyOutputDiv.innerHTML = `<p style="color: red;">Error generating story. Status: ${response.status}. Message: ${errorData.error?.message || 'Unknown error'}</p>`;
                if (response.status === 400 && errorData.error?.message.includes('API key not valid')) {
                     storyOutputDiv.innerHTML += '<p style="color: orange;">Please ensure your API key is correct and has the Gemini API enabled in your Google Cloud Console.</p>';
                }
                return;
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const generatedStory = data.candidates[0].content.parts[0].text;
                storyOutputDiv.innerHTML = `<p>${generatedStory.replace(/\n/g, '<br>')}</p>`;
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                // Handle cases where the prompt was blocked
                storyOutputDiv.innerHTML = `<p style="color: orange;">The story could not be generated because the prompt was blocked. Reason: ${data.promptFeedback.blockReason}. Please revise your prompt.</p>`;
                if (data.promptFeedback.safetyRatings) {
                    storyOutputDiv.innerHTML += '<ul>';
                    data.promptFeedback.safetyRatings.forEach(rating => {
                        storyOutputDiv.innerHTML += `<li>${rating.category}: ${rating.probability}</li>`;
                    });
                    storyOutputDiv.innerHTML += '</ul>';
                }
            } else {
                console.error('Unexpected API response structure:', data);
                storyOutputDiv.innerHTML = '<p style="color: red;">Received an unexpected response from the AI. The story might be incomplete or missing.</p>';
            }

        } catch (error) {
            console.error('Error:', error);
            storyOutputDiv.innerHTML = `<p style="color: red;">An error occurred while generating the story: ${error.message}</p>`;
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
            generateBtn.disabled = false;
        }
    });
});
