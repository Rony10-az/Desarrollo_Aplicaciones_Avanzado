const CURTAIN_FABRIC =
  'bg-[repeating-linear-gradient(90deg,#0a0a0a_0px,#0a0a0a_26px,#171717_40px,#0a0a0a_54px)]'

export default function IntroCurtain() {
  return (
    <div aria-hidden="true" className="intro-curtain pointer-events-none fixed inset-0 z-[100]">
      <div
        className={`intro-panel-left absolute inset-y-0 left-0 w-1/2 border-r border-amber-400/40 shadow-[30px_0_80px_-20px_rgba(251,191,36,0.35)] ${CURTAIN_FABRIC}`}
      />
      <div
        className={`intro-panel-right absolute inset-y-0 right-0 w-1/2 border-l border-amber-400/40 shadow-[-30px_0_80px_-20px_rgba(251,191,36,0.35)] ${CURTAIN_FABRIC}`}
      />

      <div className="intro-logo absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 text-5xl font-black tracking-tight sm:text-7xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-2xl text-zinc-950 sm:h-20 sm:w-20 sm:text-4xl">
            ▶
          </span>
          <span className="text-white">
            Cine<span className="text-amber-400">Stream</span>
          </span>
        </div>
        <div className="intro-line mt-6 h-0.5 w-56 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
      </div>
    </div>
  )
}
