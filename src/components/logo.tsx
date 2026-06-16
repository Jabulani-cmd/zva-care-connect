import logoAsset from "@/assets/kings-logo.webp.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center">
      <img
        src={logoAsset.url}
        alt="Kings Pharmacy — At Your Service"
        className={
          compact
            ? "h-16 w-auto object-contain drop-shadow-sm"
            : "h-24 w-auto object-contain drop-shadow-sm"
        }
      />
    </div>
  );
}
