"use client";

import React, { useContext, useState } from "react";
import { NotifContext } from "./NotifWrapper";

const CreateSilenceForm = () => {
    const { setNotif } = useContext(NotifContext);

    // User Feedback
    const [loading, setLoading] = useState(false);

    // User Response
    const [link, setLink] = useState("");

    // User Input
    const [file, setFile] = useState(null);

    // Handle File Input
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form Validation
        if (!file) return;
        if (file?.type !== "video/mp4") {
            return;
        }

        // Construct Form Data (Send to Backend)
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Show Loading UI
            setLoading(true);

            // Fetch Request to Backend
            const res = await fetch("https://feelans.site/silence", {
                method: "POST",
                body: formData,
            });
            const resData = await res.json(); // { success: True, message: "Video Created", url: "https://urltobackend.com/" }

            // Check Return
            if (resData?.success) {
                setLink(resData?.url);
                setNotif({
                    active: true,
                    message: "Video Created!",
                    status: 1,
                });
            } else {
                throw new Error(resData.message);
            }
        } catch (err) {
            console.log(err.message);
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
                                    .mp4
                                </span>
                            </label>

                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={handleFileChange}
                                className="file-input w-full bg-baseSecondary"
                                required
                            />
                        </div>

                        {/* Video Display */}
                        {file && (
                            <div className="flex flex-col gap-2">
                                <h3 className="font-medium text-textPrimary">
                                    Selected Video:
                                </h3>
                                <video
                                    controls
                                    className="aspect-video"
                                    src={URL.createObjectURL(file)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full my-5 text-textPrimary rounded-md bg-baseSecondary h-12 font-medium hover:bg-baseSecondaryHover ${
                                loading && "bg-baseSecondaryHover"
                            }`}
                        >
                            {loading ? "Loading..." : "Upload"}
                        </button>
                    </>
                )}
            </form>

            {link && !loading && (
                <button
                    onClick={() => {
                        link && window.open(link);
                    }}
                    className={`w-full my-5 text-textPrimary rounded-md bg-green-700 h-12 font-medium hover:bg-green-900 ${
                        loading && "bg-baseSecondaryHover"
                    }`}
                >
                    Download
                </button>
            )}
        </div>
    );
};

export default CreateSilenceForm;
