import { Link } from 'react-router-dom';

export default function Footer() {
  const links = {
    Platform: [
      { label: "Features", path: "/" },
      { label: "Blueprint", path: "/blueprint" },
      { label: "Runner", path: "/submission" }
    ],
    Resources: [
      { label: "Documentation", path: "#" },
      { label: "GitHub", path: "#" },
      { label: "Support API", path: "#" }
    ],
    Legal: [
      { label: "Privacy Policy", path: "#" },
      { label: "Terms of Service", path: "#" },
      { label: "Security", path: "#" }
    ],
    Social: [
      { label: "LinkedIn", path: "#" },
      { label: "Twitter", path: "#" },
      { label: "Discord", path: "#" }
    ]
  };

  return (
    <footer className="bg-enerblock-red text-enerblock-dark pt-16 pb-8 px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-sm font-medium">
        {Object.entries(links).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs mono">{category}</h4>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i}>
                  {item.path.startsWith('#') ? (
                    <a href={item.path} className="hover:text-white transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link className="hover:text-white transition-colors" to={item.path}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-enerblock-dark/20 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="text-[15vw] leading-none font-bold tracking-tighter select-none italic headline">
          BLUEOPS<span className="text-[5vw] align-top">®</span>
        </div>
        <div className="text-xs font-medium uppercase tracking-widest text-enerblock-dark/60 pb-4 mono">
          © 2026 BLUEOPS. AUTOMATED DEPLOYMENT ORCHESTRATION.
        </div>
      </div>
    </footer>
  );
}
