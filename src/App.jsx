import { useState } from 'react';
import CrmJuridico from './CrmJuridico';
import { LoginScreen } from './auth/loginscreen';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { isAuthenticated, loading, error, signIn, signOut } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  // Enquanto verifica se já existe uma sessão salva, não mostra nada ainda
  // (evita "piscar" a tela de login antes de confirmar que o usuário já está logado)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-text-muted">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        error={error}
        isLoading={signingIn}
        onSubmit={async (data) => {
          setSigningIn(true);
          try {
            await signIn(data);
          } catch {
            // erro já fica disponível via `error` do useAuth
          } finally {
            setSigningIn(false);
          }
        }}
      />
    );
  }

  return <CrmJuridico onLogout={signOut} />;
}
