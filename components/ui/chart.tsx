export function Chart({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-slate-50 border rounded-md flex items-center justify-center text-slate-400">
      {children}
    </div>
  );
}