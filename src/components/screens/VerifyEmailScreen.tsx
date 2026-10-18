import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  LogOut,
  ShieldAlert,
  Sparkles,
  Inbox,
  ExternalLink,
} from 'lucide-react';
import { User } from '../../types';
import {
  resendVerificationEmailService,
  checkEmailVerifiedService,
  markEmailAsVerifiedDemoService,
} from '../../services/authService';
import { isFirebaseConfigured } from '../../firebaseconfig';

interface VerifyEmailScreenProps {
  currentUser: User;
  onEmailVerified: (updatedUser: User) => void;
  onLogout: () => void;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  currentUser,
  onEmailVerified,
  onLogout,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const firebaseActive = isFirebaseConfigured();

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Periodic automatic check every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const isVerified = await checkEmailVerifiedService(currentUser);
        if (isVerified) {
          onEmailVerified({
            ...currentUser,
            emailVerified: true,
          });
        }
      } catch (err) {
        // silent check
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser, onEmailVerified]);

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      const isVerified = await checkEmailVerifiedService(currentUser);
      setIsChecking(false);

      if (isVerified) {
        onEmailVerified({
          ...currentUser,
          emailVerified: true,
        });
      } else {
        setErrorMessage(
          'Seu e-mail ainda não foi validado. Acesse a caixa de entrada do seu e-mail (ou pasta de spam) e clique no link de confirmação enviado pelo Firebase.'
        );
      }
    } catch (err: any) {
      setIsChecking(false);
      setErrorMessage(err.message || 'Erro ao verificar status do e-mail.');
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

    try {
      await resendVerificationEmailService(currentUser);
      setIsResending(false);
      setResendSuccess(true);
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err: any) {
      setIsResending(false);
      setErrorMessage(err.message || 'Erro ao reenviar e-mail de verificação.');
    }
  };

  // Demo simulator button for testing immediately
  const handleSimulateVerification = () => {
    markEmailAsVerifiedDemoService(currentUser.email);
    onEmailVerified({
      ...currentUser,
      emailVerified: true,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 shadow-xl space-y-6">
        {/* Lock / Security Warning Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400/40">
            <Mail className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 border border-amber-400/30 rounded-full text-[11px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Validação Obrigatória de E-mail
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Confirme seu E-mail
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            Enviamos um link de verificação padrão do <strong className="text-neutral-900 dark:text-white">Firebase</strong> para o endereço:
          </p>

          {/* User's Email Box */}
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700 font-mono text-sm font-bold text-amber-500 dark:text-amber-400 inline-block px-5">
            {currentUser.email}
          </div>
        </div>

        {/* Blocking Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-neutral-800 dark:text-neutral-200 text-xs leading-relaxed space-y-2">
          <div className="font-bold text-amber-500 dark:text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            Acesso ao aplicativo bloqueado
          </div>
          <p className="text-[12px] text-neutral-600 dark:text-neutral-300">
            Por normas de segurança e autenticidade do <strong>Estúdio Tarja Preta</strong>, não é permitido navegar ou agendar sessões com as tatuadoras sem a validação do seu endereço de e-mail.
          </p>
        </div>

        {/* Feedback messages */}
        {resendSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              E-mail de confirmação reenviado com sucesso! Verifique sua caixa de entrada e a pasta de spam.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Action 1: Check verification status */}
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verificando no Firebase...
              </span>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Já validei meu e-mail / Atualizar Status</span>
              </>
            )}
          </button>

          {/* Action 2: Resend verification email */}
          <button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isResending ? (
              <span>Reenviando e-mail...</span>
            ) : resendCooldown > 0 ? (
              <span>Reenviar e-mail em {resendCooldown}s</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-amber-500" />
                <span>Reenviar E-mail de Verificação</span>
              </>
            )}
          </button>

          {/* Action 3: Simulation Helper for Testing without waiting for real inbox */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-between gap-3 text-[11px]">
            <div className="text-neutral-500 dark:text-neutral-400">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Ambiente de Testes / Demonstração:
              </span>
              Simule o clique no link de validação do e-mail.
            </div>
            <button
              onClick={handleSimulateVerification}
              className="px-3 py-1.5 bg-neutral-200 hover:bg-amber-400 hover:text-black dark:bg-neutral-800 dark:hover:bg-amber-400 dark:hover:text-black text-neutral-700 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
            >
              Simular Validação
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
          <p>
            <strong>Dica:</strong> Se não encontrar o e-mail na Caixa de Entrada, procure na pasta <strong>Spam</strong> ou <strong>Lixo Eletrônico</strong>.
          </p>
          <p>
            O remetente oficial é <code>noreply@...firebaseapp.com</code>.
          </p>
        </div>

        {/* Logout / Switch Email */}
        <div className="text-center pt-2">
          <button
            onClick={onLogout}
            className="text-xs text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 inline-flex items-center gap-1.5 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair ou entrar com outra conta
          </button>
        </div>
      </div>
    </div>
  );
};
