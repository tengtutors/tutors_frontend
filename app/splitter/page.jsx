import CreateSplitterForm from '@/components/CreateSplitterForm';

const Page = () => {

    return (
        <div className="min-h-dvh flex justify-center pt-20 bg-dot-white/[0.2]">
            <div className="max-w-[55rem] w-full flex flex-col items-center gap-5 pt-10">
    
            <h1 className='text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary'>Video Splitter</h1>
            <p className='text-center text-lg text-gray-700 max-w-prose'>
            Discover the most engaging moments of your video content with our Viral Moments Extraction tool powered by ChatGPT. Provide a prompt, and let our AI analyze your video to highlight the key moments that are likely to captivate your audience and boost engagement.
            </p>

            <div className="flex pt-10 px-3 justify-center self-center w-full max-w-screen-md">
                <CreateSplitterForm />
            </div>
            
            </div>
        </div>
    )
};

export default Page
