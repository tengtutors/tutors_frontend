'use server'

import OpenAI from "openai";
import { nanoid } from 'nanoid'
import fs from 'fs';
import path from 'path';
import { PassThrough, Readable } from "stream";
import https, { get } from 'https';
import got from 'got';

export async function generateArticle({ openaiAPI = "", tiktokURL = "", prompt = "" }) {

    if (openaiAPI.length < 30 || openaiAPI.length > 100 || !tiktokURL.includes("tiktok")) {
        throw new Error("Wrong API/Tiktok URL")
    };
    
    try {
        const openai = new OpenAI({ apiKey: openaiAPI });

        const extractedVideoUrl = await extractVideoFromTikTokVideo(tiktokURL);
        const extractedText = await convertVideoToText(extractedVideoUrl, openai);
        console.log(extractedText)
        return;
        const articleText = await createArticle(extractedText, prompt, openai);

        return articleText;
        
    } catch (err) {
        throw new Error(err.message);
    };

    // const videoUrl = "https://www.tiktok.com/@ace_scorers/video/7349991869650078978";

};

async function createArticle(extractedText, prompt, openai) {
    try {

        const prompter = `
            Context: ${extractedText}\n
            
            User: Generate an SEO-friendly article based on this context! \n
            
            ${prompt ? `${prompt}` : ''}
        `;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: 'system', content: "As an SEO professional, you will help user generate article with high-value keywords to enhance visibility and attract organic traffic." },
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
        const res = await fetch(`https://api.douyin.wtf/tiktok_video_data/?tiktok_video_url=${videoUrl}`);
        const data = await res.json();
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
        
        // Menyimpan file audio yang diunduh ke dalam buffer
        const randId = nanoid();
        
        const tempFilePath = path.join(process.cwd(), "tmp", `video-${randId}.mp4`); // Menyimpan file sementara di direktori temp

        // console.log(extractedVideoUrl)
        // const videoStream = await got.stream(extractedVideoUrl) // Request {}
        // const videoStream = https.get(extractedVideoUrl); // ClientRequest {}

        // const videoStream2 = await fetch(extractedVideoUrl);
        // const videoStream = Readable.fromWeb(videoStream2.body) // Readable {}
        // console.log(videoStream)
    
        
        


        // console.log(videoStream)
        
        // return;
        checkAndCreateDirectory( path.join(process.cwd(), "tmp") );
        fs.writeFileSync(tempFilePath, Buffer.from(videoBuffer));
    
        // Membuat file stream dari file audio yang telah diunduh
        const videoStream = fs.createReadStream(tempFilePath); // ReadStream {}

        videoStream.on('end', async () => {
            fs.unlinkSync(tempFilePath);
            console.log('Temporary video file removed:', tempFilePath);
        });
    
        const transcription = await openai.audio.transcriptions.create({
            file: videoStream,
            model: "whisper-1",
        });
        
        return transcription.text;
        return ""

    } catch (err) {
        console.log(err.message)
        // console.log(`${path.join(process.cwd(), "temp", `video.mp4`)}`)
        throw new Error("Invalid OpenAI API Key");
    }   
};

function checkAndCreateDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        try {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log(`Directory '${directoryPath}' created successfully.`);
        } catch (error) {
            console.error(`Error creating directory '${directoryPath}':`, error);
        }
    } else {
        console.log(`Directory '${directoryPath}' already exists.`);
    }
}