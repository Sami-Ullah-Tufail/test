import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		// Check if this is running as a PWA
		const isStandalone = (window.navigator as any).standalone || 
							 window.matchMedia('(display-mode: standalone)').matches;
		
		// If PWA and on landing page, redirect to main app
		if (isStandalone && router.pathname === '/landing') {
			router.replace('/');
		}
		
		// If not PWA and on main app page, redirect to landing
		if (!isStandalone && router.pathname === '/') {
			const referrer = document.referrer;
			// Only redirect if not coming from another page on our site
			if (!referrer || !referrer.includes(window.location.origin)) {
				router.replace('/landing');
			}
		}
	}, [router.pathname]);

	return (
			<Component {...pageProps} />
	)
}
