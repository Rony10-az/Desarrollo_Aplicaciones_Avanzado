export default function SectionDivider() {
  return (
    <div className="my-16 flex items-center gap-4" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
      <span className="text-lg text-amber-400">✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
    </div>
  )
}
