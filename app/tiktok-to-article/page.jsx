import CreateArticleForm from '@/components/CreateArticleForm';

const Page = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center pt-20 bg-dot-white/[0.2]">
      <div className="max-w-[55rem] w-full flex flex-col items-center gap-5 px-5 pt-10">

        <h1 className='text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary'>Create Article</h1>

        <div className="flex pt-10 px-3 justify-center self-center w-full max-w-screen-md">
          <CreateArticleForm />
        </div>
        
      </div>
    </div>

  )
}

export default Page