import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { studioHeroImg } from '../../data/studioData';
import { loginWithEmailAndPasswordService, loginWithGoogleService } from '../../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginWithEmailAndPasswordService(email, password);
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Erro ao realizar login.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const user = await loginWithGoogleService();
      setIsGoogleLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsGoogleLoading(false);
      setError(err.message || 'Erro ao autenticar com o Google.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
        {/* Left Side: Brand Imagery & Vibe */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 bg-black text-white overflow-hidden">
          <img
            src={studioHeroImg}
            alt="Ambiente Estúdio Tarja Preta"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Top Pill / Studio Tag */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded">
              <Sparkles className="w-3.5 h-3.5" />
              Tattoo & Dark Art
            </span>
          </div>

          {/* Bottom Pitch */}
          <div className="relative z-10 space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              ESTÚDIO <br />
              <span className="text-amber-400">TARJA PRETA</span>
            </h1>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
              Espaço autoral de alta precisão. Autentique-se com sua conta para acessar o catálogo de tatuadoras, portfólios autorais e a agenda exclusiva de sessões.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[11px] text-neutral-400">
              <span>· Blackwork</span>
              <span>· Fineline</span>
              <span>· Neo-Oriental</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Acesse sua conta
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Entre com E-mail/Senha ou com sua conta Google.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button (PROMINENT AT TOP OR DIRECT) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 px-4 mb-4 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-white border-2 border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-neutral-400 border-t-amber-400 rounded-full animate-spin" />
                Conectando ao Google...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar com conta do Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-400 font-semibold tracking-wider">
                ou entre com e-mail
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Senha
                </label>
                <span className="text-[11px] text-neutral-400">mín. 4 dígitos</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando no Firebase...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar com E-mail</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Ainda não tem cadastro?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-bold text-amber-500 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              Criar conta agora <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
