import React, { useState, useEffect } from "react";

function useIsMobile() {
    const mobileBreakpoint = 768;
    const [isMobile, setIsMobile] = useState(() => typeof window === "undefined" ? false : window.innerWidth < mobileBreakpoint);

    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth < mobileBreakpoint;
            setIsMobile(isNowMobile);
        }
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    return isMobile;
}

export default useIsMobile;
