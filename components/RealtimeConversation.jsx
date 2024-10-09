"use client";

import { useContext, useRef, useState } from "react";
import { NotifContext } from "./NotifWrapper";
import Image from "next/image";
import { MemoizedReactMarkdown } from "./utils/MemoizedMarkdown";
import { CodeBlock } from "./utils/CodeBlock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { postMessage } from "@/app/actions/realtimeActions";
import OpenAI from "openai";

const RealtimeConversation = () => {
    const { setNotif } = useContext(NotifContext);
    const videoRef = useRef(null);
    const msgRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [input, setInput] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    // +== CAMERA Handler ==+
    const stopMediaStream = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            stopMediaStream();
            setIsCameraOn(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraOn(true);
                    setIsScreenSharing(false);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        }
    };

    const toggleScreenSharing = async () => {
        if (isScreenSharing) {
            stopMediaStream();
            setIsScreenSharing(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsScreenSharing(true);
                    setIsCameraOn(false);
                }
            } catch (err) {
                console.error("Error sharing screen:", err);
            }
        }
    };

    const captureScreenImage = async () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(
                videoRef.current,
                0,
                0,
                canvas.width,
                canvas.height
            );
            return canvas.toDataURL("image/png");
        }
        return null;
    };
    // +==+

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        try {
            // Update UI
            setLoading(true);
            setInput("");
            setMessages((prev) => [...prev, { role: "user", content: input }]);
            setTimeout(
                () => msgRef.current?.scrollIntoView({ behavior: "smooth" }),
                0
            );
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Generating Response..." },
            ]);

            // Validate OpenAI API key
            if (apiKey?.trim().length < 30 || apiKey?.length > 100) {
                setNotif({
                    active: true,
                    message: "Invalid API Key",
                    status: -1,
                });
                throw new Error("Invalid API Key");
            }

            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
            });

            try {
                await openai.models.list();
            } catch (err) {
                throw new Error("Invalid API Key");
            }

            // Send to Backend
            const screenImage = await captureScreenImage();
            const res = await postMessage({
                messages: [...messages, { role: "user", content: input }],
                apiKey,
                screenImage,
            });
            if (res.success) {
                // Simulate streaming by splitting the response into chunks
                const chunks = res.data.split(" ");
                let accumulatedResponse = "";
                for (let i = 0; i < chunks.length; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust delay as needed
                    accumulatedResponse += chunks[i] + " ";
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content =
                            accumulatedResponse.trim();
                        return newMessages;
                    });
                    setTimeout(
                        () =>
                            msgRef.current?.scrollIntoView({
                                behavior: "smooth",
                            }),
                        0
                    );
                }
            } else {
                throw new Error(res.message || "Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setNotif({
                active: true,
                message: err.message || "Internal Server Error",
                status: -1,
            });
            setMessages((prev) => prev.slice(0, -2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[80rem] w-full flex md:flex-row flex-col p-5 gap-10">
            {/* Media Camera/Screen */}
            <div className="w-full md:w-3/5 flex flex-col gap-2 relative h-fit">
                <h2 className="font-bold text-lg">Camera / Screen Capture</h2>
                <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-[500px] object-contain border border-neutral-800 rounded-lg bg-black"
                />
                {/* Camera Button */}
                <div className="absolute flex gap-2 bottom-5 left-1/2 transform -translate-x-1/2">
                    <div
                        onClick={toggleCamera}
                        className="cursor-pointer p-5 rounded-full w-fit h-fit bg-neutral-600 relative"
                    >
                        {/* prettier-ignore */}
                        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3C1.44772 3 1 3.44772 1 4V11C1 11.5523 1.44772 12 2 12H13C13.5523 12 14 11.5523 14 11V4C14 3.44772 13.5523 3 13 3H2ZM0 4C0 2.89543 0.895431 2 2 2H13C14.1046 2 15 2.89543 15 4V11C15 12.1046 14.1046 13 13 13H2C0.895431 13 0 12.1046 0 11V4ZM2 4.25C2 4.11193 2.11193 4 2.25 4H4.75C4.88807 4 5 4.11193 5 4.25V5.75454C5 5.89261 4.88807 6.00454 4.75 6.00454H2.25C2.11193 6.00454 2 5.89261 2 5.75454V4.25ZM12.101 7.58421C12.101 9.02073 10.9365 10.1853 9.49998 10.1853C8.06346 10.1853 6.89893 9.02073 6.89893 7.58421C6.89893 6.14769 8.06346 4.98315 9.49998 4.98315C10.9365 4.98315 12.101 6.14769 12.101 7.58421ZM13.101 7.58421C13.101 9.57302 11.4888 11.1853 9.49998 11.1853C7.51117 11.1853 5.89893 9.57302 5.89893 7.58421C5.89893 5.5954 7.51117 3.98315 9.49998 3.98315C11.4888 3.98315 13.101 5.5954 13.101 7.58421Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        {!isCameraOn && (
                            <div className="absolute -rotate-45 h-[2px] w-10 bg-neutral-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                    </div>
                    <div
                        onClick={toggleScreenSharing}
                        className="cursor-pointer p-5 rounded-full w-fit h-fit bg-neutral-600 relative"
                    >
                        {/* prettier-ignore */}
                        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H3V5.5C3 5.77614 2.77614 6 2.5 6C2.22386 6 2 5.77614 2 5.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H12.5C12.7761 2 13 2.22386 13 2.5V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3H9.5C9.22386 3 9 2.77614 9 2.5ZM2.5 9C2.77614 9 3 9.22386 3 9.5V12H5.5C5.77614 12 6 12.2239 6 12.5C6 12.7761 5.77614 13 5.5 13H2.5C2.22386 13 2 12.7761 2 12.5V9.5C2 9.22386 2.22386 9 2.5 9ZM12.5 9C12.7761 9 13 9.22386 13 9.5V12.5C13 12.7761 12.7761 13 12.5 13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        {!isScreenSharing && (
                            <div className="absolute -rotate-45 h-[2px] w-10 bg-neutral-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/5">
                <div className=" border border-neutral-800 rounded-lg bg-black">
                    {/* ChatGPT API */}
                    <div className="flex flex-col gap-2 p-4 bg-neutral-950">
                        <span className="text-sm">OpenAI API</span>
                        <input
                            className={`w-full p-3 rounded-md focus:outline-none placeholder:text-neutral-500 border border-neutral-950 focus:border-neutral-700 bg-neutral-900 text-white`}
                            type="text"
                            id="openai"
                            placeholder="Input OpenAI API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                    {/* Message Lists */}
                    <div className="overflow-y-auto px-5 h-[400px] ">
                        {messages?.length === 0 ? (
                            <div className="select-none h-[calc(100%-50px)] flex items-center justify-center ">
                                <span className="text-xl font-bold text-center text-neutral-600">
                                    Ask Anything
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 py-5">
                                {messages.map((message, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 md:gap-5"
                                    >
                                        <Image
                                            src={
                                                message.role === "user"
                                                    ? "/default_pfp.png"
                                                    : "/logo_black_white_circle.png"
                                            }
                                            width={100}
                                            height={100}
                                            alt="profile"
                                            className="w-8 md:w-10 md:h-10 aspect-square rounded-full border border-neutral-300"
                                        />

                                        {/* prettier-ignore */}
                                        <div className="overflow-hidden flex flex-col items-start gap-1">

                                            <p className='font-medium text-sm text-nowrap'>{message.role === "user" ? "You" : `${"Tutor"} AI`}</p>

                                            <MemoizedReactMarkdown
                                                className='max-w-full prose prose-sm md:prose-lg'
                                                remarkPlugins={[remarkGfm, remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="text-white" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-blue-600 no-underline hover:underline" {...props} />,
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-x-auto">
                                                            <table className="table-auto border-collapse" {...props} />
                                                        </div>
                                                    ),
                                                    img: ({ node, ...props }) => <img className="max-w-full h-auto my-2" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-400 pl-4 italic my-2 text-white" {...props} />,
                                                    pre: ({ node, ...props }) => <pre className='!p-4 bg-gray-100' {...props} />,
                                                    code({ node, className, children, ...props }) {

                                                        // Check if match language
                                                        const match = /language-(\w+)/.exec(className || '');

                                                        return match ? (
                                                            <CodeBlock
                                                                key={Math.random()}
                                                                language={(match && match[1]) || ''}
                                                                value={String(children).replace(/\n$/, '')}
                                                                {...props}
                                                            />
                                                        ) : (
                                                            <code className={""} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                }}
                                            >
                                                {message.content}
                                            </MemoizedReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div ref={msgRef} className="h-10 w-full"></div>
                    </div>
                    {/* Chat Bar */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 flex items-center gap-2 bg-neutral-950"
                    >
                        <input
                            className={`w-full p-3 rounded-md focus:outline-none placeholder:text-neutral-500 border border-neutral-950 focus:border-neutral-700 bg-neutral-900 text-white`}
                            type="text"
                            id="input"
                            placeholder="Type message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className="p-3 bg-neutral-900 hover:bg-neutral-700 duration-300 active:scale-95 text-white rounded"
                        >
                            {/* prettier-ignore */}
                            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RealtimeConversation;
