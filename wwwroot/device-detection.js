window.detectMobileDevice = function() {
    try {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';

        // Check for iOS devices specifically (including iPhone 15 Pro Max)
        const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

        // Check for Android
        const isAndroid = /Android/i.test(ua);

        // Check for other mobile indicators
        const isMobileUA = /Mobile|IEMobile|Opera Mini|BlackBerry|webOS/i.test(ua);

        // Check touch capability
        const hasTouch = 'ontouchstart' in window ||
                        navigator.maxTouchPoints > 0 ||
                        navigator.msMaxTouchPoints > 0;

        // Check pointer type
        const isCoarse = matchMedia('(pointer: coarse)').matches;

        // Check screen size
        const isSmallScreen = window.innerWidth <= 1100;

        // iOS devices should always be considered mobile
        if (isIOS) {
            console.log('Detected iOS device');
            return true;
        }

        // Android devices should always be considered mobile
        if (isAndroid) {
            console.log('Detected Android device');
            return true;
        }

        // For other devices, combine multiple signals
        const isMobile = isMobileUA || (hasTouch && isCoarse && isSmallScreen);

        console.log('Device detection:', {
            ua: ua.substring(0, 100),
            isIOS,
            isAndroid,
            isMobileUA,
            hasTouch,
            isCoarse,
            isSmallScreen,
            isMobile
        });

        return isMobile;
    } catch (e) {
        console.error('Device detection error:', e);
        // Default to checking screen size on error
        return window.innerWidth <= 768;
    }
};
