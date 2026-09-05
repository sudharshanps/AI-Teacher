import React from 'react';

interface NidhiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const NidhiLogo: React.FC<NidhiLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { imgSize: 'w-8 h-8', title: 'text-base font-bold', sub: 'text-[10px]' },
    md: { imgSize: 'w-10 h-10', title: 'text-lg font-extrabold', sub: 'text-[11px]' },
    lg: { imgSize: 'w-14 h-14', title: 'text-2xl font-black', sub: 'text-xs' },
    xl: { imgSize: 'w-20 h-20', title: 'text-3xl font-black', sub: 'text-sm' }
  };

  const { imgSize, title, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${imgSize} rounded-xl overflow-hidden shadow-sm border border-[#00A3E0]/30 bg-[#002B49] flex items-center justify-center flex-shrink-0 group`}>
        <img
          src="/nidhivizh_logo.png"
          alt="NidhiVizh Logo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to inline SVG if image file is not found
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle glowing indicator */}
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFC700] ring-2 ring-[#002B49]" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${title} tracking-tight text-[#002B49] font-sans flex items-center`}>
            Nidhi<span className="text-[#0072CE]">Vizh</span>
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#00A3E0]/15 text-[#0072CE] font-bold border border-[#00A3E0]/30 tracking-wider">
            NOC V1.0
          </span>
        </div>
        {showSubtitle && (
          <span className={`${sub} text-[#64748B] font-medium tracking-tight whitespace-nowrap`}>
            Evidence-Driven Transaction Risk Investigation
          </span>
        )}
      </div>
    </div>
  );
};
