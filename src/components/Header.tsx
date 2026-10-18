import React from 'react';
import { Sun, Moon, LogOut, Calendar, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { User, ScreenType } from '../types';

interface HeaderProps {
  currentUser: User | null;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  bookingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  onLogout,
  bookingCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              onNavigate(
                currentUser
                  ? currentUser.emailVerified === false
                    ? 'verify-email'
                    : 'artists'
                  : 'login'
              )
            }
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            {/* Tarja Preta Icon Symbol */}
            <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center font-black text-black tracking-tighter text-sm shadow-sm transition-transform group-hover:scale-105">
              TP
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-neutral-100 uppercase whitespace-nowrap">
                TARJA <span className="text-amber-500 dark:text-amber-400">PRETA</span>
              </span>
              <span className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase -mt-1 font-medium">
                ESTÚDIO AUTORAL
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        {currentUser && currentUser.emailVerified !== false && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => onNavigate('artists')}
              className={`hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap py-1 ${
                currentScreen === 'artists' || currentScreen === 'portfolio'
                  ? 'text-neutral-950 dark:text-white border-b-2 border-amber-400 font-bold'
                  : ''
              }`}
            >
              Tatuadoras
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className={`hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                currentScreen === 'my-bookings'
                  ? 'text-neutral-950 dark:text-white border-b-2 border-amber-400 font-bold'
                  : ''
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Meus Agendamentos</span>
              {bookingCount > 0 && (
                <span className="text-[10px] bg-amber-400 text-black font-bold px-1.5 py-0.2 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Zone 3: Actions (Discreet Theme Toggle + User / Logout) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Discreet Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* User Auth state */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
              <div
                onClick={() => onNavigate('my-bookings')}
                className="hidden sm:flex items-center gap-2 text-left cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-amber-400/50 flex items-center justify-center text-xs font-bold text-amber-500 dark:text-amber-400">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-tight max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Desconectar da conta"
                className="p-2 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  currentScreen === 'login'
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black rounded-md transition-colors"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
