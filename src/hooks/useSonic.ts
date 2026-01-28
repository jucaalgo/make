import { useRef, useCallback } from 'react';

/**
 * Sonic UI Engine
 * Generates procedural sci-fi UI sounds using Web Audio API
 * No external files required. Pure, crisp, zero-latency audio.
 */
export const useSonic = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
        const ctx = initAudio();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [initAudio]);

    // 1. SELECT (Click) - High-tech crisp click
    const playSelect = useCallback(() => {
        // Pure synthetic click (No MP3 required)
        playTone(1200, 'sine', 0.05, 0.1);
        playTone(200, 'triangle', 0.05, 0.15);
    }, [playTone]);

    // 2. HOVER - Subtle airy blip
    const playHover = useCallback(() => {
        playTone(800, 'sine', 0.05, 0.01); // Very quiet
    }, [playTone]);

    // 3. CONNECT - Satisfying "Lock" sound
    const playConnect = useCallback(() => {
        const ctx = initAudio();
        const now = ctx.currentTime;

        // Slide up
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }, [initAudio]);

    // 4. GENERATE (Magic Bar) - "Computing" sound
    const playGenerate = useCallback(async () => {
        const ctx = initAudio();
        const now = ctx.currentTime;

        // Rapid arpeggio
        [440, 554, 659, 880].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.1);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.1);
        });
    }, [initAudio]);

    return {
        playSelect,
        playHover,
        playConnect,
        playGenerate
    };
};
