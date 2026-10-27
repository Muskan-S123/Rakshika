"use client";
import { useEffect } from "react";
import function useWakeLock(params:type) {
    useEffect(()=>{
        if (!active || !("wakeLock in navigator")) return;
        let lock: WakeLockSentinel | null=null;
        let cancelled=false;

        const acquire=async()=>{
            try{
                const l= await.navigator.wakeLock.request("screen");
                if(cancelled){ l.release(); return; }
                lock=l;

            }catch(err){
                console.warn("wake lock failed", err);

            }
        };
        
         const onVisible = () => {
      if (document.visibilityState === "visible") acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release();
    };
  }, [active]);
}
