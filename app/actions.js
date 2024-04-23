// 'use server'

// import OpenAI from "openai";

// export async function generateArticle({ openaiAPI = "", tiktokURL = "" }) {

//     if (openaiAPI.length < 30 || openaiAPI.length > 100 || !tiktokURL.includes("tiktok")) {
//         throw new Error("Wrong API/Tiktok URL")
//     };
    
//     try {
//         const openai = new OpenAI({ apiKey: openaiAPI });

//         const extractedVideoUrl = await extractVideoFromTikTokVideo(tiktokURL);
//         const extractedText = await convertVideoToText(extractedVideoUrl, openai);
//         // const articleText = await createArticle(extractedText, prompt, openai);

//         return extractedText;
        
//     } catch (err) {
//         throw new Error(err.message);
//     };

//     // const videoUrl = "https://www.tiktok.com/@ace_scorers/video/7349991869650078978";

// };

// const parameters = {
//     'aweme_id': "0", // video_id
//     // 'version_name': true,
//     'version_code': 300904, // true
//     // 'build_number': true,
//     // 'manifest_version_code': true,
//     // 'update_version_code': true,
//     // 'openudid': ranGen('0123456789abcdef', 16),
//     // 'uuid': ranGen('0123456789', 16),
//     // '_rticket': ts * 1000,
//     // 'ts': ts,
//     // 'device_brand': 'Google',
//     'device_type': 'ASUS_Z01QD',
//     'device_platform': 'android',
//     "iid": "7318518857994389254",
//     "device_id": "7318517321748022790",
//     // 'resolution': '1080*1920',
//     // 'dpi': 420,
//     'os_version': '9',
//     // 'os_api': '29',
//     // 'carrier_region': 'US',
//     // 'sys_region': 'US',
//     // 'region': 'US',
//     'app_name': "musical_ly",
//     // 'app_language': 'en',
//     // 'language': 'en',
//     // 'timezone_name': 'America/New_York',
//     // 'timezone_offset': '-14400',
//     'channel': 'googleplay',
//     // 'ac': 'wifi',
//     // 'mcc_mnc': '310260',
//     // 'is_my_cn': 0,
//     // 'aid': 0,
//     // 'ssmix': 'a',
//     // 'as': 'a1qwert123',
//     // 'cp': 'cbfhckdckkde1'
// };

// export async function createArticle({extractedText, prompt, openaiAPI = ""}) {
//     try {

//         const openai = new OpenAI({ apiKey: openaiAPI });
        
//         const prompter = `
//             Context: ${extractedText}\n
            
//             User: Generate an SEO-friendly article based on this context! \n
            
//             ${prompt ? `${prompt}` : ''}
//         `;
        
//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo-0125", // gpt-3.5-turbo-0125 // gpt-4-0125-preview
//             messages: [
//                 { role: 'system', content: "You will generate an article based on the context provided" },
//                 { role: 'user', content: prompter }
//             ],
//         });

//         return { article: completion.choices[0].message.content, audio: extractedText };

//     } catch (err) {
//         console.log(err.message)
//         throw new Error("Invalid OpenAI API Key 2");
//     };
// };

// async function extractVideoFromTikTokVideo(videoUrl) {
//     try {

//         var videoIdRegex = /\/video\/(\d+)/;
//         var match = videoUrl.match(videoIdRegex);
//         if (!match) throw new Error("Invalid Tiktok URL");

//         parameters.aweme_id = match[1];

//         const url = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/`+ Object.keys(parameters).map(
//             (key, index) => `${index > 0 ? '&' : '?'}${key}=${parameters[key]}`
//         ).join('');

//         const res = await fetch(url, {
//             method: "GET",
//             headers: {
//                 'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36"
//             }
//         });
//         const resData = await res.json();

//         const extractedVideoUrl = resData.aweme_list[0].video.play_addr.url_list[0]
        
//         return extractedVideoUrl;
//     } catch (err) {
//         console.log(err.message)
//         throw new Error("Invalid Tiktok URL");
//     };
// };

// async function convertVideoToText(extractedVideoUrl, openai) {

//     try {
//         const res = await fetch(extractedVideoUrl);
//         const videoBuffer = await res.arrayBuffer();
//         const buff = Buffer.from(videoBuffer);
//         const blob = new Blob([buff], { type: "audio/mp3" });
//         const file = new File([blob], 'test.mp3', { type: 'audio/mp3' });

//         const transcription = await openai.audio.transcriptions.create({
//             file: file,
//             model: "whisper-1",
//         });
        
//         return transcription.text;

//     } catch (err) {
//         console.log(err.message)
//         throw new Error("Invalid OpenAI API Key");
//     }   
// };