"use client";

import OpenAI from "openai";
import React, { useContext, useState } from "react";
import copy from "copy-to-clipboard";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { NotifContext } from "./NotifWrapper";

const CreateSplitterForm = () => {
    const { setNotif } = useContext(NotifContext);

    // User Feedback
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // User Input
    const [file, setFile] = useState(null);
    const [seconds, setSeconds] = useState(30);
    const [openaiAPI, setOpenaiAPI] = useState("");
    const [prompt, setPrompt] =
        useState(`From the transcript extract key learning points into a clip and give the title recommendation for each clip from the SRT Text Format delimited by triple quotes.  Each clip should be <<TIME>> seconds.
Return only timestamps with the format of HH:MM:SS,sss --> HH:MM:SS,sss and the title.
For Example: HH:MM:SS,sss --> HH:MM:SS,sss - "The title"
"""
<<SRT>>
"""
    `);

    // Response
    const [link, setLink] = useState("");
    const [text, setText] = useState("");

    // Error Handling
    const [errorFile, setErrorFile] = useState("");
    const [errorSeconds, setErrorSeconds] = useState("");
    const [errorOpenaiAPI, setErrorOpenaiAPI] = useState("");
    const [errorPrompt, setErrorPrompt] = useState("");

    // Handle Copy
    const handleCopy = async (text) => {
        copy(`${text}`);
        setNotif({ active: true, message: "Text Copied!", status: 1 });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle Form onChange
    const handleSeconds = (e) => {
        const inputNumber = e.target.value;
        setErrorSeconds("");
        if (!/^\d+$/.test(inputNumber) && inputNumber.length > 0) {
            setErrorSeconds("only numbers");
            return;
        }
        setSeconds(inputNumber);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile?.name?.endsWith(".mp4")) {
            setFile(selectedFile);
            setErrorFile("");
        } else {
            setFile(null);
            setErrorFile("only mp4 allowed!");
        }
    };

    const handleOpenaiAPI = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 100) {
            setErrorOpenaiAPI("");
            setOpenaiAPI(inputText);
        }
    };

    const handlePrompt = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 1000) {
            setErrorPrompt("");
            setPrompt(inputText);
        }
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form Validation
        let check = true;
        if (!file) return;

        if (!seconds || parseInt(seconds) < 15) {
            setErrorSeconds("min 15 seconds!");
            check = false;
        }

        if (openaiAPI?.trim().length < 30 || openaiAPI?.length > 100) {
            setErrorOpenaiAPI("please provide the correct api key");
            check = false;
        } else {
            setLoading(true);
            const openai = new OpenAI({
                apiKey: openaiAPI,
                dangerouslyAllowBrowser: true,
            });
            try {
                await openai.models.list(); // Small Call to Check API Key
            } catch (err) {
                setErrorOpenaiAPI("please provide the correct api key");
                check = false;
            } finally {
                setLoading(false);
            }
        }

        if (prompt.length > 1000) {
            setErrorPrompt("max 1000 characters");
            check = false;
        }

        if (!check) return;

        // Reset Response
        setLink("");
        setText("");

        // Construct Form Data (Send to Backend)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("seconds", parseInt(seconds));
        formData.append("openai_api", openaiAPI);
        formData.append("prompt", prompt);

        try {
            // Show Loading UI
            setLoading(true);

            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/split", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json(); // { success: True, message: "Video Created", url: "https://urltobackend.com/", gpt_response: "...." }

            // Check Return
            if (resData?.success) {
                setLink(resData?.url);
                setText(resData?.gpt_response);
                setNotif({
                    active: true,
                    message: "Video Created!",
                    status: 1,
                });
            } else {
                throw new Error(resData.message);
            }
        } catch (err) {
            console.error(err.message);
            setNotif({
                active: true,
                message: err.message || "Internal Server Error",
                status: -1,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-10">
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-10"
            >
                {loading ? (
                    <div className="h-[calc(100dvh-22rem)] flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : (
                    <>
                        {/* Upload Video */}
                        <div className="flex flex-col gap-2 relative">
                            <label
                                htmlFor="display"
                                className="font-medium text-textPrimary"
                            >
                                Upload Video
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    .mp4 (up to 30 minutes)
                                </span>
                            </label>

                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={handleFileChange}
                                className={`file-input w-full bg-baseSecondary ${
                                    errorFile && "border border-red-500"
                                }`}
                                required
                            />

                            <div
                                className={`flex items-center ${
                                    errorFile
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {errorFile && (
                                    <p className="text-red-500 text-xs">
                                        {errorFile}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Clip Seconds */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="display"
                                className="font-medium text-textPrimary"
                            >
                                Clip Duration
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    (minimum 15 seconds)
                                </span>
                            </label>

                            <input
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${
                                    errorSeconds && "border border-red-500"
                                }`}
                                type="text"
                                id="display"
                                placeholder="30"
                                value={seconds}
                                onChange={handleSeconds}
                            />

                            <div
                                className={`flex items-center ${
                                    errorSeconds
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {errorSeconds && (
                                    <p className="text-red-500 text-xs">
                                        {errorSeconds}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* OpenAI API */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="display"
                                className="font-medium text-textPrimary"
                            >
                                OpenAI API Key
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    1-100 characters
                                </span>
                            </label>

                            <input
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${
                                    errorOpenaiAPI && "border border-red-500"
                                }`}
                                type="text"
                                id="display"
                                placeholder="Your OpenAI API Key"
                                value={openaiAPI}
                                onChange={handleOpenaiAPI}
                            />

                            <div
                                className={`flex items-center ${
                                    errorOpenaiAPI
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {errorOpenaiAPI && (
                                    <p className="text-red-500 text-xs">
                                        {errorOpenaiAPI}
                                    </p>
                                )}
                                <div className="text-textSecondary text-sm">
                                    {openaiAPI.length}/100
                                </div>
                            </div>
                        </div>

                        {/* Prompt GPT */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="display"
                                className="font-medium text-textPrimary"
                            >
                                Prompt
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">{`do not remove the <<TIME>> and <<SRT>>`}</span>
                            </label>

                            <textarea
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${
                                    errorPrompt && "border border-red-500"
                                }`}
                                rows={12}
                                type="text"
                                id="display"
                                placeholder="Your prompt to ChatGPT"
                                value={prompt}
                                onChange={handlePrompt}
                            />

                            <div
                                className={`flex items-center ${
                                    errorPrompt
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {errorPrompt && (
                                    <p className="text-red-500 text-xs">
                                        {errorPrompt}
                                    </p>
                                )}
                                <div className="text-textSecondary text-sm">
                                    {prompt.length}/1000
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover`}
                        >
                            {loading ? "Loading..." : "Upload"}
                        </button>
                    </>
                )}
            </form>

            {link && !loading && (
                <div className="flex flex-col gap-5 mb-20">
                    <button
                        type="button"
                        onClick={() => {
                            link && window.open(link);
                        }}
                        className={`w-full my-5 text-textPrimary rounded-md bg-green-700 h-12 font-medium hover:bg-green-900`}
                    >
                        Download
                    </button>

                    <div className="flex flex-col gap-2">
                        <label className="flex justify-between font-medium text-textPrimary">
                            <div className="">
                                GPT Response
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    some videos might not available
                                </span>
                            </div>
                            <span
                                className="text-sm cursor-pointer"
                                onClick={() => handleCopy(text)}
                            >
                                {copied ? "Copied" : "Copy"}
                            </span>
                        </label>
                        <div className="rounded-md p-4 bg-baseSecondary ">
                            <Markdown
                                className="prose md:prose-lg prose-pre:p-0 prose-pre:bg-transparent"
                                remarkPlugins={[remarkMath, remarkGfm]}
                                components={{
                                    p({ children }) {
                                        return (
                                            <p className="text-textPrimary">
                                                {children}
                                            </p>
                                        );
                                    },
                                }}
                            >
                                {text}
                            </Markdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSplitterForm;
