export default function HomeLoading() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen animate-pulse">
      {/* Hero */}
      <div className="container-site pt-28 sm:pt-40 pb-16">
        <div className="h-3 w-32 bg-white/10 rounded mb-6" />
        <div className="h-16 sm:h-24 w-3/4 bg-white/10 rounded mb-4" />
        <div className="h-16 sm:h-24 w-1/2 bg-white/10 rounded mb-8" />
        <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
        <div className="h-5 w-1/2 bg-white/10 rounded mb-10" />
        <div className="flex gap-4">
          <div className="h-12 w-36 bg-white/10 rounded" />
          <div className="h-12 w-36 bg-white/10 rounded" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-y border-white/10 py-8">
        <div className="container-site flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-10 bg-white/10 rounded" />
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="container-site py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

