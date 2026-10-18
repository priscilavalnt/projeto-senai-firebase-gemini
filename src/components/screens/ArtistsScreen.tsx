import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, Shield, Award, Instagram, MessageCircle } from 'lucide-react';
import { TattooArtist } from '../../types';
import { TATTOO_ARTISTS, studioHeroImg } from '../../data/studioData';

interface ArtistsScreenProps {
  onSelectArtist: (artist: TattooArtist) => void;
  onDirectBooking: (artist: TattooArtist) => void;
}

export const ArtistsScreen: React.FC<ArtistsScreenProps> = ({
  onSelectArtist,
  onDirectBooking,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredArtists = TATTOO_ARTISTS.filter((artist) => {
    if (filter === 'all') return true;
    if (filter === 'blackwork') return artist.specialty.toLowerCase().includes('blackwork');
    if (filter === 'fineline') return artist.specialty.toLowerCase().includes('fineline');
    if (filter === 'oriental') return artist.specialty.toLowerCase().includes('oriental');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Studio Banner / Editorial Kicker */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 text-white p-6 sm:p-10 shadow-lg">
        <img
          src={studioHeroImg}
          alt="Estúdio Tarja Preta"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded">
            <Sparkles className="w-3.5 h-3.5" />
            Equipe Autoral de Tatuadoras
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Nossas Artistas <span className="text-amber-400">Residentes</span>
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Selecione uma tatuadora abaixo para explorar suas fotos de trabalhos exclusivos, estilos de traço, agenda aberta e canais de contato.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Biossegurança Hospitalar
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Materiais 100% Veganos
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Tatuadoras Disponíveis
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Clique na foto da profissional para ver a galeria completa de tatuagens.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'blackwork', label: 'Blackwork' },
            { id: 'fineline', label: 'Fineline' },
            { id: 'oriental', label: 'Neo-Oriental' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Artist Cards Grid (3 in a row on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/60 dark:hover:border-amber-400/60 transition-all flex flex-col justify-between"
          >
            {/* Clickable Image Section */}
            <div>
              <div
                onClick={() => onSelectArtist(artist)}
                className="relative aspect-square w-full bg-neutral-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Badge on Image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-amber-400 border border-amber-400/40 text-[11px] font-bold rounded uppercase tracking-wider">
                    {artist.experienceYears} anos de estrada
                  </span>
                </div>

                {/* Click hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="px-4 py-2 bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-lg shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                    Ver Portfólio ({artist.works.length} fotos)
                  </span>
                </div>

                {/* Name on bottom of photo */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                    {artist.role}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                    {artist.name}
                  </h3>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-5 space-y-3">
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{artist.specialty}</span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {artist.bio}
                </p>

                {/* Mini Work Previews (3 thumbnails) */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-2">
                    Amostras de Trabalhos:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {artist.works.slice(0, 3).map((work) => (
                      <div
                        key={work.id}
                        onClick={() => onSelectArtist(artist)}
                        className="aspect-square rounded-lg overflow-hidden bg-neutral-950 cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 transition-colors"
                      >
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 mt-2 space-y-2">
              <button
                onClick={() => onSelectArtist(artist)}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Ver Portfólio & Fotos</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onDirectBooking(artist)}
                  className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar</span>
                </button>

                <a
                  href={`https://wa.me/${artist.whatsapp}?text=${encodeURIComponent(
                    `Olá ${artist.name}! Gostaria de informações sobre agendamento no Estúdio Tarja Preta.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
