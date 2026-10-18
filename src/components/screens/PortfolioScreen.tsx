import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Sparkles,
  Maximize2,
  Clock,
  MapPin,
  Instagram,
  CheckCircle2,
} from 'lucide-react';
import { TattooArtist, TattooWork } from '../../types';
import { ImageLightboxModal } from '../ImageLightboxModal';

interface PortfolioScreenProps {
  artist: TattooArtist;
  onBackToArtists: () => void;
  onProceedToSchedule: (artist: TattooArtist, selectedWork?: TattooWork) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  artist,
  onBackToArtists,
  onProceedToSchedule,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLightboxWork, setSelectedLightboxWork] = useState<TattooWork | null>(null);

  const filteredWorks = artist.works.filter((work) => {
    if (activeCategory === 'all') return true;
    return work.category === activeCategory;
  });

  const whatsappMessage = encodeURIComponent(
    `Olá ${artist.name}! Vi suas tatuagens no app do Estúdio Tarja Preta e gostaria de tirar uma dúvida sobre um projeto.`
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation & Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToArtists}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para todas as tatuadoras
        </button>
      </div>

      {/* Artist Profile Header Hero */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-md">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Artist Photo */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/80 shadow-md bg-neutral-950">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-amber-400 font-bold uppercase">
              {artist.experienceYears}a exp
            </div>
          </div>

          {/* Artist Info & Direct Actions */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{artist.specialty}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 dark:text-neutral-400">{artist.startingPrice}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {artist.name}
            </h1>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
              {artist.bio}
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <a
                href={`https://instagram.com`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-500 transition-colors flex items-center gap-1"
              >
                <Instagram className="w-3.5 h-3.5" />
                {artist.instagram}
              </a>
              <span>·</span>
              <span>Agenda: {artist.timeSlots.length} horários/dia</span>
            </div>

            {/* MANDATORY BUTTONS: Booking Button + WhatsApp Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              {/* Button to Schedule with this professional */}
              <button
                onClick={() => onProceedToSchedule(artist)}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Tatuagem com {artist.name.split(' ')[0]}</span>
              </button>

              {/* Professional's Direct WhatsApp Button */}
              <a
                href={`https://wa.me/${artist.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5 border border-neutral-700 hover:border-emerald-500"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {artist.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Trabalhos & Tatuagens Realizadas</span>
            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
              ({filteredWorks.length} fotos)
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Clique em qualquer imagem para ampliar e conferir detalhes da técnica.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Todas as Obras' },
            { id: 'blackwork', label: 'Blackwork' },
            { id: 'fineline', label: 'Fineline' },
            { id: 'oriental', label: 'Oriental' },
            { id: 'flash', label: 'Flashes Autorais' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-black shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tattoo Photos Grid (Responsive 2 to 3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work) => (
          <div
            key={work.id}
            onClick={() => setSelectedLightboxWork(work)}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-400/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Work Photo */}
            <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
              <img
                src={work.imageUrl}
                alt={work.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 rounded-full bg-amber-400 text-black shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-5 h-5" />
                </span>
              </div>

              {/* Style Tag on photo */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-amber-400 border border-amber-400/30 text-[10px] font-bold uppercase rounded">
                  {work.style}
                </span>
              </div>
            </div>

            {/* Work Info */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                {work.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  {work.bodyPart}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {work.estimatedHours}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProceedToSchedule(artist, work);
                  }}
                  className="w-full py-2 px-3 bg-amber-400/10 hover:bg-amber-400 text-amber-600 hover:text-black dark:text-amber-400 dark:hover:text-black text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar com este estilo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sticky-friendly CTA for mobile */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">
            Gostou dos trabalhos da {artist.name}?
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            A agenda é disputada. Garanta seu dia e horário diretamente no sistema.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={`https://wa.me/${artist.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-neutral-700"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </a>

          <button
            onClick={() => onProceedToSchedule(artist)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Agenda</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        work={selectedLightboxWork}
        artist={artist}
        onClose={() => setSelectedLightboxWork(null)}
        onSelectForBooking={(work) => onProceedToSchedule(artist, work)}
      />
    </div>
  );
};
