import CreateArticleForm from '@/components/CreateArticleForm';

const Page = () => {
  return (
    <div className="flex flex-col w-full max-w-screen-lg mx-auto pt-32">
        <h1 className='text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary'>Create Article</h1>

        <div className="flex pt-10 px-3 justify-center self-center w-full max-w-screen-md">
          <CreateArticleForm />
        </div>
    </div>
  )
}

export default Page