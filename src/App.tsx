import React, { useState, useEffect } from 'react';
import { ScreenType, User, TattooArtist, TattooWork, Booking } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { VerifyEmailScreen } from './components/screens/VerifyEmailScreen';
import { ArtistsScreen } from './components/screens/ArtistsScreen';
import { PortfolioScreen } from './components/screens/PortfolioScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { BookingDetailsScreen } from './components/screens/BookingDetailsScreen';
import { BookingSuccessScreen } from './components/screens/BookingSuccessScreen';
import { MyBookingsScreen } from './components/screens/MyBookingsScreen';
import { TATTOO_ARTISTS } from './data/studioData';
import { auth, onAuthStateChanged, isFirebaseConfigured } from './firebaseconfig';
import { logoutService } from './services/authService';

export default function App() {
  // Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tarja_preta_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Booking Flow State
  const [selectedArtist, setSelectedArtist] = useState<TattooArtist | null>(() => {
    return TATTOO_ARTISTS[0];
  });
  const [selectedWork, setSelectedWork] = useState<TattooWork | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  // Stored Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tarja_preta_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Listen to Firebase Auth state if configured
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const isGoogle = fbUser.providerData[0]?.providerId === 'google.com';
          const isVerified = isGoogle ? true : fbUser.emailVerified;
          setCurrentUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Cliente',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || undefined,
            provider: isGoogle ? 'google' : 'credentials',
            emailVerified: isVerified,
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync current user to localStorage and enforce email verification barrier
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tarja_preta_current_user', JSON.stringify(currentUser));
      // Se o usuário não tiver e-mail validado, bloqueia o acesso e direciona para a tela de verificação
      if (currentUser.emailVerified === false) {
        setCurrentScreen('verify-email');
      } else if (
        currentScreen === 'login' ||
        currentScreen === 'register' ||
        currentScreen === 'verify-email'
      ) {
        setCurrentScreen('artists');
      }
    } else {
      localStorage.removeItem('tarja_preta_current_user');
    }
  }, [currentUser]);

  // Auth handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.emailVerified === false) {
      setCurrentScreen('verify-email');
    } else {
      setCurrentScreen('artists');
    }
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.emailVerified === false) {
      setCurrentScreen('verify-email');
    } else {
      setCurrentScreen('artists');
    }
  };

  const handleEmailVerified = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setCurrentScreen('artists');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logoutService();
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // Artist & Portfolio handlers
  const handleSelectArtist = (artist: TattooArtist) => {
    setSelectedArtist(artist);
    setSelectedWork(null);
    setCurrentScreen('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectBooking = (artist: TattooArtist) => {
    setSelectedArtist(artist);
    setSelectedWork(null);
    setCurrentScreen('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToSchedule = (artist: TattooArtist, work?: TattooWork) => {
    setSelectedArtist(artist);
    setSelectedWork(work || null);
    setCurrentScreen('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Schedule handler
  const handleConfirmSchedule = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentScreen('booking-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking completion handler
  const handleBookingSubmitted = (booking: Booking) => {
    setLatestBooking(booking);
    setBookings((prev) => [booking, ...prev]);
    setCurrentScreen('booking-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel booking handler
  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    localStorage.setItem('tarja_preta_bookings', JSON.stringify(updated));
  };

  // Check if user is locked out due to unverified email
  const isEmailVerificationRequired = currentUser && currentUser.emailVerified === false;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
        {/* Universal Top Bar */}
        <Header
          currentUser={currentUser}
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            // Block navigation to protected screens if email is not verified
            if (isEmailVerificationRequired) {
              setCurrentScreen('verify-email');
              return;
            }
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
          bookingCount={bookings.filter((b) => b.userId === currentUser?.id).length}
        />

        {/* Screen Switcher */}
        <main className="flex-1 pb-16">
          {/* SCREEN 1: Login */}
          {currentScreen === 'login' && !currentUser && (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setCurrentScreen('register')}
            />
          )}

          {/* SCREEN 2: Cadastro de Usuário */}
          {currentScreen === 'register' && !currentUser && (
            <RegisterScreen
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => setCurrentScreen('login')}
            />
          )}

          {/* SCREEN: Verificação de E-mail Obrigatória (Bloqueia até validar) */}
          {(currentScreen === 'verify-email' || isEmailVerificationRequired) && currentUser && (
            <VerifyEmailScreen
              currentUser={currentUser}
              onEmailVerified={handleEmailVerified}
              onLogout={handleLogout}
            />
          )}

          {/* SCREEN 3: Tatuadoras Disponíveis no Estúdio (Protegida) */}
          {currentScreen === 'artists' && !isEmailVerificationRequired && (
            <ArtistsScreen
              onSelectArtist={handleSelectArtist}
              onDirectBooking={handleDirectBooking}
            />
          )}

          {/* SCREEN 4: Portfólio de Fotos da Tatuadora (Protegida) */}
          {currentScreen === 'portfolio' && selectedArtist && !isEmailVerificationRequired && (
            <PortfolioScreen
              artist={selectedArtist}
              onBackToArtists={() => setCurrentScreen('artists')}
              onProceedToSchedule={handleProceedToSchedule}
            />
          )}

          {/* SCREEN 5: Agenda da Tatuadora (Protegida) */}
          {currentScreen === 'schedule' && selectedArtist && !isEmailVerificationRequired && (
            <ScheduleScreen
              artist={selectedArtist}
              selectedWork={selectedWork}
              existingBookings={bookings.map((b) => ({
                date: b.date,
                time: b.time,
                artistId: b.artistId,
              }))}
              onBackToPortfolio={() => setCurrentScreen('portfolio')}
              onConfirmSchedule={handleConfirmSchedule}
            />
          )}

          {/* SCREEN 6: Informações Obrigatórias da Tatuagem (Protegida) */}
          {currentScreen === 'booking-details' && selectedArtist && !isEmailVerificationRequired && (
            <BookingDetailsScreen
              artist={selectedArtist}
              date={selectedDate}
              time={selectedTime}
              currentUser={
                currentUser || {
                  id: 'guest',
                  name: 'Visitante',
                  email: 'visitante@tarjapreta.com',
                }
              }
              initialWork={selectedWork}
              onBackToSchedule={() => setCurrentScreen('schedule')}
              onBookingSubmitted={handleBookingSubmitted}
            />
          )}

          {/* SUCESSO: Comprovante de Agendamento */}
          {currentScreen === 'booking-success' && latestBooking && !isEmailVerificationRequired && (
            <BookingSuccessScreen
              booking={latestBooking}
              onViewMyBookings={() => setCurrentScreen('my-bookings')}
              onBackToArtists={() => setCurrentScreen('artists')}
            />
          )}

          {/* MEUS AGENDAMENTOS: Histórico */}
          {currentScreen === 'my-bookings' && currentUser && !isEmailVerificationRequired && (
            <MyBookingsScreen
              currentUser={currentUser}
              bookings={bookings}
              onBackToArtists={() => setCurrentScreen('artists')}
              onCancelBooking={handleCancelBooking}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-8 text-neutral-500 text-xs transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                Estúdio Tarja Preta
              </span>
              <span>· Tatuagem Autoral & Exclusiva</span>
            </div>

            <div className="flex items-center gap-4 text-neutral-400">
              <span>Rua Augusta, 1420 - São Paulo, SP</span>
              <span>·</span>
              <span>WhatsApp: (11) 99876-5431</span>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
