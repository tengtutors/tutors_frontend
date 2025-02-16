"use client";

import OpenAI from "openai";
import { useContext, useState } from "react";
import copy from "copy-to-clipboard";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { NotifContext } from "./NotifWrapper";

const CreateArticleForm = () => {
    const { setNotif } = useContext(NotifContext);

    // User Feedback
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Response
    const [article, setArticle] = useState("");
    const [audioText, setAudioText] = useState("");

    // User Input
    const [openaiAPI, setOpenaiAPI] = useState("");
    const [tiktokURL, setTiktokURL] = useState("");
    const [prompt, setPrompt] = useState("");

    // Error State
    const [errorOpenaiAPI, setErrorOpenaiAPI] = useState("");
    const [errorTiktokURL, setErrorTiktokURL] = useState("");
    const [errorPrompt, setErrorPrompt] = useState("");

    // onClick Handler
    const handleCopy = async (article) => {
        copy(`${article}`);
        setNotif({ active: true, message: "Text Copied!", status: 1 });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // State Form Handler - Controlled Input
    const handleOpenaiAPI = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 100) {
            setErrorOpenaiAPI("");
            setOpenaiAPI(inputText);
        }
    };

    const handleTiktokURL = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 100) {
            setErrorTiktokURL("");
            setTiktokURL(inputText);
        }
    };

    const handlePrompt = (e) => {
        const inputText = e.target.value;
        if (inputText.length <= 100) {
            setErrorPrompt("");
            setPrompt(inputText);
        }
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form Validation
        let isValid = true;

        // OpenAI API
        if (openaiAPI?.trim().length < 30 || openaiAPI?.length > 100) {
            setErrorOpenaiAPI("please provide the correct api key");
            isValid = false;
        } else {
            setLoading(true);
            const openai = new OpenAI({
                apiKey: openaiAPI,
                dangerouslyAllowBrowser: true,
            });
            try {
                await openai.models.list(); // Small Call to isValid API Key
            } catch (err) {
                setErrorOpenaiAPI("please provide the correct api key");
                isValid = false;
            } finally {
                setLoading(false);
            }
        }

        // Tiktok URL
        if (
            tiktokURL?.trim().length < 10 ||
            tiktokURL?.length > 100 ||
            !tiktokURL.includes("tiktok")
        ) {
            setErrorTiktokURL("please provide the correct tiktok url");
            window.scrollTo({ top: 0, behavior: "smooth" });
            isValid = false;
        }

        // Prompt max 100
        if (prompt?.length > 100) {
            setErrorTiktokURL("max 100 characters");
            window.scrollTo({ top: 0, behavior: "smooth" });
            isValid = false;
        }

        if (!isValid) return;

        try {
            // Show Loading UI
            setLoading(true);

            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/tiktok-to-article", {
                method: "POST",
                body: JSON.stringify({ openaiAPI, tiktokURL, prompt }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resData = await res.json(); // { success: true, message: "Article Generated", data: "...article", gpt_text: "..." }

            if (resData?.success) {
                setArticle(resData?.article);
                setAudioText(resData?.gpt_text);
                setNotif({
                    active: true,
                    message: "Article Created!",
                    status: 1,
                });
            } else {
                throw new Error(resData?.message);
            }
        } catch (err) {
            console.error(err.message);
            setNotif({
                active: true,
                message: err?.message || "Internal Server Error",
                status: -1,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                        {/* OpenAI API Key */}
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

                        {/* Tiktok URL */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="tiktokURL"
                                className="font-medium text-textPrimary"
                            >
                                Tiktok URL
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    1-100 characters
                                </span>
                            </label>

                            <input
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${
                                    errorTiktokURL && "border border-red-500"
                                }`}
                                type="text"
                                id="tiktokURL"
                                placeholder="ex. https://www.tiktok.com/@username/video/123456789"
                                value={tiktokURL}
                                onChange={handleTiktokURL}
                            />

                            <div
                                className={`flex items-center ${
                                    errorTiktokURL
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {errorTiktokURL && (
                                    <p className="text-red-500 text-xs">
                                        {errorTiktokURL}
                                    </p>
                                )}
                                <div className="text-textSecondary text-sm">
                                    {tiktokURL.length}/100
                                </div>
                            </div>
                        </div>

                        {/* Extra Prompt */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="prompt"
                                className="font-medium text-textPrimary"
                            >
                                Extra Prompt
                                <span className="text-textSecondary text-xs pl-3 italic font-normal">
                                    optional
                                </span>
                            </label>

                            <input
                                className={`p-3 rounded-md focus:outline-none placeholder:text-textSecondary focus:border focus:border-textSecondary bg-baseSecondary text-textPrimary ${
                                    errorPrompt && "border border-red-500"
                                }`}
                                type="text"
                                id="prompt"
                                placeholder="ex. i want it to be concise and focusing on..."
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
                                    {prompt.length}/100
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${
                                loading && "bg-baseSecondaryHover"
                            }`}
                        >
                            {loading ? "Loading..." : "Create Article"}
                        </button>

                        {article && (
                            <div className="flex flex-col gap-10 mb-20">
                                {/* Article */}
                                <div className="flex flex-col gap-2">
                                    <label className="flex justify-between font-medium text-textPrimary">
                                        Article
                                        <span
                                            className="text-sm cursor-pointer"
                                            onClick={() => handleCopy(article)}
                                        >
                                            {copied ? "Copied" : "Copy"}
                                        </span>
                                    </label>

                                    <div className="rounded-md p-4 bg-baseSecondary ">
                                        <Markdown
                                            className="prose md:prose-lg prose-pre:p-0 prose-pre:bg-transparent"
                                            remarkPlugins={[
                                                remarkMath,
                                                remarkGfm,
                                            ]}
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
                                            {article}
                                        </Markdown>
                                    </div>
                                </div>

                                {/* Audio */}
                                <div className="flex flex-col gap-2">
                                    <label className="flex justify-between font-medium text-textPrimary">
                                        Audio Text
                                        {/* <span className="text-sm cursor-pointer" onClick={() => handleCopy(article)}>{copied ? "Copied" : "Copy"}</span> */}
                                    </label>

                                    <div className="rounded-md p-4 bg-baseSecondary ">
                                        <Markdown
                                            className="prose md:prose-lg prose-pre:p-0 prose-pre:bg-transparent"
                                            remarkPlugins={[
                                                remarkMath,
                                                remarkGfm,
                                            ]}
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
                                            {audioText}
                                        </Markdown>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </form>
        </>
    );
};

export default CreateArticleForm;
