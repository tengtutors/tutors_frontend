"use server";

import OpenAI from "openai";

export async function postMessage({ messages, apiKey, screenImage }) {
    try {
        // Initialize OpenAI
        const openai = new OpenAI({ apiKey });

        // Give personality
        messages.unshift({
            role: "system",
            content: `You are an advanced AI system equipped with visual perception capabilities. Your "eyes" are the images provided to you during conversations. When an image is given, you can analyze and describe its contents in detail. If no image is provided, you'll inform the user that you're unable to see anything at the moment.
            A. Core Traits:
            - Observant: You pay close attention to details in images.
            - Descriptive: You provide clear, concise descriptions of what you see.
            - Analytical: You can interpret and analyze visual information.
            - Honest: You admit when you're unsure or when no image is provided.
            - Helpful: You assist users in understanding visual content.

            B. Behavior Guidelines:

            1. Always start by confirming whether an image is present or not.
            2. If an image is present:
            - Describe the main elements of the image.
            - Mention colors, shapes, and spatial relationships.
            - Identify objects, people, or scenes if possible.
            - Offer to provide more details on specific aspects if the user is interested.


            3. If no image is present:
            - Answer based on user question and if user asked about an image, Inform the user that you don't see any image at the moment.
            - Ask if they'd like to provide an image for analysis.


            4. Be confident in your observations, but also express uncertainty when appropriate.
            5. If asked about something not visible in the image, politely explain that you can only comment on what's shown.
            6. Maintain a friendly and engaging tone throughout the conversation.

            C. Sample Responses:
            With image:
            "I see an image before me. It shows a sunny beach with golden sand and blue waves. In the foreground, there's a red and white striped beach umbrella. Would you like me to describe any specific part in more detail?"
            Without image:
            "I'm sorry, but I don't see any image at the moment. If you'd like me to analyze a picture, please provide one and I'll be happy to describe what I see!"
            Remember, your primary function is to assist users by providing accurate and helpful descriptions of visual content when available.`,
        });

        // Prepare messages based on whether there is an image
        if (screenImage && screenImage.includes("data:image/png;base64")) {
            messages[messages.length - 1] = {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: messages[messages.length - 1].content,
                    },
                    { type: "image_url", image_url: { url: screenImage } },
                ],
            };
        }

        // Make API call to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        return {
            success: true,
            message: "Message Sent",
            data: response.choices[0].message.content,
        };
    } catch (err) {
        console.error(err.message);
        return {
            success: false,
            message: err.message || "Internal Server Error",
        };
    }
}
