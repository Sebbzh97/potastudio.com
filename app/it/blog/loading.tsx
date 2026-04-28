export default function BlogLoading() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen animate-pulse">
      {/* Hero */}
      <div className="container-site pt-28 sm:pt-40 pb-16">
        <div className="h-3 w-12 bg-white/10 rounded mb-6" />
        <div className="h-14 sm:h-20 w-2/3 bg-white/10 rounded mb-4" />
        <div className="h-14 sm:h-20 w-1/2 bg-white/10 rounded mb-6" />
        <div className="h-5 w-1/2 bg-white/10 rounded" />
      </div>
      <div className="container-site py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#141414] rounded-xl overflow-hidden h-72">
          <div className="bg-white/5" />
          <div className="p-8 flex flex-col gap-4">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-8 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-white/10 rounded" />
          </div>
        </div>
      </div>
      <div className="container-site pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#141414] rounded-xl overflow-hidden">
            <div className="aspect-video bg-white/5" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-4/5 bg-white/10 rounded" />
              <div className="h-3 w-1/3 bg-white/10 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
