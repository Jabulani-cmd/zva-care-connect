export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-9 w-9 rounded-xl bg-[#1B3A6B] flex items-center justify-center shadow-md">
        <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-black">✚</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-black text-[#1B3A6B] text-base tracking-tight">KINGS PHARMACY</div>
          <div className="text-[10px] italic text-[#1E5BC6] -mt-0.5">at your service</div>
        </div>
      )}
    </div>
  );
}
