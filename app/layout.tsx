import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  title: 'Meu Gerador de Currículos',
  description: 'Crie seu currículo profissional com IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body className="antialiased">
          <SignedOut>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh', 
              flexDirection: 'column', 
              gap: '20px', 
              fontFamily: 'sans-serif',
              textAlign: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <h1 style={{ color: '#111827', fontSize: '2rem' }}>🚀 Gerador de Currículos</h1>
              <p style={{ color: '#4b5563' }}>Faça login para criar e salvar seus currículos com IA.</p>
              <SignInButton mode="modal">
                <button style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#0070f3', 
                  color: '#fff', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  border: 'none', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  Entrar com Google / Email
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            {children}
            <Analytics />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
