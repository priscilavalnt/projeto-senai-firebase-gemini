import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Upload,
  X,
  Phone,
  Ruler,
  MapPin,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { TattooArtist, TattooWork, User, Booking } from '../../types';
import { BODY_PARTS, SUGGESTED_REFERENCES } from '../../data/studioData';

interface BookingDetailsScreenProps {
  artist: TattooArtist;
  date: string;
  time: string;
  currentUser: User;
  initialWork?: TattooWork | null;
  onBackToSchedule: () => void;
  onBookingSubmitted: (booking: Booking) => void;
}

export const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  artist,
  date,
  time,
  currentUser,
  initialWork,
  onBackToSchedule,
  onBookingSubmitted,
}) => {
  // Form State with all required fields
  const [sizeCm, setSizeCm] = useState<number>(12);
  const [bodyPart, setBodyPart] = useState<string>('');
  const [customBodyPart, setCustomBodyPart] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<string[]>(() => {
    return initialWork ? [initialWork.imageUrl] : [];
  });
  const [phone, setPhone] = useState<string>(currentUser.phone || '');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Phone mask helper
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 0) {
      formatted = `(${raw.slice(0, 2)}`;
      if (raw.length > 2) {
        formatted += `) ${raw.slice(2, 7)}`;
      }
      if (raw.length > 7) {
        formatted += `-${raw.slice(7, 11)}`;
      }
    }
    setPhone(formatted);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, envie apenas arquivos de imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReferenceImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSuggestedImage = (url: string) => {
    if (!referenceImages.includes(url)) {
      setReferenceImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // 1. Tamanho em cm (obrigatório)
    if (!sizeCm || sizeCm < 2) {
      newErrors.sizeCm = 'Informe o tamanho aproximado da tatuagem (mínimo 2 cm).';
    }

    // 2. Local do corpo (obrigatório)
    const finalBodyPart = bodyPart === 'Outro local do corpo' ? customBodyPart.trim() : bodyPart;
    if (!finalBodyPart) {
      newErrors.bodyPart = 'Selecione ou especifique o local do corpo para a tatuagem.';
    }

    // 3. Imagens de ideias (obrigatório)
    if (referenceImages.length === 0) {
      newErrors.referenceImages =
        'É obrigatório anexar ao menos 1 imagem de referência ou ideia da tatuagem.';
    }

    // 4. Número para contato (obrigatório)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone =
        'Informe um número de contato / WhatsApp válido com DDD (mínimo 10 dígitos).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking: Booking = {
        id: `TP-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        artistId: artist.id,
        artistName: artist.name,
        artistSpecialty: artist.specialty,
        artistWhatsapp: artist.whatsapp,
        date,
        time,
        sizeCm,
        bodyPart: finalBodyPart,
        referenceImages,
        clientPhone: phone,
        notes: notes.trim() || undefined,
        status: 'confirmado',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existing = localStorage.getItem('tarja_preta_bookings');
      const allBookings: Booking[] = existing ? JSON.parse(existing) : [];
      allBookings.push(newBooking);
      localStorage.setItem('tarja_preta_bookings', JSON.stringify(allBookings));

      setIsSubmitting(false);
      onBookingSubmitted(newBooking);
    }, 600);
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSchedule}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para escolha de horário
        </button>

        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
          Etapa 2 de 2: Informações Obrigatórias
        </span>
      </div>

      {/* Booking Header Recap Card */}
      <div className="p-5 rounded-2xl border border-amber-400/30 bg-amber-500/5 dark:bg-amber-400/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-neutral-950">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 block">
              Agendamento em andamento
            </span>
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
              Sessão com {artist.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              <span className="capitalize font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {formattedDate}
              </span>
              <span>·</span>
              <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {time}h
              </span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="px-3 py-1 bg-amber-400 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-md">
            Horário Pré-selecionado
          </span>
        </div>
      </div>

      {/* Mandatory Information Form */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Detalhes da sua Tatuagem
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Preencha todos os campos obrigatórios abaixo para que a artista avalie a complexidade e prepare os materiais da sessão.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FIELD 1: Tamanho em cm (OBRIGATÓRIO) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-500" />
                <span>1. Tamanho da Tatuagem (em cm) *</span>
              </label>
              <span className="text-sm font-extrabold font-mono text-amber-500 dark:text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded">
                {sizeCm} cm
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
              <input
                type="range"
                min="3"
                max="35"
                step="1"
                value={sizeCm}
                onChange={(e) => setSizeCm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                <span>3 cm (Mini / Micro)</span>
                <span>12 cm (Médio)</span>
                <span>20 cm (Grande)</span>
                <span>35+ cm (Fechamento)</span>
              </div>
            </div>
            {errors.sizeCm && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.sizeCm}
              </p>
            )}
          </div>

          {/* FIELD 2: Local do corpo (OBRIGATÓRIO) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>2. Local do Corpo *</span>
            </label>

            <select
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              required
            >
              <option value="">Selecione o local onde a tattoo será feita...</option>
              {BODY_PARTS.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>

            {bodyPart === 'Outro local do corpo' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customBodyPart}
                  onChange={(e) => setCustomBodyPart(e.target.value)}
                  placeholder="Especifique o local exato do corpo..."
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            )}

            {errors.bodyPart && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.bodyPart}
              </p>
            )}
          </div>

          {/* FIELD 3: Imagens de ideias / referências (OBRIGATÓRIO) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>3. Imagens de Ideias / Referências *</span>
              </label>
              <span className="text-[11px] text-neutral-400">
                {referenceImages.length} imagem(ns) anexada(s)
              </span>
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col items-center justify-center gap-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="p-3 rounded-full bg-amber-400/10 text-amber-500 dark:text-amber-400">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Clique para enviar fotos de referências do seu dispositivo
              </div>
              <div className="text-[11px] text-neutral-400">
                PNG, JPG ou WEBP (fotos salvas no celular ou inspirações)
              </div>
            </div>

            {/* Quick Suggestions from Studio */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
                Ou adicione uma referência rápida do estúdio:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_REFERENCES.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSuggestedImage(sug.url)}
                    className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-400/20 text-neutral-700 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5"
                  >
                    <span>+ {sug.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview of Attached Images */}
            {referenceImages.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Referências Carregadas ({referenceImages.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {referenceImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-950 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Referência ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white transition-colors"
                        title="Remover imagem"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.referenceImages && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.referenceImages}
              </p>
            )}
          </div>

          {/* FIELD 4: Número de contato / WhatsApp (OBRIGATÓRIO) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-500" />
              <span>4. Número de Contato / WhatsApp *</span>
            </label>

            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className="w-full pl-4 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              A tatuadora entrará em contato via WhatsApp para alinhar o desenho antes da sessão.
            </p>
            {errors.phone && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Additional Notes (Opcional) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Observações ou História da Ideia (Opcional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Gostaria de traços bem finos na parte superior e preenchimento sólido embaixo. É minha primeira tatuagem..."
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirmando Agendamento...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar e Confirmar Agendamento</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-neutral-400 mt-2">
              Ao confirmar, seu horário será garantido na agenda oficial do Estúdio Tarja Preta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
