'use client';

import ArchSideBar from '@/components/architecture-doc/arch-side-bar';

// export const metadata: Metadata = {
//   title: 'Drive System Architecture Documentation',
//   description: 'Complete system architecture documentation for Drive System',
// }

export default function ArchitectureLayout( { children }: {children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen">
      
      {/* sidebar */}
      <ArchSideBar />

      {/* Flow Diagram */}
      <div className="flex-1 flex flex-col p-2">
        {children}
      </div>
    </div>
  )
}
