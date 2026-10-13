function Footer() {
  return (
    <footer className="bg-indigo-950 text-indigo-200 text-center py-6 border-t border-indigo-900 text-xs">
      <div
        dir="ltr"
        className="font-mono text-xs md:text-sm flex items-center justify-center gap-2 flex-wrap text-indigo-200"
      >
        <span>&lt; Developed By &gt;</span>
        <a
          href="https://aswany.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 md:px-3 md:py-1 rounded-md font-bold transition-all hover:scale-105 bg-amber-300 text-indigo-950 hover:bg-amber-200"
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
