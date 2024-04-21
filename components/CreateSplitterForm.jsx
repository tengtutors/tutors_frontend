"use client"

import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
const Notif = dynamic(() => import("@/components/Notif"));

const CreateSplitterForm = () => {

    // User Feedback
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState({ active: false, message: "", success: 0 });

    // User Input
    const [file, setFile] = useState(null);
    const [seconds, setSeconds] = useState(5);

    // Response
    const [link, setLink] = useState("");
    const [text, setText] = useState("");

    // Error Handling
    const [errorSeconds, setErrorSeconds] = useState("");

    // Duration of Each Clip
    const handleSeconds = (e) => {
        const inputNumber = e.target.value;
        setErrorSeconds("");
        if(!/^\d+$/.test(inputNumber) && inputNumber.length > 0){
            setErrorSeconds("only numbers");
            return;
        };
        setSeconds(inputNumber);
    };

    // File Uploading
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // Button to Download
    const handleDownload = async () => link && window.open(link)

    // Form Submission
    const handleSubmit =async (e) => {

        e.preventDefault();

        // Form Validation
        let check = true;
        if (!file) return;
             
        if (!seconds || parseInt(seconds) < 5) {
            setErrorSeconds("min 5 seconds!");
            check = false;
        };

        if (!check) return;

        // Construct Form Data (Send to Backend)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("seconds", parseInt(seconds))

        try {
            
            // Show Loading UI
            setLoading(true);
        
            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/upload", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json(); // { success: True, message: "Video Created", url: "https://urltobackend.com/" }

            // Check Return
            if (resData?.success) {
                setLink(resData?.url);
                setText(resData?.gpt_response)
                setNotif({ active: true, message: "Video Created!", success: 1 });
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

  return (
    <>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-10'>
                { loading ? 
                    <div className='h-[calc(100dvh-22rem)] flex items-center justify-center'>
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                    :
                    <>
                        {/* OpenAI API Key */}
                        <div className="flex flex-col gap-2 relative">
                            <label htmlFor="display" className="font-medium text-textPrimary">
                                Upload Video
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">.mp4</span>
                            </label>

                            <input 
                                type="file" 
                                accept="video/mp4" 
                                onChange={handleFileChange}
                                className="file-input w-full" 
                                required
                            />
                        </div>
                        
                        {/* Seconds */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="display" className="font-medium text-textPrimary">
                                Clip Duration
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">(min 5 seconds)</span>
                            </label>

                            <input
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${errorSeconds && "border border-red-500"}`}
                                type="text"
                                id="display"
                                placeholder="60"
                                value={seconds}
                                onChange={handleSeconds}
                            />

                            <div className={`flex items-center ${errorSeconds ? "justify-between" : "justify-end"}`}>
                                {errorSeconds && <p className="text-red-500 text-xs">{errorSeconds}</p>}
                            </div>
                        </div>

                        {/* <div className="flex flex-col gap-2">
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
                        </div> */}
                        
                        <button type="submit" disabled={loading} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${loading && "bg-baseSecondaryHover"}`}>
                            {loading ? "Loading..." : "Upload"}
                        </button>

                        { link && 
                            <div className="flex flex-col gap-5 mb-20">
                                <button onClick={handleDownload} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${loading && "bg-baseSecondaryHover"}`}>
                                    Download
                                </button>
                                <p className='text-red-400 text-center'>some videos might not be able to be downloaded</p>
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
                                        {text}
                                    </Markdown>
                                </div>
                            </div>
                        }  

                        { notif?.active && <Notif notif={notif} setNotif={setNotif} />}
                    </>
                }
            </form>
        </>
  )
}

export default CreateSplitterForm