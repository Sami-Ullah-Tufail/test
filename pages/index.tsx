import { useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'


const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS and Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const safari = ios && !/chrome|crios|fxios/.test(userAgent);

    setIsIOS(ios);
    setIsSafari(safari);
    setIsInstalled((window.navigator as any).standalone); // Checks if PWA is already installed on iOS

    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault(); // Prevent auto-showing the prompt
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
      alert("PWA installation is not supported on this browser.");
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



const Index = () => (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
				We grow a lot of rice.
			</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					Stress affects everyone, and it&apos;s a growing concern worldwide. In a recent
					global survey, researchers found that over{' '}
					<span className='font-medium text-zinc-900 dark:text-zinc-50'>
						75% of adults
					</span>{' '}
					experience moderate to high levels of stress on a regular basis.
				</p>

				<br />

				<p className='text-sm text-zinc-600 dark:text-zinc-400'>
					<a
						href='https://github.com/mvllow/next-pwa-template'
						className='underline'
					>
						Source
					</a>
				</p>
			</div>
		</Section>
		<Section>
			<h2 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
				Download Our App
			</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					Take stress management with you wherever you go. Install our app on your mobile device for easy access.
				</p>

				<InstallPWAButton />
			</div>
		</Section>
	</Page>
)

export default Index
