import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

import { registerWithEmailAndPasswordService } from '../../services/authService';

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password || password.length < 4) {
      setError('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    // Double Verification of Password
    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Por favor, verifique a confirmação de senha.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerWithEmailAndPasswordService(name, email, password, phone);
      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onRegisterSuccess(user);
      }, 900);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Erro ao realizar cadastro.');
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 shadow-xl">
        <button
          onClick={onNavigateToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-amber-500 dark:text-neutral-400 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para login
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Novo Membro
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Cadastro de Usuário
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Crie seu perfil no Estúdio Tarja Preta com dupla verificação de senha.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Cadastro realizado com sucesso! Redirecionando para as tatuadoras...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Nome Completo *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Priscila Gomes"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              E-mail *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Senha e Dupla Verificação de Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Confirmar Senha *
                </label>
                {passwordsMatch && (
                  <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Conferem
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-neutral-300 dark:border-neutral-700 focus:border-amber-400'
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Telefone/WhatsApp opcional no cadastro inicial */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Telefone / WhatsApp (Opcional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro e Entrar'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Já tem conta registrada?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-amber-500 dark:text-amber-400 hover:underline"
          >
            Fazer login agora
          </button>
        </div>
      </div>
    </div>
  );
};
