import React, { useState } from 'react';
import { Icon, ThemeToggleButton } from './Icons';

interface LoginViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogin: (username: string, password: string) => boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  theme,
  onToggleTheme,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errCount, setErrCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(username.trim(), password);
    if (!ok) {
      setError('Wrong username or password.');
      setErrCount((c) => c + 1);
    } else {
      setError('');
    }
  };

  return (
    <div className="lg anim-view">
      <div className="bar0" style={{ marginBottom: 12 }}>
        <span className="brand">Gym Tracker</span>
        <div className="bar0-r">
          <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
      <h1 className="ttl">Log in</h1>
      <p className="sub">Use the username and password you were given.</p>
      <form onSubmit={handleSubmit}>
        <div className="lf">
          <input
            id="lu"
            className="pi"
            type="text"
            placeholder="Username"
            aria-label="Username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="prow">
            <input
              id="lp"
              className="pi"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eyeoff' : 'eye'} />
            </button>
          </div>
        </div>
        {error && (
          <p key={errCount} className="err anim-err" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn pri">
          Log in
        </button>
      </form>
    </div>
  );
};
