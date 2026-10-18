import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Phone,
  MessageCircle,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Booking, User } from '../../types';

interface MyBookingsScreenProps {
  currentUser: User;
  bookings: Booking[];
  onBackToArtists: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  currentUser,
  bookings,
  onBackToArtists,
  onCancelBooking,
}) => {
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArtists}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Tatuadoras
        </button>

        <span className="text-xs font-semibold text-neutral-400">
          Perfil: <strong className="text-white">{currentUser.name}</strong>
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Meus Agendamentos
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Acompanhe suas sessões marcadas, datas, horários e referências enviadas.
        </p>
      </div>

      {userBookings.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Nenhuma sessão agendada ainda
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Você ainda não agendou nenhuma tatuagem no Estúdio Tarja Preta. Escolha uma de nossas artistas e reserve seu horário.
          </p>
          <button
            onClick={onBackToArtists}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Explorar Tatuadoras</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map((b) => {
            const formattedDate = new Date(b.date + 'T00:00:00').toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={b.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      {b.id}
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmado
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                    Sessão com {b.artistName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300">
                    <span className="flex items-center gap-1 font-medium capitalize">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 font-bold font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {b.time}h
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {b.bodyPart} (~{b.sizeCm}cm)
                    </span>
                  </div>

                  {b.referenceImages && b.referenceImages.length > 0 && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        Referências:
                      </span>
                      <div className="flex gap-1.5">
                        {b.referenceImages.map((img, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700"
                          >
                            <img src={img} alt="Referência" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
                  <a
                    href={`https://wa.me/${b.artistWhatsapp}?text=${encodeURIComponent(
                      `Olá ${b.artistName}! Tenho um agendamento com você (${b.id}) no dia ${b.date} às ${b.time}h.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente cancelar o agendamento ${b.id}?`)) {
                        onCancelBooking(b.id);
                      }
                    }}
                    className="w-full sm:w-auto p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 text-xs"
                    title="Cancelar agendamento"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Cancelar Sessão</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
