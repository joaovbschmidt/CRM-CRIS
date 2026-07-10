import { useState } from "react";

export function LoginScreen({
  onSubmit,
  isLoading = false,
  error,
  forgotPasswordHref = "#",
  termsHref = "#",
  className = "",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (onSubmit) {
      await onSubmit({ email, password });
    }
  };

  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 text-card-foreground shadow">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground">
            Insira suas credenciais para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? "Entrando…" : "Entrar"}
          </button>

          <div className="flex justify-center">
            <a
              href={forgotPasswordHref}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Ao usar o sistema, você aceita os{" "}
            <a
              href={termsHref}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Termos de Uso
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
