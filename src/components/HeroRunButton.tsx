import { Play, Square, Loader2 } from 'lucide-react';
import { useGraphStore } from '../store/useGraphStore';
import { useSonic } from '../hooks/useSonic';
import { clsx } from 'clsx';
import { useState } from 'react';

export const HeroRunButton = () => {
    const isRunning = useGraphStore(s => s.isRunning);
    const setRunning = useGraphStore(s => s.setRunning);
    const { playSelect, playGenerate } = useSonic();
    const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');

    const toggleRun = async () => {
        playSelect();

        if (isRunning) {
            setRunning(false);
            setStatus('idle');
            return;
        }

        // Start Hero Run
        setRunning(true);
        setStatus('running');
        playGenerate(); // Sonic loop

        // Simulate execution time
        setTimeout(() => {
            setRunning(false);
            setStatus('success');
            // Sound success could go here if added to useSonic
            setTimeout(() => setStatus('idle'), 2000);
        }, 3000);
    };

    return (
        <button
            onClick={toggleRun}
            className={clsx(
                "absolute bottom-10 right-10 z-50 flex items-center justify-center h-16 w-16 rounded-full shadow-2xl transition-all duration-300",
                status === 'idle' && "bg-purple-600 hover:bg-purple-500 hover:scale-110",
                status === 'running' && "bg-slate-800 ring-2 ring-purple-500 animate-pulse",
                status === 'success' && "bg-emerald-500 scale-110"
            )}
        >
            {status === 'idle' && <Play fill="white" className="ml-1" size={24} />}
            {status === 'running' && <Loader2 className="animate-spin text-purple-400" size={24} />}
            {status === 'success' && <Square fill="white" size={20} />}
        </button>
    );
};
