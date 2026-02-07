import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx,js,jsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				"background-light": "#FDFCFB", // Warmer, more premium off-white
				"background-dark": "#0F0F11", // Deeper, richer dark mode bg
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(142, 76%, 36%)', // Richer green
					foreground: 'hsl(356, 100%, 100%)'
				},
				warning: {
					DEFAULT: 'hsl(38, 92%, 50%)', // Amber
					foreground: 'hsl(48, 96%, 89%)'
				},
				info: {
					DEFAULT: 'hsl(217, 91%, 60%)', // Bright Blue
					foreground: 'hsl(210, 40%, 98%)'
				},
				category: {
					food: 'hsl(32, 95%, 54%)', // Vibrant Orange
					healthcare: 'hsl(0, 84%, 60%)', // Soft but bright Red
					grooming: 'hsl(172, 66%, 50%)', // Teal
					toys: 'hsl(270, 60%, 52%)', // Purple
					training: 'hsl(210, 90%, 50%)', // Blue
					other: 'hsl(240, 5%, 64%)' // Cool Gray
				},
				budget: {
					safe: 'hsl(142, 70%, 45%)',
					warning: 'hsl(40, 90%, 50%)',
					danger: 'hsl(0, 80%, 55%)',
					track: 'hsl(240, 5%, 90%)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						height: '0'
					}
				},
				'slide-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'scale-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'heart-beat': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'wiggle': 'wiggle 0.5s ease-in-out',
				'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
				'heart-beat': 'heart-beat 1s ease-in-out infinite'
			},
			boxShadow: {
				soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				glow: '0 0 20px rgba(139, 92, 246, 0.3)',
				'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
				'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
				'playful': '0 10px 25px -5px rgba(124, 62, 237, 0.2)',
				'playful-lg': '0 15px 40px -10px rgba(124, 62, 237, 0.3)',
				'playful-pink': '0 10px 25px -5px rgba(236, 72, 153, 0.3)',
				'playful-fab': '0 15px 30px rgba(124, 62, 237, 0.4)',
				'2xs': 'var(--shadow-2xs)',
				xs: 'var(--shadow-xs)',
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)'
			},
			fontFamily: {
				"display": ["Spline Sans", "sans-serif"],
				"body": ["Spline Sans", "sans-serif"],
				sans: [
					"Spline Sans",
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif'
				],
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
