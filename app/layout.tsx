import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'CV Pro Generator - Currículo Profissional com IA',
  description: 'Crie currículos otimizados por IA que passam nos sistemas ATS e geram mais entrevistas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className="antialiased">
          <SignedOut>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
              <div className="max-w-md w-full space-y-8 text-center">
                {/* Logo/Icon */}
                <div className="inline-block p-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl">
                  <svg 
                    className="w-16 h-16 text-white mx-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                {/* Título */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    CV Pro Generator
                  </h1>
                  <p className="text-lg text-blue-200 font-medium">
                    Crie currículos que <span className="text-yellow-300 font-bold">geram entrevistas</span>
                  </p>
                </div>
                {/* Features */}
                <div className="grid grid-cols-1 gap-3 text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  {[
                    '✨ Otimizado por IA Claude',
                    '🎯 Passa em sistemas ATS',
                    '📈 Aumenta suas chances em 3x',
                    '🔒 Dados seguros e privados'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/90 text-sm">
                      <span className="text-base">{feature.split(' ')[0]}</span>
                      <span>{feature.substring(feature.indexOf(' '))}</span>
                    </div>
                  ))}
                </div>
                {/* Botão de Login */}
                <SignInButton mode="modal">
                  <button className="w-full py-4 px-6 bg-white hover:bg-blue-50 text-slate-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
                    Começar Gratuitamente →
                  </button>
                </SignInButton>
                <p className="text-xs text-blue-200/60">
                  Sem cartão de crédito • Seguro e confiável
                </p>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
