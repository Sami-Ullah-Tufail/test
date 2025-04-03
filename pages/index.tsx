import { useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault(); // Prevent default prompt
      setDeferredPrompt(event); // Store the event for later use
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA installation");
        } else {
          console.log("User dismissed the PWA installation");
        }
        setDeferredPrompt(null); // Reset the prompt after use
      });
    } else {
      alert("PWA installation is not supported on this browser.");
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className='mt-4 px-4 py-2 bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-800 rounded-md font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors'
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
					Stress affects everyone, and it's a growing concern worldwide. In a recent
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
