import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex mb-6 text-xs text-brand-text-muted mt-8 font-mono">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-brand-cyan">{item.label}</span>
              ) : (
                <>
                  <Link href={item.url} className="hover:text-brand-cyan transition-colors">
                    {item.label}
                  </Link>
                  <svg className="w-3 h-3 mx-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
