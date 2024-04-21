"use client"

import dynamic from 'next/dynamic';
import React, { useState } from 'react'
const Notif = dynamic(() => import("@/components/Notif"));

const CreateSilenceForm = () => {

    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState({ active: false, message: "", success: 0 });
    
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    };

    const handleDownload = async () => {
        if (link) window.open(link);
    };

    const handleSubmit =async (e) => {

        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {

            setLoading(true);
        
            const res = await fetch("https://royalsty.pythonanywhere.com/upload", {
                method: "POST",
                body: formData,
            });
    
            setLink(res?.url)
            setNotif({ active: true, message: "Video Created!", success: 1 });
            
        } catch (err) {
            
            console.log(err.message)
            setNotif({ active: true, message: "Failed to Create!", success: -1 });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-10'>
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
                        
                        <button type="submit" disabled={loading} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${loading && "bg-baseSecondaryHover"}`}>
                            {loading ? "Loading..." : "Upload"}
                        </button>
                    </>
                }
            </form>

            { (link && !loading) && 
                <button onClick={handleDownload} className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${loading && "bg-baseSecondaryHover"}`}>
                    Download
                </button>
            }  

            { notif?.active && <Notif notif={notif} setNotif={setNotif} />}
        </div>
  )
}

export default CreateSilenceForm