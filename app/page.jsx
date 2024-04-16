import Link from 'next/link'

const Page = async () => {

    return (
        <div className="h-dvh flex items-center justify-center pt-20 bg-dot-white/[0.2]">

            {/* Desktop: Radial gradient for the container to give a faded look */}
            <div className="hidden md:flex absolute pointer-events-none inset-0 items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="max-w-[55rem] w-full flex flex-col items-center gap-5 px-5">
                <h1 className='text-center font-extrabold text-4xl md:leading-snug md:text-5xl leading-snug'>All In One <span className='bg-primary text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient'>AI Marketing Automation</span></h1>
                <p className='text-center text-textSecondary max-w-[40rem] text-sm'>Elevate Your Marketing Strategies to New Heights: Empower Your Campaigns with the Cutting-Edge Capabilities of AI Automation and Maximizing Impact.</p>
                <Link href={`/tiktok-to-article`} className='text-sm px-5 py-4 bg-primary rounded-full font-medium hover:bg-primary/80 hover:scale-105 transition-all duration-300 ease-in-out delay-0'>Get Started</Link>
            </div>
        </div>

    )
}

export default Page;