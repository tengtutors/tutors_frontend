'use server'

import OpenAI from "openai";

export async function generateArticle({ openaiAPI = "", tiktokURL = "", prompt = "" }) {

    if (openaiAPI.length < 30 || openaiAPI.length > 100 || !tiktokURL.includes("tiktok")) {
        throw new Error("Wrong API/Tiktok URL")
    };
    
    try {
        const openai = new OpenAI({ apiKey: openaiAPI });

        const extractedVideoUrl = await extractVideoFromTikTokVideo(tiktokURL);
        const extractedText = await convertVideoToText(extractedVideoUrl, openai);
        // const articleText = await createArticle(extractedText, prompt, openai);

        return extractedText;
        
    } catch (err) {
        throw new Error(err.message);
    };

    // const videoUrl = "https://www.tiktok.com/@ace_scorers/video/7349991869650078978";

};

export async function createArticle({extractedText, prompt, openaiAPI = ""}) {
    try {

        const openai = new OpenAI({ apiKey: openaiAPI });
        
        const prompter = `
            Context: ${extractedText}\n
            
            User: Generate an SEO-friendly article based on this context! \n
            
            ${prompt ? `${prompt}` : ''}
        `;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125", // gpt-3.5-turbo-0125 // gpt-4-0125-preview
            messages: [
                { role: 'system', content: "You will generate an article based on the context provided" },
                { role: 'user', content: prompter }
            ],
        });

        return completion.choices[0].message.content;

    } catch (err) {
        console.log(err.message)
        throw new Error("Invalid OpenAI API Key 2");
    };
};

// Fungsi untuk mengekstrak audio dari video TikTok
async function extractVideoFromTikTokVideo(videoUrl) {
    try {
        console.log("MASUK")
        const res = await fetch(`https://api.douyin.wtf/tiktok_video_data/?tiktok_video_url=${videoUrl}`);
        const data = await res.json();
        console.log(data)
        const extractedVideoUrl = data.aweme_list[0].video.play_addr.url_list[0];
        return extractedVideoUrl;
    } catch (err) {
        console.log(err.message)
        throw new Error("Invalid Tiktok URL");
    };
};

async function convertVideoToText(extractedVideoUrl, openai) {

    try {
        const res = await fetch(extractedVideoUrl);
        const videoBuffer = await res.arrayBuffer();
        const buff = Buffer.from(videoBuffer);
        const blob = new Blob([buff], { type: "audio/mp3" });
        const file = new File([blob], 'test.mp3', { type: 'audio/mp3' });

        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1",
        });
        
        return transcription.text;

    } catch (err) {
        console.log(err.message)
        throw new Error("Invalid OpenAI API Key");
    }   
};