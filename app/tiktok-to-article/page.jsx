import CreateArticleForm from "@/components/CreateArticleForm";

const Page = () => {
    return (
        <div className="min-h-dvh flex justify-center pt-20 bg-dot-white/[0.2]">
            <div className="max-w-[55rem] w-full flex flex-col items-center gap-5 pt-10">
                <h1 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                    Create Article
                </h1>
                <p className="text-center text-lg text-gray-700 max-w-prose">
                    Transform your TikTok videos into comprehensive articles
                    with ease using our TikTok to Article Converter. This tool
                    analyzes your video content, extracts key points, and
                    generates a well-structured article, perfect for blog posts,
                    newsletters, or any written format.
                </p>
                <div className="flex pt-10 px-3 justify-center self-center w-full max-w-screen-md">
                    <CreateArticleForm />
                </div>
            </div>
        </div>
    );
};

export default Page;
