function Footer() {
  return (
    <footer className="bg-[#1C110A] text-orange-100/90 text-center py-6 border-t border-[#D55304]/30 text-xs">
      <div
        dir="ltr"
        className="font-mono text-xs md:text-sm flex items-center justify-center gap-2 flex-wrap text-orange-100/90"
      >
        <span>&lt; Developed By &gt;</span>
        <a
          href="https://aswany.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 md:px-3 md:py-1 rounded-md font-bold transition-all hover:scale-105 bg-[#D55304] text-white hover:bg-[#b84403] shadow-xs"
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