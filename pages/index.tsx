import { useEffect, useState } from 'react'
import Section from '@/components/section'

import elearningButton from '../public/KnopE-learningRood.svg';
import lesstressIcon from '../public/Lesstress_icon.png';
import measurementsButton from '../public/KnopMeasurementsGroen.svg';
import practicalInfoButton from '../public/KnopPraktischeInfoBlauw.svg';
import Image from 'next/image';

function getPlatformSpecificUrl(platform: 'ios' | 'android', type: 'measurements' | 'elearning') {
  const urls = {
    measurements: {
      ios: 'https://apps.apple.com/fi/app/kubios-hrv-daily-readiness/id1463040412',
      android: 'https://play.google.com/store/apps/details?id=com.kubioshrvapp',
    },
    elearning: {
      ios: 'https://apps.apple.com/us/app/gnowbe-training-onboarding/id1104428352',
      android: 'https://play.google.com/store/apps/details?id=com.gnowbe.app',
    },
  };
  return urls[type][platform];
}
const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Add logging for debugging
    console.log('Browser:', navigator.userAgent);
    console.log('PWA Support:', 'BeforeInstallPromptEvent' in window);

    // Detect iOS and Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const safari = ios && !/chrome|crios|fxios/.test(userAgent);

    setIsIOS(ios);
    setIsSafari(safari);
    setIsInstalled((window.navigator as any).standalone); // Checks if PWA is already installed on iOS

    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault(); // Prevent auto-showing the prompt
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(event); // Store the prompt for later
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (isInstalled) {
      alert("This app is already installed on your device.");
      return;
    }

    if (isSafari) {
      alert('To install this app on your iPhone, tap the "Share" button, then "Add to Home Screen".');
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
        setDeferredPrompt(null); // Reset the prompt
      });
    } else {
      // Check if app is already installed via display-mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        alert("This app is already installed on your device.");
      } else {
        console.log('PWA installation prompt not available');
        alert("To install, please use Chrome or Safari browser.");
      }
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="mt-4 px-4 py-2 bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-800 rounded-md font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
    >
      Install App
    </button>
  );
};

const Index = () => {
  const handleButtonClick = (type: 'measurements' | 'elearning' | 'info') => {
    if (type === 'info') {
      window.location.href = 'https://lesstress.biz/praktische-informatie-lesstress-app/';
      return;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const platform = isIOS ? 'ios' : 'android';
    const url = getPlatformSpecificUrl(platform, type);
    window.location.href = url;
  };

  return (
    <div>
        <div className="absolute top-0 left-0 w-full bg-transparent">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
            <InstallPWAButton />
          </div>
        </div>
      <div className="flex min-h-[100svh] flex-col items-center justify-start p-[4svh] overflow-hidden mt-8">
        <div className="w-full max-w-[90vw] md:max-w-[80vw] flex flex-col items-center gap-[8svh]">
          {/* Logo */}
          <div className="flex justify-center items-center gap-[3svw]">
            <h1 className="text-[min(10vw,3rem)] text-[#8CC63F] poppins-light">Lesstress</h1>
            <Image
              src={lesstressIcon}
              alt="Lesstress"
              className="w-[min(10vw,3.5rem)] h-[min(10vw,3.5rem)] object-contain"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[4svh] w-full max-w-[65vw]">
            <button
              onClick={() => handleButtonClick('measurements')}
              className="w-full h-[20svh] transition-transform hover:scale-[1.02]"
            >
              <Image
                src={measurementsButton}
                alt="Measurements"
                className="w-full h-full object-contain"
              />
            </button>

            <button
              onClick={() => handleButtonClick('elearning')}
              className="w-full h-[20svh] transition-transform hover:scale-[1.02]"
            >
              <Image
                src={elearningButton}
                alt="E-learning"
                className="w-full h-full object-contain"
              />
            </button>

            <button
              onClick={() => handleButtonClick('info')}
              className="w-full h-[20svh] transition-transform hover:scale-[1.02]"
            >
              <Image
                src={practicalInfoButton}
                alt="Practical Info"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Index;