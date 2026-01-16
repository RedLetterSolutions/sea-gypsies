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

// Detect device type: 'phone', 'tablet', or 'desktop'
window.detectDeviceType = function() {
    try {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';

        // Check touch capability
        const hasTouch = 'ontouchstart' in window ||
                        navigator.maxTouchPoints > 0 ||
                        navigator.msMaxTouchPoints > 0;

        // Check pointer type
        const isCoarse = matchMedia('(pointer: coarse)').matches;

        // Screen dimensions (use min/max to handle orientation)
        const screenWidth = Math.max(window.innerWidth, window.innerHeight);
        const screenHeight = Math.min(window.innerWidth, window.innerHeight);

        // Check for iPad specifically (includes modern iPads that report as Mac)
        const isIPad = /iPad/.test(ua) ||
                      (navigator.platform === 'MacIntel' && hasTouch && navigator.maxTouchPoints > 1);

        // Check for iPhone/iPod
        const isIPhone = /iPhone|iPod/.test(ua) && !window.MSStream;

        // Check for Android
        const isAndroid = /Android/i.test(ua);
        const isAndroidMobile = isAndroid && /Mobile/i.test(ua);
        const isAndroidTablet = isAndroid && !/Mobile/i.test(ua);

        // Tablet detection: touch device with larger screen
        // Typical tablet: min dimension >= 600px (in landscape, height >= 600)
        // Typical phone: min dimension < 600px
        const minDimension = screenHeight; // smaller dimension
        const isTabletSize = minDimension >= 600 && screenWidth >= 900;
        const isPhoneSize = minDimension < 600 || screenWidth < 768;

        let deviceType = 'desktop';

        // iPad is always tablet
        if (isIPad) {
            deviceType = 'tablet';
        }
        // iPhone/iPod is always phone
        else if (isIPhone) {
            deviceType = 'phone';
        }
        // Android tablet (no "Mobile" in UA)
        else if (isAndroidTablet) {
            deviceType = 'tablet';
        }
        // Android phone (has "Mobile" in UA)
        else if (isAndroidMobile) {
            deviceType = 'phone';
        }
        // Generic Android - use screen size
        else if (isAndroid) {
            deviceType = isTabletSize ? 'tablet' : 'phone';
        }
        // Touch device with coarse pointer - use screen size to determine
        else if (hasTouch && isCoarse) {
            if (isPhoneSize) {
                deviceType = 'phone';
            } else if (isTabletSize) {
                deviceType = 'tablet';
            } else {
                deviceType = 'desktop';
            }
        }

        console.log('Device type detection:', {
            ua: ua.substring(0, 100),
            hasTouch,
            isCoarse,
            screenWidth,
            screenHeight,
            minDimension,
            isIPad,
            isIPhone,
            isAndroid,
            isAndroidMobile,
            isAndroidTablet,
            isTabletSize,
            isPhoneSize,
            deviceType
        });

        return deviceType;
    } catch (e) {
        console.error('Device type detection error:', e);
        // Fallback based on screen size
        const width = window.innerWidth;
        if (width <= 768) return 'phone';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
};
