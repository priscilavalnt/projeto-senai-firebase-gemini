import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { Booking } from '../../types';

interface BookingSuccessScreenProps {
  booking: Booking;
  onViewMyBookings: () => void;
  onBackToArtists: () => void;
}

export const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({
  booking,
  onViewMyBookings,
  onBackToArtists,
}) => {
  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const whatsappMessage = encodeURIComponent(
    `Olá ${booking.artistName}! Acabei de agendar uma tatuagem com você pelo app do Estúdio Tarja Preta!\n\n` +
      `Código: ${booking.id}\n` +
      `Data: ${booking.date} às ${booking.time}h\n` +
      `Local: ${booking.bodyPart} (~${booking.sizeCm}cm)\n` +
      `Cliente: ${booking.userName} (${booking.clientPhone})`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 text-black shadow-lg shadow-amber-400/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Agendamento Confirmado!
        </h1>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
          Sua sessão com <strong className="text-amber-500 dark:text-amber-400">{booking.artistName}</strong> foi registrada com sucesso na agenda do Estúdio Tarja Preta.
        </p>
      </div>

      {/* Booking Voucher Card */}
      <div className="rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xl">
        {/* Ticket Header */}
        <div className="bg-neutral-950 p-6 text-white border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-amber-400 flex items-center justify-center font-black text-black text-base">
              TP
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-amber-400 font-extrabold uppercase block">
                COMPROVANTE OFICIAL DE RESERVA
              </span>
              <h2 className="text-lg font-bold text-white">Estúdio Tarja Preta</h2>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-neutral-400 uppercase block">Protocolo</span>
            <span className="text-sm font-extrabold text-amber-400 bg-neutral-900 px-3 py-1 rounded border border-neutral-700">
              {booking.id}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-1">
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                Tatuadora
              </span>
              <span className="text-base font-extrabold text-neutral-900 dark:text-white block">
                {booking.artistName}
              </span>
              <span className="text-xs text-amber-500 dark:text-amber-400">
                {booking.artistSpecialty}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-1">
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                Data & Horário
              </span>
              <span className="text-base font-extrabold text-neutral-900 dark:text-white capitalize block">
                {formattedDate}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400">
                {booking.time}h (Chegar com 15 min de antecedência)
              </span>
            </div>
          </div>

          {/* Technical Tattoo Details */}
          <div className="border-t border-b border-neutral-100 dark:border-neutral-800 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Local Anatômico</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {booking.bodyPart}
              </span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Tamanho Estimado</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mt-0.5">
                <Ruler className="w-3.5 h-3.5 text-amber-500" />
                {booking.sizeCm} centímetros
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-neutral-400 block text-[11px]">Telefone de Contato</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                {booking.clientPhone}
              </span>
            </div>
          </div>

          {/* Reference Images Preview */}
          {booking.referenceImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                Ideias / Referências enviadas:
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {booking.referenceImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 bg-neutral-950"
                  >
                    <img
                      src={img}
                      alt={`Referência ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Studio Guidelines */}
          <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-neutral-700 dark:text-neutral-300 space-y-1.5">
            <div className="font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Orientações Pré-Sessão:
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
              • Hidrate bem a pele nos dias anteriores à sessão. <br />
              • Evite consumo excessivo de álcool 24h antes. <br />
              • Alimente-se bem antes de vir ao estúdio.
            </p>
          </div>
        </div>

        {/* Ticket Footer Actions */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`https://wa.me/${booking.artistWhatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-1/2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notificar {booking.artistName} no WhatsApp</span>
          </a>

          <button
            onClick={onViewMyBookings}
            className="w-full sm:w-1/2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver em Meus Agendamentos</span>
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onBackToArtists}
          className="text-xs text-neutral-500 hover:text-amber-500 dark:text-neutral-400 dark:hover:text-amber-400 font-semibold transition-colors"
        >
          ← Voltar ao início / Ver outras tatuadoras
        </button>
      </div>
    </div>
  );
};
