import { Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Room, AdminSettings } from '../types';
import { getAmenityIcon, cleanAmenityLabel } from './BookingPageView';

interface LandingPageViewProps {
  rooms: Room[];
  adminSettings: AdminSettings;
  setView: (view: string) => void;
  onSelectRoom: (roomId: string) => void;
}

export default function LandingPageView({ rooms, adminSettings, setView, onSelectRoom }: LandingPageViewProps) {
  
  const handleSelectRoom = (roomId: string) => {
    onSelectRoom(roomId);
    setView('booking');
  };

  return (
    <div className="space-y-16 animate-fade-in pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-white border border-outline-alt/45 rounded-[2.5rem] p-8 sm:p-12 md:p-16 overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="bg-secondary/15 text-secondary font-sans font-black text-xs rounded-full uppercase tracking-wider px-3.5 py-1">
              Sublocação Inteligente de Consultórios 🏥
            </span>
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight tracking-tight">
              {adminSettings.heroTitle}
            </h1>
            <p className="font-sans text-brand-variant text-base sm:text-lg leading-relaxed max-w-xl">
              {adminSettings.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setView('booking')}
                className="bg-secondary hover:bg-secondary/95 text-white font-sans font-bold text-sm tracking-wide px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-secondary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reservar um Horário</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('register')}
                className="px-8 py-4 border border-[#a2a6ab] hover:bg-slate-50 text-primary rounded-xl font-sans font-bold text-sm transition-all"
              >
                Cadastrar Perfil Clínico
              </button>
            </div>
          </div>
          
          {/* Right Image Block */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-outline-alt/40 bg-zinc-100 flex items-center justify-center">
            <img
              src={adminSettings.heroImage}
              alt="Consultório elegante sublocaHope"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
      </section>

      {/* 3. NOSSOS CONSULTÓRIOS PRONTOS */}
      <section className="space-y-12" id="salas">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-primary leading-tight tracking-tight">
            {adminSettings.landingRoomsHeading}
          </h2>
          <p className="font-sans text-brand-variant text-sm max-w-2xl mx-auto">
            {adminSettings.landingRoomsSub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.slice(0, 6).map((room) => {
            return (
              <div
                key={room.id}
                className="group bg-white rounded-3xl overflow-hidden border border-outline-alt/35 hover:border-secondary/35 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Room Image */}
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover transition-all"
                      style={room.imageSettings ? {
                        transform: `scale(${(room.imageSettings.zoom || 100) / 100}) rotate(${room.imageSettings.rotate || 0}deg)`,
                        objectPosition: `${room.imageSettings.posX ?? 50}% ${room.imageSettings.posY ?? 50}%`,
                        filter: `brightness(${room.imageSettings.brightness ?? 100}%) contrast(${room.imageSettings.contrast ?? 100}%)`
                      } : undefined}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-secondary border border-secondary/10 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                      <span>{room.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-6 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-wider bg-secondary/10 px-2.5 py-0.5 rounded-md">
                        {room.type === 'executivo_luxo' ? 'Executivo Luxo' : (room.type === 'premium' ? 'Premium' : 'Standard')}
                      </span>
                    </div>
                    <h3 className="font-sans font-extrabold text-lg text-primary leading-snug">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-brand-variant font-medium">
                      {room.features.map((feat, i) => (
                        <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                          {getAmenityIcon(feat, "w-3.5 h-3.5 text-secondary")}
                          <span>{cleanAmenityLabel(feat)}</span>
                          {i < room.features.length - 1 && <span className="text-black/15 ml-1 select-none">•</span>}
                        </span>
                      ))}
                    </div>
                    <p className="font-sans text-xs text-brand-variant line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-outline-alt/15 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-brand-variant font-extrabold uppercase tracking-widest block">Sublocação</span>
                      <p className="font-sans font-black text-xl text-primary">
                        R$ {room.pricePerHour.toFixed(2).replace('.', ',')} <span className="text-xs font-normal text-brand-variant">/h</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectRoom(room.id)}
                      className="bg-secondary hover:bg-secondary/95 text-white font-sans font-bold text-xs tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Reservar Sala ⚡
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SUBSCRIPTION PLANS SECTION */}
      <section className="space-y-12" id="planos">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-extrabold text-secondary tracking-widest block">Condições Especiais</span>
          <h2 className="font-sans font-extrabold text-3xl text-primary tracking-tight">Planos e Pacotes Recorrentes</h2>
          <p className="font-sans text-brand-variant text-sm max-w-xl mx-auto font-medium">Reduza seus custos operacionais de infraestrutura de saúde em até 30% com os pacotes.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-outline-alt/35 hover:border-secondary/20 shadow-xs flex flex-col justify-between space-y-6 text-left transition-all duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-slate-100 text-brand-variant text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{adminSettings.plan1Subtitle}</span>
                <span className="text-xs text-emerald-600 font-bold">Flexibilidade Total</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl text-primary">{adminSettings.plan1Title}</h3>
              <p className="font-sans text-xs text-brand-variant leading-relaxed">{adminSettings.plan1Desc}</p>
              
              <ul className="text-xs text-brand-variant space-y-2 pt-2 grid grid-cols-1 gap-1">
                <li className="flex items-center gap-1.5">✔ Sem compromisso anual</li>
                <li className="flex items-center gap-1.5">✔ Reserva imediata pelo app</li>
                <li className="flex items-center gap-1.5">✔ Wi-Fi de alta velocidade incluso</li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-outline-alt/15 flex items-baseline gap-2">
              <span className="text-xs text-brand-variant">{adminSettings.plan1PriceSuffix}</span>
              <span className="text-3xl font-sans font-black text-primary">R$ {adminSettings.plan1Price}</span>
              <span className="text-sm text-brand-variant font-medium">/ hora</span>
            </div>
          </div>

          {/* Plan 2 */}
          <div className="bg-gradient-to-br from-[#fcfdfd] to-slate-50/50 p-8 sm:p-10 rounded-3xl border-2 border-secondary/25 hover:border-secondary shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden text-left transition-all duration-300">
            <div className="absolute top-0 right-0 bg-secondary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-xs">
              RECOMENDADO ⭐
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-secondary/15 text-secondary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{adminSettings.plan2Subtitle}</span>
                <span className="text-xs text-emerald-600 font-bold">Economize até 30%</span>
              </div>
              <h3 className="font-sans font-extrabold text-2xl text-primary">{adminSettings.plan2Title}</h3>
              <p className="font-sans text-xs text-brand-variant leading-relaxed">{adminSettings.plan2Desc}</p>
              
              <ul className="text-xs text-brand-variant space-y-2 pt-2 grid grid-cols-1 gap-1">
                <li className="flex items-center gap-1.5 text-primary font-medium">✔ Banco de horas mensais flexíveis</li>
                <li className="flex items-center gap-1.5">✔ Suporte prioritário na recepção</li>
                <li className="flex items-center gap-1.5">✔ Isenção total de taxas burocráticas</li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-secondary/15 flex items-baseline gap-2">
              <span className="text-xs text-brand-variant">{adminSettings.plan2PriceSuffix}</span>
              <span className="text-3xl font-sans font-black text-primary">R$ {adminSettings.plan2Price}</span>
              <span className="text-sm text-brand-variant font-medium">/ mês</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY SECTION */}
      {adminSettings.galleryImages && adminSettings.galleryImages.length > 0 && (
        <section className="space-y-8" id="galeria">
          <div className="text-center space-y-2">
            <h2 className="font-sans font-extrabold text-3xl text-primary tracking-tight">Nossa Estrutura</h2>
            <p className="font-sans text-brand-variant text-sm max-w-xl mx-auto">Equipamentos de ponta e infraestrutura requintada para total segurança jurídica e credibilidade.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {adminSettings.galleryImages.map((img, i) => (
              <div key={i} className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-outline-alt/45 shadow-2xs">
                <img
                  src={img}
                  alt={`Estrutura ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
