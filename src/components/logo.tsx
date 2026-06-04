import logoAsset from "@/assets/kings-logo.webp.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoAsset.url}
        alt="Kings Pharmacy"
        className={
          compact
            ? "h-14 w-auto object-contain -my-1"
            : "h-[88px] w-auto object-contain -my-2"
        }
      />
      <div className="hidden sm:flex flex-col leading-tight">
        <span
          className={`font-black tracking-tight text-[#1B3A6B] ${
            compact ? "text-base" : "text-xl"
          }`}
        >
          KINGS PHARMACY
        </span>
        <span
          className={`text-[#1E5BC6] font-semibold tracking-wide uppercase ${
            compact ? "text-[9px]" : "text-[10px]"
          }`}
        >
          At Your Service
        </span>
      </div>
    </div>
  );
}
