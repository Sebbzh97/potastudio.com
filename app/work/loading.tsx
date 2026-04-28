export default function WorkLoading() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen animate-pulse">
      {/* Hero */}
      <div className="container-site pt-28 sm:pt-40 pb-12">
        <div className="h-3 w-24 bg-white/10 rounded mb-6" />
        <div className="h-14 sm:h-20 w-2/3 bg-white/10 rounded mb-4" />
        <div className="h-14 sm:h-20 w-1/2 bg-white/10 rounded mb-6" />
        <div className="h-5 w-1/2 bg-white/10 rounded" />
      </div>
      <div className="container-site pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-video bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
