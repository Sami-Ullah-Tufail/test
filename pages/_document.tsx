import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta charSet='utf-8' />
				<link rel='icon' type='image/png' href='/images/favicon.png' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
				/>
				<meta
					name='theme-color'
					content='#18181b'
					media='(prefers-color-scheme: dark)'
				/>
				<meta name='theme-color' content='#f4f4f5' />
				
				{/* PWA Icons */}
				<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
				<link rel='manifest' href='/manifest.json' />
				
				{/* iOS Splash Screen */}
				<link
					href='/SAVER.svg'
					media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
					rel='apple-touch-startup-image'
				/>
				<link
					href='/SAVER.svg'
					media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
					rel='apple-touch-startup-image'
				/>
				<link
					href='/SAVER.svg'
					media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
					rel='apple-touch-startup-image'
				/>
				<link
					href='/SAVER.svg'
					media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
					rel='apple-touch-startup-image'
				/>
				
				{/* PWA Configuration */}
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
				<meta name='apple-mobile-web-app-title' content='Lesstress' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
