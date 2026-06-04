import logoAsset from "@/assets/kings-logo.webp.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoAsset.url}
        alt="Kings Pharmacy"
        className={compact ? "h-[72px] w-auto object-contain" : "h-[88px] w-auto object-contain"}
      />
    </div>
  );
}
