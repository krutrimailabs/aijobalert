export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {children}
    </div>
  )
}
