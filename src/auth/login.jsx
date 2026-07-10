import './login.css';

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bem-vindo</h1>
          <p>Insira suas credenciais para acessar o sistema</p>
        </div>

        <form className="login-form">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          <p className="error-message"></p>

          <button
            type="submit"
            className="submit-button"
          >
            Entrar
          </button>

          <div className="forgot-password">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <p className="terms">
            Ao usar o sistema, você aceita os{' '}
            <a href="#">Termos de Uso</a>.
          </p>
        </form>
      </div>
    </div>
  );
}