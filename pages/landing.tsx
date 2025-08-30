import { useEffect, useState } from 'react'
import { detectIncognito } from "detectincognitojs";
import Image from 'next/image';
import Link from 'next/link';

// Import your existing button images
import elearningButton from '../public/KnopE-learningRood.svg';
import lesstressIcon from '../public/logo.png';
import measurementsButton from '../public/KnopMeasurementsGroen.svg';
import practicalInfoButton from '../public/KnopPracticalInfoBlauw.png';

// InstallPWAButton component
const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);
  const [browserName, setBrowserName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add logging for debugging
    console.log('Browser:', navigator.userAgent);
    console.log('PWA Support:', 'BeforeInstallPromptEvent' in window);

    // Detect iOS and Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const safari = ios && !/chrome|crios|fxios/.test(userAgent);
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    // Use detectIncognito for better incognito detection
    detectIncognito().then((result) => {
      console.log('Browser:', result.browserName, 'Incognito:', result.isPrivate);
      setIsIncognito(result.isPrivate);
      setBrowserName(result.browserName);
    }).catch(error => {
      console.error('Error detecting incognito mode:', error);
    });

    setIsIOS(ios);
    setIsSafari(safari);
    setIsMobile(mobile);
    setIsInstalled((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIncognito) {
      alert(`Please use regular browsing mode in ${browserName} to install this app.`);
      return;
    }

    if (isInstalled) {
      alert("This app is already installed on your device.");
      return;
    }

    if (isIOS) {
      alert('On iOS, tap the share icon (box with arrow) at the bottom of your browser, then select "Add to Home Screen" to install this app.');
      return;
    }

    if (browserName.toLowerCase().includes('firefox')) {
      if (isMobile) {
        alert('On Firefox Mobile, tap the three dots menu (⋮) at the top right and select "Install" to add this app to your home screen.');
      } else {
        alert('On Firefox Desktop, click the "+" icon in the address bar to install this app.');
      }
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA installation");
        } else {
          console.log("User dismissed the PWA installation");
        }
        setDeferredPrompt(null);
      });
    } else {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        alert("This app is already installed on your device.");
      } else {
        console.log('PWA installation prompt not available');
        alert(`To install, please use a supported browser like Chrome or Edge in regular mode.`);
      }
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="w-full max-w-xs px-6 py-4 bg-[#6DAF3F] text-white rounded-lg font-semibold hover:bg-[#5A9A35] transition-colors text-lg shadow-lg"
    >
      DOWNLOAD LESSTRESS APP
    </button>
  );
};

const Landing = () => {
  const handleButtonClick = (type: 'measurements' | 'elearning' | 'info') => {
    if (type === 'info') {
      window.location.href = 'https://lesstress.biz/praktische-informatie-lesstress-app/';
      return;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const platform = isIOS ? 'ios' : 'android';
    const url = getPlatformSpecificUrl(platform, type);
    if (url) window.location.href = url;
  };

  // Platform-specific URL function
  function getPlatformSpecificUrl(platform: 'ios' | 'android', type: 'measurements' | 'elearning') {
    const urls = {
      measurements: {
        ios: 'https://apps.apple.com/fi/app/kubios-hrv-daily-readiness/id1463040412',
        android: 'https://play.google.com/store/apps/details?id=com.kubioshrvapp',
        deepLink: 'kubioshrv://',
        iosFallback: 'itms-apps://itunes.apple.com/fi/app/id1463040412',
        androidFallback: 'market://details?id=com.kubioshrvapp'
      },
      elearning: {
        ios: 'https://apps.apple.com/us/app/gnowbe-training-onboarding/id1104428352',
        android: 'https://play.google.com/store/apps/details?id=com.gnowbe.app',
        deepLink: 'gnowbe://open',
        iosFallback: 'itms-apps://itunes.apple.com/us/app/id1104428352?mt=8',
        androidFallback: 'market://details?id=com.gnowbe.app'
      },
    };

    if (type === 'elearning' || type === 'measurements') {
      // Try deep link first
      try {
        window.location.href = urls[type].deepLink;
        // Set timeout for fallback
        setTimeout(() => {
          // If deep link fails, use fallback
          window.location.href = platform === 'ios' ? urls[type].iosFallback : urls[type].androidFallback;
        }, 1000);
      } catch (e) {
        // If deep link fails immediately, use fallback
        window.location.href = platform === 'ios' ? urls[type].ios : urls[type].android;
      }
      return;
    }

    return urls[type][platform];
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Main Content */}
      <div className="flex flex-col items-center max-w-sm w-full">
        
        {/* Download Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Download
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            Lesstress App
          </h2>
        </div>

        {/* Download Button */}
        <div className="mb-8 w-full flex justify-center">
          <InstallPWAButton />
        </div>

        {/* Smartphone Mockup */}
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-64 h-[500px] bg-gray-800 rounded-[2rem] p-2 shadow-2xl">
            {/* Phone Screen */}
            <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
              
              {/* App Content */}
              <div className="pt-8 px-4 pb-4 h-full flex flex-col">
                {/* App Header */}
                <div className="flex items-center justify-center mb-8 mt-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={lesstressIcon}
                      alt="Lesstress"
                      className="w-[80%] h-full object-contain"
                    />  
                  </div>
                </div>

                {/* App Buttons */}
                <div className="flex flex-col gap-4 flex-1">
                  {/* Measurements Button */}
                  <button
                    onClick={() => handleButtonClick('measurements')}
                    className="flex flex-col items-center justify-center pb-2 rounded-lg text-white"
                    
                  >
                <Image
                src={measurementsButton}
                alt="Measurements"
                className="w-fit h-[100px] object-contain"
              />
  
                  </button>

                  {/* E-learning Button */}
                  <button
                    onClick={() => handleButtonClick('elearning')}
                    className="flex flex-col items-center justify-center pb-2 rounded-lg text-white"
                  >
                    <Image
                    src={elearningButton}
                    alt="E-learning"
                    className="w-fit h-[100px] object-contain"
                  />

                  </button>

                  {/* Practical Info Button */}
                  <button
                    onClick={() => handleButtonClick('info')}
                    className="flex flex-col items-center justify-center p rounded-lg text-white"
                  >
                    <Image
                    src={practicalInfoButton}
                    alt="Practical Info"
                    className="w-fit h-[100px] object-contain"
                  />

                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Logo */}
        <div className="absolute bottom-4 left-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
