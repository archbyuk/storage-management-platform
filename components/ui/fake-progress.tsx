import { useState, useEffect } from "react";

export default function FakeProgress({ durationMs }: { durationMs: number }) {
    const [percent, setPercent] = useState(0);
  
    useEffect(() => {
        const start = Date.now();   // get the current time in milliseconds
        
        // setInterval to update the progress bar every 100 milliseconds
        const id = setInterval(() => {
            const elapsed = Date.now() - start;     // calculate the elapsed time since the start
            
            // calculate the percentage of progress based on the elapsed time and duration
            const p = Math.min(100, Math.round(
                (elapsed / durationMs) * 100)
            );
            
            setPercent(p);
            
            if (elapsed >= durationMs) clearInterval(id);
        }, 50);
    
        return () => clearInterval(id);
    }, [durationMs]);
  
    return (
        <div className="flex flex-col mt-1">
            <div className="bg-gray-200 rounded h-1 overflow-hidden" style={{ width: '8vw' }}>
                <div
                  className="bg-brand h-1 rounded"
                  style={{ width: `${percent}%`, transition: 'width 0.05s linear' }}
                />
            </div>
            
            <p className="text-xs text-gray-500 mt-1">{percent}%</p>
        </div>
  );
}