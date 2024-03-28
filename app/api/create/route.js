import OpenAI from "openai";
import { nanoid } from 'nanoid'
import fs from 'fs';
import path from 'path';

export async function POST (req) {
    console.log("MASUK")
    const { openaiAPI = "", tiktokURL = "", prompt = "" } = await req.json();

    
    if (openaiAPI.length < 30 || openaiAPI.length > 100 || !tiktokURL.includes("tiktok")) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    };
    
    try {
        const openai = new OpenAI({ apiKey: openaiAPI });

        const extractedVideoUrl = await extractVideoFromTikTokVideo(tiktokURL);
        const extractedText = await convertVideoToText(extractedVideoUrl, openai);
        console.log(extractedText)
        return Response.json({ success: false, message: extractedText }, { status: 401 });

        const articleText = await createArticle(extractedText, prompt, openai);

        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        
    } catch (err) {
        throw new Error(err.message);
    };

}

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
        // checkAndCreateDirectory( path.join(process.cwd(), "tmp") );
        console.log(tempFilePath)
        fs.writeFileSync(tempFilePath, Buffer.from(videoBuffer));
    
        // Membuat file stream dari file audio yang telah diunduh
        const videoStream = fs.createReadStream(tempFilePath); // ReadStream {}

        videoStream.on('end', () => {
            fs.unlinkSync(tempFilePath);
            console.log('Temporary video file removed:', tempFilePath);
        });
    
        const transcription = await openai.audio.transcriptions.create({
            file: videoStream,
            model: "whisper-1",
        });
        
        return transcription.text;

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