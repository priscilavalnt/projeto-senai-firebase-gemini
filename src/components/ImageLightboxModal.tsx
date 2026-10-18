import React from 'react';
import { X, Clock, MapPin, Sparkles, MessageCircle } from 'lucide-react';
import { TattooWork, TattooArtist } from '../types';

interface ImageLightboxModalProps {
  work: TattooWork | null;
  artist?: TattooArtist | null;
  onClose: () => void;
  onSelectForBooking?: (work: TattooWork) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  work,
  artist,
  onClose,
  onSelectForBooking,
}) => {
  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-neutral-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors border border-neutral-700"
          aria-label="Fechar visualizador"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Work Image */}
        <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[480px]">
          <img
            src={work.imageUrl}
            alt={work.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>

        {/* Work Details */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between bg-neutral-900">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{work.style}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
              {work.title}
            </h3>

            <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
              {work.description}
            </p>

            <div className="space-y-3 border-t border-neutral-800 pt-4 text-xs text-neutral-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Local anatômico:
                </span>
                <span className="font-medium text-neutral-200">{work.bodyPart}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Tempo estimado:
                </span>
                <span className="font-medium text-neutral-200">{work.estimatedHours}</span>
              </div>
              {artist && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Tatuadora:</span>
                  <span className="font-medium text-amber-300">{artist.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
            {onSelectForBooking && (
              <button
                onClick={() => {
                  onSelectForBooking(work);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Quero agendar algo similar
              </button>
            )}

            {artist && (
              <a
                href={`https://wa.me/${artist.whatsapp}?text=${encodeURIComponent(
                  `Olá ${artist.name}! Vi a tatuagem "${work.title}" no app do Estúdio Tarja Preta e gostaria de tirar uma dúvida.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-neutral-700 hover:border-neutral-600"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Falar no WhatsApp da Artista
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
