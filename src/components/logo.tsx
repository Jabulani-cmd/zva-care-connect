import logoAsset from "@/assets/kings-logo.webp.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center">
      <img
        src={logoAsset.url}
        alt="Kings Pharmacy — At Your Service"
        className={
          compact
            ? "h-12 w-auto object-contain"
            : "h-16 w-auto object-contain"
        }
      />
    </div>
  );
}
