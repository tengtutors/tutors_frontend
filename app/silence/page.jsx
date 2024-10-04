import CreateSilenceForm from "@/components/CreateSilenceForm";

const Page = () => {
    return (
        <div className="min-h-dvh flex justify-center pt-20 bg-dot-white/[0.2]">
            <div className="max-w-[55rem] w-full flex flex-col items-center gap-5 pt-10">
                <h1 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                    Video Silencer
                </h1>
                <p className="text-center text-lg text-gray-700 max-w-prose">
                    Our Video Silencer tool helps you remove silent parts from
                    your video effortlessly. Just upload your video, and let the
                    tool automatically detect and eliminate those silent
                    moments, making your content more engaging and dynamic.
                </p>
                <div className="flex pt-10 px-3 justify-center self-center w-full max-w-screen-md">
                    <CreateSilenceForm />
                </div>
            </div>
        </div>
    );
};

export default Page;
