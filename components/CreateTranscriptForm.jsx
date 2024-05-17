"use client"

import dynamic from "next/dynamic";
import OpenAI from "openai";
import React, { useState } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
const Notif = dynamic(() => import("@/components/Notif"));

const CreateTranscriptForm = () => {

    // Step 1 = Insert Video, Step 2 = Update Transcriptions
    const [step, setStep] = useState(1); 

    // User Feedback
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState({ active: false, message: "", success: 0 });
    const [message, setMessage] = useState("");

    // User Input
    const [file, setFile] = useState(null);
    const [openaiAPI, setOpenaiAPI] = useState("");
    const [prompt, setPrompt] = useState("");

    // Output
    const [transcription, setTranscription] = useState("");
    const [link, setLink] = useState("");
    const [randomId, setRandomId] = useState("");

    // Error Handling
    const [errorFile, setErrorFile] = useState("");
    const [errorOpenaiAPI, setErrorOpenaiAPI] = useState("");
    const [errorPrompt, setErrorPrompt] = useState("");

    // Handle Form onChange
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile?.name?.endsWith('.mp4')) {
            setFile(selectedFile);
            setErrorFile('');
        } else {
            setFile(null);
            setErrorFile("only mp4 allowed!");
        };
    };

    const handleOpenaiAPI = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 100) {
            setErrorOpenaiAPI("");
            setOpenaiAPI(inputText);
        };
    };

    const handlePrompt = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 1000) {
            setErrorPrompt("");
            setPrompt(inputText);
        };
    };

    // Step 1 Form Submission
    const handleStep1 = async (e) => {

        e.preventDefault();

        // Form Validation
        let check = true;
        if (!file) return;
        if (openaiAPI?.trim().length < 30 || openaiAPI?.length > 100) {
            setErrorOpenaiAPI("please provide the correct api key");
            check = false;
        } else {
            const openai = new OpenAI({ apiKey: openaiAPI, dangerouslyAllowBrowser: true });
            try {
                await openai.models.list(); // Small Call to Check API Key
            } catch (err) {
                setErrorOpenaiAPI("please provide the correct api key")
                check = false;
            };
        };
        if (!check) return;

        // Construct Form Data (Send to Backend)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("openai_api", openaiAPI)

        try {
            
            // Show Loading UI
            setLoading(true);

            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/transcribe-split-1", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json(); // { success: True, message: "Video successfully transcribed", "transcription": "...", "id": "..." }

            // Check Return
            if (resData?.success) {
                setTranscription(resData?.transcription);
                setRandomId(resData?.id);
                setStep(2);
                setNotif({ active: true, message: "Video Transcribed!", success: 1 });
            } else {
                throw new Error("Something Went Wrong")
            };
            
        } catch (err) {
            console.error(err.message)
            setNotif({ active: true, message: "Failed to Create!", success: -1 });
        } finally {
            setLoading(false);
        };

    };

    // Step 2 Cut Video
    const handleStep2 = async (e) => {

        e.preventDefault();
        
        // Form Validation
        let check = true;
        if (prompt.length < 10 || prompt.length > 1000){
            setErrorPrompt("10 - 1000 characters");
            check = false;
        };
        if (!check) return;

        // Construct Form Data (Send to Backend)
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("file", file);

        try {
            
            // Show Loading UI
            setLoading(true);
        
            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/transcribe-split-2", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json(); // { success: True, message: "Video Splitted", url: "https://urltobackend.com/" }

            // Check Return
            if (resData?.success) {
                setLink(resData?.url);
                setMessage("Video Trimmed!");
                setNotif({ active: true, message: "Video Splitted!", success: 1 });
            } else {
                throw new Error("Something Went Wrong")
            };
            
        } catch (err) {
            console.error(err.message);
            setMessage("Failed to Create!");
            setNotif({ active: true, message: "Failed to Create!", success: -1 });
        } finally {
            setLoading(false);
        };
    };

    if (step === 1) {
        return (
            <div className="w-full flex flex-col gap-10">
                <form onSubmit={handleStep1} className='w-full flex flex-col gap-10'>
                    { loading ? 
                        <div className='h-[calc(100dvh-22rem)] flex items-center justify-center flex-col gap-5'>
                            <span className="loading loading-bars loading-lg"></span>
                            <span>Uploading Video...</span>
                        </div>
                        :
                        <>
                            <h1 className="text-center">Step 1 - Upload Video</h1>

                            {/* Upload Video */}
                            <div className="flex flex-col gap-2 relative">
                                <label htmlFor="display" className="font-medium text-textPrimary">
                                    Upload Video
                                    <span className="text-textSecondary text-xs pl-3 italic font-normal">.mp4 (up to 30 minutes)</span>
                                </label>

                                <input 
                                    type="file" 
                                    accept="video/mp4" 
                                    onChange={handleFileChange}
                                    className={`file-input w-full bg-baseSecondary ${errorFile && "border border-red-500"}`}
                                    required
                                />

                                <div className={`flex items-center ${errorFile ? "justify-between" : "justify-end"}`}>
                                    {errorFile && <p className="text-red-500 text-xs">{errorFile}</p>}
                                </div>
                            </div>

                            {/* OpenAI API */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="display" className="font-medium text-textPrimary">
                                    OpenAI API Key
                                    <span className="text-textSecondary text-xs pl-3 italic font-normal">1-100 characters</span>
                                </label>

                                <input
                                    className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${errorOpenaiAPI && "border border-red-500"}`}
                                    type="text"
                                    id="display"
                                    placeholder="Your OpenAI API Key"
                                    value={openaiAPI}
                                    onChange={handleOpenaiAPI}
                                />

                                <div className={`flex items-center ${errorOpenaiAPI ? "justify-between" : "justify-end"}`}>
                                    {errorOpenaiAPI && <p className="text-red-500 text-xs">{errorOpenaiAPI}</p>}
                                    <div className="text-textSecondary text-sm">{openaiAPI.length}/100</div>
                                </div>
                            </div>
                            
                            {/* Submit Button */}
                            <button type="submit" disabled={loading} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover`}>
                                {loading ? "Loading..." : "Upload"}
                            </button>
                        </>
                    }
                </form>

                { notif?.active && <Notif notif={notif} setNotif={setNotif} />}

            </div>
        ) 
    } else if (step === 2) {
        return (
            <div className="w-full flex flex-col gap-10">

                <form onSubmit={handleStep2} className='w-full flex flex-col gap-10'>
                    { loading ? 
                        <div className='h-[calc(100dvh-22rem)] flex items-center justify-center flex-col gap-5'>
                            <span className="loading loading-bars loading-lg"></span>
                            <span>Splitting Video...</span>
                        </div>
                        :
                        <>
                            <h1 className="text-center">Step 2 - Choose Timestamps</h1>

                            { message && <div className="text-center text-white">{message}</div> }

                            { (link || message) && 
                                <button type='button' onClick={() => location.reload()} className={`w-full text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover`}>
                                    Upload New Video
                                </button>
                            }

                            { link && 
                                <div className="flex flex-col gap-2">
                                    <button type='button' onClick={() => { link && window.open(link) }} className={`w-full text-textPrimary rounded-md bg-green-700 h-12 font-medium hover:bg-green-900`}>
                                        Download
                                    </button>
                                </div>
                            }

                            {/* Input Clip Timestamp */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="display" className="font-medium text-textPrimary">
                                    Timestamp to cut
                                    <span className="text-textSecondary text-xs pl-3 italic font-normal">{`format: hh:mm:ss,mmm --> hh:mm:ss,mmm`}</span>
                                </label>

                                <textarea
                                    className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${errorPrompt && "border border-red-500"}`}
                                    rows={12}
                                    type="text"
                                    id="display"
                                    placeholder="Format: 00:01:23,456 --> 00:01:25,789 (hours:minutes:seconds,milliseconds) Key in multiple lines. The first line of timings is not used."
                                    value={prompt}
                                    onChange={handlePrompt}
                                />

                                <div className={`flex items-center ${errorPrompt ? "justify-between" : "justify-end"}`}>
                                    {errorPrompt && <p className="text-red-500 text-xs">{errorPrompt}</p>}
                                    <div className="text-textSecondary text-sm">{prompt.length}/1000</div>
                                </div>
                            </div>
                                                    
                            {/* Submit Button */}
                            {/* {(!link && !message) && */}
                                <button type="submit" disabled={loading} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover`}>
                                    {loading ? "Loading..." : "Cut Video"}
                                </button>
                            {/* } */}

                            {/* Transcriptions */}
                            <div className="flex flex-col gap-2 mb-20">
                                <label className="flex justify-between font-medium text-textPrimary">
                                    Video Transcription
                                </label>
                                <div className="rounded-md p-4 bg-baseSecondary ">
                                    <Markdown
                                        className='prose md:prose-lg prose-pre:p-0 prose-pre:bg-transparent'
                                        remarkPlugins={[remarkMath, remarkGfm]}
                                        components={{
                                            p({ children }) {
                                                return <p className='text-textPrimary'>{children}</p>
                                            },
                                        }}
                                    >
                                        {transcription}
                                    </Markdown>
                                </div>
                            </div>

                            
                        </>
                    }
                </form>


                { notif?.active && <Notif notif={notif} setNotif={setNotif} />}
            </div>
        ) 
    }

};

export default CreateTranscriptForm;
