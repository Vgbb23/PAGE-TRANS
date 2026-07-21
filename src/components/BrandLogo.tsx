import { BRAND } from '../config/product';

type BrandLogoProps = {
  className?: string;
  variant?: 'white' | 'dark';
  priority?: boolean;
  showSuffix?: boolean;
};

export const BrandLogo = ({
  className = 'h-9 md:h-10 w-auto',
  variant = 'dark',
  showSuffix = false,
}: BrandLogoProps) => (
  <span
    className={`inline-flex items-baseline font-display font-semibold tracking-[0.02em] ${
      variant === 'white' ? 'text-white' : 'text-slate-900'
    } ${className}`}
    aria-label={BRAND.name}
  >
    Quantum
    <span className={variant === 'white' ? 'text-red-300' : 'text-quantum'}> Nutrition</span>
    {showSuffix && (
      <span
        className={`ml-2 text-[0.5em] font-medium tracking-[0.12em] uppercase ${
          variant === 'white' ? 'text-white/60' : 'text-slate-500'
        }`}
      >
        Trans Resveratrol
      </span>
    )}
  </span>
);
