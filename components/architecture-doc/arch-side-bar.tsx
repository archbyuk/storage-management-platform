import { architectureNavItems } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ArchSideBar () {
    const router = useRouter();
    
  return (
    <div className="sidebar">
        
        <Link href="/">
            {/* web sidebar */}
            <Image
                src="/assets/icons/logo-full-brand.svg"
                alt="logo"
                width={160}
                height={30}
                className="hidden h-auto lg:block hover:cursor-pointer"
                onClick={() => router.push("/")}
            />

            {/* mobile sidebar */}
            <Image
                src="/assets/icons/logo-brand.svg"
                alt="logo"
                width={52}
                height={52}
                className="lg:hidden"
            />
        </Link>
        
        <p className="subtitle-2 text-light-100 mt-2">Architecture Documentation</p>
        <p className="text-xs text-gray-500 mt-1">Version 1.0 | 2025.06.20</p>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="h4">Table of Contents</p>
          
          <ul className="flex flex-1 flex-col">
            {architectureNavItems.map(
                ( { id, label, href } ) => (
                    <li key={id} 
                        className="sidebar-nav-item"
                    >
                        <a href={href} className="lg:w-full">
                            <p className="h5">
                                {label}
                            </p>
                        </a>
                    </li>
                )
            )}
          </ul>

          {/* Export Options */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">[Export]</h3>
            <div className="space-y-1">
              <button className="block w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
                • PDF
              </button>
              <button className="block w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
                • Markdown
              </button>
            </div>
          </div>
        </nav>
      </div>
  )
}
