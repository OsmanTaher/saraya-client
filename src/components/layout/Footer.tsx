function Footer() {
  return (
    <footer className="print:hidden bg-orange-50 text-orange-950/80 text-center py-5 border-t border-orange-200 text-xs shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
      <div
        dir="ltr"
        className="font-mono text-xs md:text-sm flex items-center justify-center gap-2 flex-wrap text-orange-900/80"
      >
        <span>&lt; Developed By &gt;</span>
        <a
          href="https://aswany.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 md:px-3 md:py-1 rounded-md font-bold transition-all hover:scale-105 bg-[#D55304] text-white hover:bg-[#b84403] shadow-sm"
        >
          Osman
        </a>
        <span className="hidden sm:inline">
          &lt; All Copy Rights Reserved @2026 &gt;
        </span>
        <span className="sm:hidden">&lt; / &gt;</span>
      </div>
    </footer>
  );
}

export default Footer;