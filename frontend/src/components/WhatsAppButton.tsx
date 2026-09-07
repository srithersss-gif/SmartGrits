import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/brochureData';

const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract digits from the primary phone number (+91 73388 82034 -> 917338882034)
  const rawPhone = COMPANY_INFO.phone[0] || '+91 73388 82034';
  const whatsappNumber = rawPhone.replace(/\D/g, '');
  const message = encodeURIComponent('Hello SmartGrits, I would like to inquire about your products and services.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-50 flex items-center flex-row-reverse group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SmartGrits on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_30px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Subtle pulsing wave effect behind button */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current relative z-10 drop-shadow-sm"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.507 14.307l-.009.075c-.301-.15-1.782-.879-2.057-.98-.277-.1-.478-.15-.68.15-.202.3-.78 0.98-.957 1.18-.176.2-.353.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.678-2.087-.176-.301-.019-.464.132-.613.136-.134.301-.35.452-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.68-1.637-.932-2.242-.244-.59-.493-.51-.679-.52-.176-.008-.377-.01-.578-.01-.2 0-.527.075-.804.375-.276.3-1.055 1.03-1.055 2.513 0 1.482 1.08 2.914 1.231 3.114.15.2 2.126 3.246 5.151 4.552.719.31 1.28.496 1.718.636.723.23 1.381.197 1.901.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.2-.577-.35zM12.04 2C6.52 2 2.037 6.48 2.037 12c0 1.97.574 3.81 1.564 5.36L2.3 22l4.821-1.264C8.61 21.547 10.278 22 12.04 22c5.52 0 10.003-4.48 10.003-10S17.56 2 12.04 2zm0 18.232c-1.57 0-3.085-.434-4.402-1.218l-.316-.187-2.862.75.764-2.79-.205-.327C4.195 15.05 3.76 13.56 3.76 12c0-4.566 3.714-8.28 8.28-8.28 4.566 0 8.28 3.714 8.28 8.28 0 4.566-3.714 8.232-8.28 8.232z" />
        </svg>

        {/* Online green indicator badge */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-300 border-2 border-white" />
        </span>
      </a>

      {/* Floating Tooltip Pill */}
      <div
        className={`mr-3 px-3.5 py-1.5 bg-dark/95 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg border border-white/10 whitespace-nowrap transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        Chat on WhatsApp
      </div>
    </aside>
  );
};

export default WhatsAppButton;
