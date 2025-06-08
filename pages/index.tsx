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
  const [isFirefox, setIsFirefox] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect browser and device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const safari = ios && !/chrome|crios|fxios/.test(userAgent);
    const firefox = userAgent.indexOf('firefox') > -1;
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    setIsIOS(ios);
    setIsSafari(safari);
    setIsFirefox(firefox);
    setIsMobile(mobile);
    setIsInstalled((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
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
      alert('To install this app on your iPhone:\n1. Tap the "Share" button at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right');
      return;
    }

    if (isFirefox && isMobile) {
      alert('To install this app on Firefox Mobile:\n1. Tap the three dots menu (⋮)\n2. Tap "Install"\n3. Follow the prompts to add to your home screen');
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
      if (isFirefox) {
        alert('To install this app on Firefox Desktop:\n1. Click the three dots menu (⋮)\n2. Click "Install Lesstress"\n3. Follow the prompts to install');
      } else {
        alert("To install this app:\n1. Look for the install icon (＋) in your browser's address bar\n2. Click it and follow the prompts\n\nIf you don't see the install icon, you may need to use a supported browser like Chrome or Edge.");
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