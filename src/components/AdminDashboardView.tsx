import { useState, useRef, FormEvent } from 'react';
import { 
  Key, Database, FileEdit, LayoutDashboard, Search, Calendar, CreditCard, 
  Settings, CheckCircle, TrendingUp, Sparkles, Upload, Eye, Trash2, ShieldCheck, RefreshCw,
  Plus, Coffee, Music, Wind, Gamepad, MapPin, Users, Bath, Sofa, Check, X, ShieldAlert, User, Phone, FileText,
  Smartphone, QrCode, Apple, Star
} from 'lucide-react';
import { Booking, AdminSettings, Room, ProfessionalProfile } from '../types';
import EditorView from './EditorView';

export const AMENITIES_LIST = [
  { label: 'Wi-Fi', emoji: '📶' },
  { label: 'Café', emoji: '☕' },
  { label: 'Estacionamento', emoji: '🚗' },
  { label: 'Banheiro', emoji: '🚻' },
  { label: 'Climatizado', emoji: '❄️' },
  { label: 'Acústico', emoji: '🔇' },
  { label: 'Recepção', emoji: '🛎️' },
  { label: 'Espaço Infantil', emoji: '🧸' },
  { label: 'Videoconferência', emoji: '📹' },
  { label: 'Elevador', emoji: '🛗' }
];

interface AdminDashboardProps {
  adminSettings: AdminSettings;
  bookings: Booking[];
  rooms: Room[];
  onUpdateSettings: (settings: AdminSettings) => void;
  onCancelBooking: (bookingId: string) => void;
  onUpdateRooms: (rooms: Room[]) => void;
  registeredUsers: ProfessionalProfile[];
  onUpdateUsers: (users: ProfessionalProfile[]) => void;
  setView: (view: string) => void;
}

export default function AdminDashboardView({
  adminSettings,
  bookings,
  rooms,
  onUpdateSettings,
  onCancelBooking,
  onUpdateRooms,
  registeredUsers,
  onUpdateUsers,
  setView
}: AdminDashboardProps) {
  // Local state for forms
  const [adminTab, setAdminTab] = useState<'dashboard' | 'editor'>('dashboard');
  const [appScriptId, setAppScriptId] = useState(adminSettings.appScriptId);
  const [publicKey, setPublicKey] = useState(adminSettings.publicKey);
  const [webhookSecret, setWebhookSecret] = useState(adminSettings.webhookSecret);
  const [isProductionMode, setIsProductionMode] = useState(adminSettings.isProductionMode);
  
  const [standardPrice, setStandardPrice] = useState(adminSettings.tableOfPrices.standard);
  const [premiumPrice, setPremiumPrice] = useState(adminSettings.tableOfPrices.premium);
  const [auditoriumPrice, setAuditoriumPrice] = useState(adminSettings.tableOfPrices.auditorium);
  const [executivoLuxoPrice, setExecutivoLuxoPrice] = useState(adminSettings.tableOfPrices.executivo_luxo);

  const [heroTitle, setHeroTitle] = useState(adminSettings.heroTitle);
  const [heroDescription, setHeroDescription] = useState(adminSettings.heroDescription);

  // New customizable copy states
  const [heroImage, setHeroImage] = useState(adminSettings.heroImage || '');
  const [landingRoomsHeading, setLandingRoomsHeading] = useState(adminSettings.landingRoomsHeading || '');
  const [landingRoomsSub, setLandingRoomsSub] = useState(adminSettings.landingRoomsSub || '');
  const [bookingRoomsHeading, setBookingRoomsHeading] = useState(adminSettings.bookingRoomsHeading || '');
  const [trustTitle, setTrustTitle] = useState(adminSettings.trustTitle || '');
  const [trustDesc, setTrustDesc] = useState(adminSettings.trustDesc || '');
  const [plan1Title, setPlan1Title] = useState(adminSettings.plan1Title || '');
  const [plan1Subtitle, setPlan1Subtitle] = useState(adminSettings.plan1Subtitle || '');
  const [plan1Desc, setPlan1Desc] = useState(adminSettings.plan1Desc || '');
  const [plan1PriceSuffix, setPlan1PriceSuffix] = useState(adminSettings.plan1PriceSuffix || '');
  const [plan1Price, setPlan1Price] = useState(adminSettings.plan1Price || '');
  const [plan2Title, setPlan2Title] = useState(adminSettings.plan2Title || '');
  const [plan2Subtitle, setPlan2Subtitle] = useState(adminSettings.plan2Subtitle || '');
  const [plan2Desc, setPlan2Desc] = useState(adminSettings.plan2Desc || '');
  const [plan2PriceSuffix, setPlan2PriceSuffix] = useState(adminSettings.plan2PriceSuffix || '');
  const [plan2Price, setPlan2Price] = useState(adminSettings.plan2Price || '');

  const [gallery, setGallery] = useState<string[]>(adminSettings.galleryImages);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Room edit states
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editRoomNameOnly, setEditRoomNameOnly] = useState('');
  const [editRoomLocation, setEditRoomLocation] = useState('');
  const [editRoomDescription, setEditRoomDescription] = useState('');
  const [editRoomType, setEditRoomType] = useState<'standard' | 'premium' | 'auditorium' | 'executivo_luxo'>('standard');
  const [editRoomImage0, setEditRoomImage0] = useState('');
  const [editRoomImage1, setEditRoomImage1] = useState('');
  const [editRoomImage2, setEditRoomImage2] = useState('');
  
  const [editRoomFeatures, setEditRoomFeatures] = useState<string[]>([]);

  // Room creation states
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'standard' | 'premium' | 'auditorium' | 'executivo_luxo'>('standard');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomLocation, setNewRoomLocation] = useState('Av. Barão do Rio Branco, 150 - Centro, Palhoça - SC');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  // Default image preset is the first one
  const [newRoomImage, setNewRoomImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAoW3_3-lK3ixFkeSUuv13KklvQeADvFsiWG-M2JXqkPo3zc351XK-v-QY5B6WZhMFYcdux00x9OQx8JQ3t81CRSw19hEzWMubmMom5eMM-9Jwz14jeGfJBQe8fV4f5h3ioRQdGt2JHH92cElgmq9VuAOcTw7-9w7x1_cltDMQPUqRRNV5kEMi9GPzjkXYtGddkTSaSfaEtayWZ4p31vYarH7bg2go2QjYVqVzV4JvlyzqGLQH-dZynak73vV5-YBhcm0oWpMxUf0w');
  
  // Amenities selection list state (newRoom)
  const [newRoomFeatures, setNewRoomFeatures] = useState<string[]>(['📶 Wi-Fi', '☕ Café', '❄️ Climatizado']);

  // File upload simulated trigger
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      alert('Por favor, informe o nome do consultório.');
      return;
    }
    if (!newRoomNumber.trim()) {
      alert('Por favor, informe o número do consultório (Ex: Consultório 102).');
      return;
    }
    if (!newRoomLocation.trim()) {
      alert('Por favor, informe o endereço da sala.');
      return;
    }
    if (!newRoomDescription.trim()) {
      alert('Por favor, descreva brevemente a sala.');
      return;
    }

    const price = adminSettings.tableOfPrices[newRoomType];
    const features = newRoomFeatures;

    const newId = `room-${Date.now()}`;
    const formattedName = `${newRoomName} - ${newRoomNumber}`;

    const newRoom: Room = {
      id: newId,
      name: formattedName,
      type: newRoomType,
      pricePerHour: price,
      rating: 5.0,
      size: 'Arredores de Palhoça',
      capacity: 'Recomendado para clínica',
      location: newRoomLocation,
      description: newRoomDescription,
      images: [
        newRoomImage,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAoW3_3-lK3ixFkeSUuv13KklvQeADvFsiWG-M2JXqkPo3zc351XK-v-QY5B6WZhMFYcdux00x9OQx8JQ3t81CRSw19hEzWMubmMom5eMM-9Jwz14jeGfJBQe8fV4f5h3ioRQdGt2JHH92cElgmq9VuAOcTw7-9w7x1_cltDMQPUqRRNV5kEMi9GPzjkXYtGddkTSaSfaEtayWZ4p31vYarH7bg2go2QjYVqVzV4JvlyzqGLQH-dZynak73vV5-YBhcm0oWpMxUf0w',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBEA5kcWz6rbF7fVL_dVyf4kNliZh8hHnoTBjUNP-IqEaUPjRkWwbmMiVLt0-qmPlAPb3WEBZnuKKxtPPdeGGyuE_itqi6_ADsV6lfhB-fI-90aTCt_Kyju8NQXl4klyixYzoi2wZ9JjTPioHfHvMoc5a5FtygotQs05VASNttBMqHVm6ehI5O4Z4R2xHI1I4FcB8tiWzzVTW8agz70qJ57GdPnq75ElzCPEckGi-yYNWCFvqxTKKYq9S-f0Srazuq69vYW1Xa02jA'
      ],
      features
    };

    onUpdateRooms([...rooms, newRoom]);
    triggerToast('Sala cadastrada com sucesso! Disponível para locação agora.');

    // Reset fields
    setNewRoomName('');
    setNewRoomNumber('');
    setNewRoomDescription('');
    setNewRoomFeatures(['📶 Wi-Fi', '☕ Café', '❄️ Climatizado']);
    setIsAddingRoom(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Deseja realmente excluir esta sala do catálogo de locações?')) {
      const updatedRooms = rooms.filter(r => r.id !== roomId);
      onUpdateRooms(updatedRooms);
      triggerToast('Sala removida com sucesso de Palhoça.');
    }
  };

  // 1. Google Appscript save
  const handleSaveAppScript = () => {
    onUpdateSettings({
      ...adminSettings,
      appScriptId
    });
    triggerToast('Configuração de sincronização AppScript salva!');
  };

  // 2. Gateway setup save
  const handleSaveGateway = () => {
    onUpdateSettings({
      ...adminSettings,
      publicKey,
      webhookSecret,
      isProductionMode
    });
    triggerToast('Gateway de pagamento atualizado com sucesso!');
  };

  // Toggle production toggle
  const toggleProdMode = () => {
    setIsProductionMode(!isProductionMode);
  };

  // 3. Save Price settings or Hero texts
  const handlePublishChanges = () => {
    onUpdateSettings({
      ...adminSettings,
      tableOfPrices: {
        standard: standardPrice,
        premium: premiumPrice,
        auditorium: auditoriumPrice,
        executivo_luxo: executivoLuxoPrice
      },
      heroTitle,
      heroDescription,
      galleryImages: gallery,
      heroImage,
      landingRoomsHeading,
      landingRoomsSub,
      bookingRoomsHeading,
      trustTitle,
      trustDesc,
      plan1Title,
      plan1Subtitle,
      plan1Desc,
      plan1PriceSuffix,
      plan1Price,
      plan2Title,
      plan2Subtitle,
      plan2Desc,
      plan2PriceSuffix,
      plan2Price
    });
    triggerToast('Alterações de texto, preço e imagem publicadas no site com sucesso!');
  };

  const handleSelectRoomForEditing = (room: Room) => {
    setEditingRoom(room);
    setEditRoomNameOnly(room.name);
    setEditRoomLocation(room.location);
    setEditRoomDescription(room.description);
    setEditRoomType(room.type);
    setEditRoomImage0(room.images[0] || '');
    setEditRoomImage1(room.images[1] || '');
    setEditRoomImage2(room.images[2] || '');
    
    // Set amenities
    setEditRoomFeatures(room.features || []);

    setTimeout(() => {
      document.getElementById('edit-room-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSaveEditedRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const features = editRoomFeatures;

    const updatedRooms = rooms.map(r => {
      if (r.id === editingRoom.id) {
        return {
          ...r,
          name: editRoomNameOnly,
          type: editRoomType,
          location: editRoomLocation,
          description: editRoomDescription,
          images: [editRoomImage0, editRoomImage1, editRoomImage2].filter(Boolean),
          features
        };
      }
      return r;
    });

    onUpdateRooms(updatedRooms);
    setEditingRoom(null);
    triggerToast('Os dados e fotografias do consultório foram editados com sucesso!');
  };

  // Mock add gallery image
  const handleAddMockImage = () => {
    // Generate a random high resolution medical clean interior image or ask simple URL input
    const newImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpK_ydxVzclnmYMUAi0fsi4DzKI6JXpLmaD9G4jAA8rUDn6AyhwunUa4UddC_1JNYOekP_W2E3pKLnY14-QXm8nN9PhbUkw2T4tMo4n__v_aOuyEIuudaAeqR3IjtbOc3sKmovzJxlZF0_oLpSFqedv8UtqQPeoiR0TfKXgeDNA54dq6ZO_jVXIxUrPJbJnuDZXE8mtKjhRPaiyRxL1eG9phYCM4C3JrjDNRuBP1ov_16x1MXzql6-d_L4wU6RMKkt6WcTJNBkYDQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEA5kcWz6rbF7fVL_dVyf4kNliZh8hHnoTBjUNP-IqEaUPjRkWwbmMiVLt0-qmPlAPb3WEBZnuKKxtPPdeGGyuE_itqi6_ADsV6lfhB-fI-90aTCt_Kyju8NQXl4klyixYzoi2wZ9JjTPioHfHvMoc5a5FtygotQs05VASNttBMqHVm6ehI5O4Z4R2xHI1I4FcB8tiWzzVTW8agz70qJ57GdPnq75ElzCPEckGi-yYNWCFvqxTKKYq9S-f0Srazuq69vYW1Xa02jA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoW3_3-lK3ixFkeSUuv13KklvQeADvFsiWG-M2JXqkPo3zc351XK-v-QY5B6WZhMFYcdux00x9OQx8JQ3t81CRSw19hEzWMubmMom5eMM-9Jwz14jeGfJBQe8fV4f5h3ioRQdGt2JHH92cElgmq9VuAOcTw7-9w7x1_cltDMQPUqRRNV5kEMi9GPzjkXYtGddkTSaSfaEtayWZ4p31vYarH7bg2go2QjYVqVzV4JvlyzqGLQH-dZynak73vV5-YBhcm0oWpMxUf0w'
    ];
    // Prompt to enter any image URL, we can supply a default placeholder nice clinic picture
    const url = prompt('Cole a URL de uma imagem ou clique OK para usar uma imagem padrão de consultório:', newImages[Math.floor(Math.random() * newImages.length)]);
    if (url) {
      setGallery([...gallery, url]);
      triggerToast('Imagem de portfólio adicionada com sucesso!');
    }
  };

  // Compute stats including dynamic items booked
  const activeBookings = bookings.filter(b => b.status === 'Confirmado');
  const sessionSpentSum = activeBookings
    .filter(b => b.id.startsWith('book-')) // Only user added ones
    .reduce((acc, curr) => acc + curr.totalValue, 0);

  const finalRevenue = adminSettings.revenueTotalMonth + sessionSpentSum;
  const finalNewBookings = adminSettings.newBookingsCount + activeBookings.filter(b => b.id.startsWith('book-')).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12 animate-fade-in relative">
      
      {/* Visual Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 bg-primary text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce duration-200">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          <span className="font-sans font-semibold text-xs leading-none">{toastMessage}</span>
        </div>
      )}

      {/* Side Navigation Drawer (Left Column in Screen 2) */}
      <aside className="lg:col-span-1 bg-white border border-outline-alt/40 p-6 rounded-3xl space-y-8 flex flex-col justify-between shadow-sm h-fit sticky top-24">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-outline-alt/20">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-sans font-black text-primary text-base">Practitioner Portal</h2>
          </div>

          {/* Practitioner Brief info from Screen 2 */}
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-alt/20">
            <div className="w-11 h-11 rounded-full bg-slate-300 overflow-hidden border border-primary/20 flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbK8t2MXcuciTeSFdpZrvoudmGLI2aWWKTHsUBGmLIisjwi8bZmKUb4GMCgLy58EDLq-Ic1Xtd457pWxBK-N6dP55R5bb9r2ehTy2t1kX6pEViqQ3Cl0HrAgBRla5fgbbjJ5D-YBfwaYoqJJ950dGz3j_sPgVqq3Lkxnh1GdZoffRJD5wXX9krvDqNQfrEKkFEj3-cVL0WesZKYsNqQGFLClaC2zW6Zvzv3DLN-lJEn3gnN23bJjDO8pwQuFZ20zsAxAIa_CdKqwY"
                alt="Admin Global Portrait"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <p className="font-sans font-bold text-primary text-xs truncate">Admin Global</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-brand-variant">Clínica Hope</p>
            </div>
          </div>

          {/* Navigation Items (Highlights of active panel in Screen 2) */}
          <nav className="flex flex-col gap-1.5 font-sans text-xs">
            <button 
              onClick={() => setAdminTab('dashboard')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-left transition-all cursor-pointer ${
                adminTab === 'dashboard'
                  ? 'bg-secondary/15 text-secondary'
                  : 'text-primary hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel de Controle</span>
            </button>
            
            <button 
              onClick={() => setAdminTab('editor')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-left transition-all cursor-pointer ${
                adminTab === 'editor'
                  ? 'bg-secondary/15 text-secondary'
                  : 'text-primary hover:bg-slate-50'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Editor da Landing Page</span>
            </button>
          </nav>
        </div>

        <div className="text-[9px] font-bold text-brand-variant uppercase tracking-wider text-center border-t border-outline-alt/25 pt-4">
          v1.4.2 · sublocaHope Inc.
        </div>
      </aside>

      {/* Main Content (Right Columns - 3 cols) */}
      <div className="lg:col-span-3 space-y-8">
        {adminTab === 'editor' ? (
          <EditorView
            adminSettings={adminSettings}
            rooms={rooms}
            onUpdateSettings={onUpdateSettings}
            setView={setView}
          />
        ) : (
          <>
            {/* Bento Grid Stats Box (Top items in Screen 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-alt/40 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-gradient-to-r from-white to-brand-bg/10">
            <div>
              <p className="text-brand-variant font-sans font-semibold text-xs uppercase tracking-wider">
                Receita Total (Mês)
              </p>
              <h3 className="font-sans font-black text-3xl text-primary mt-2">
                R$ {finalRevenue.toFixed(2).replace('.', ',')}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-secondary text-xs font-bold pt-2 border-t border-outline-alt/10">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% em relação ao mês anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-alt/40 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-brand-variant font-sans font-semibold text-xs uppercase tracking-wider">
                Novos Agendamentos
              </p>
              <h3 className="font-sans font-black text-3xl text-primary mt-2">
                {finalNewBookings}
              </h3>
            </div>
            <p className="text-[10px] text-brand-variant font-bold uppercase tracking-wider border-t border-outline-alt/10 pt-2">
              8 aguardando aprovação remota
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-alt/40 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-brand-variant font-sans font-semibold text-xs uppercase tracking-wider font-bold">
                Taxa de Ocupação
              </p>
              <h3 className="font-sans font-black text-3xl text-primary mt-2">
                {adminSettings.occupancyRate}%
              </h3>
            </div>
            <div className="w-full bg-outline-alt/30 h-2 rounded-full overflow-hidden mt-1 mt-auto">
              <div 
                className="bg-secondary h-full rounded-full transition-all duration-1000"
                style={{ width: `${adminSettings.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Core Administrative Forms Grid (Split 2 Columns) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Card 1: Agenda Integration (AppScript configuration setup in Screen 2) */}
          <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/15 text-secondary p-3 rounded-xl">
                <Database className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="font-sans font-extrabold text-[#111c2c] text-lg leading-tight">
                Integração de Agenda
              </h4>
            </div>
            
            <p className="font-sans text-brand-variant text-xs sm:text-sm leading-relaxed">
              Vincule o ID do seu Google AppScript para sincronizar disponibilidades de consultório em tempo real com o calendário dos profissionais de saúde.
            </p>

            <div className="space-y-2">
              <label htmlFor="app-script-id-field" className="block text-xs uppercase font-extrabold tracking-wider text-brand-variant">
                ID do AppScript Deployment
              </label>
              <input
                id="app-script-id-field"
                type="text"
                value={appScriptId}
                onChange={(e) => setAppScriptId(e.target.value)}
                placeholder="Ex. AKfycbz3W8a2oN3s_OrsOv7..."
                className="w-full px-4 py-3 rounded-xl border border-outline-alt/60 bg-brand-bg font-mono text-xs focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAppScript}
                className="bg-secondary hover:bg-secondary/95 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Salvar Configuração
              </button>
            </div>
          </div>

          {/* Card 2: Payment Gateway configuration setup in Screen 2 */}
          <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/15 text-secondary p-3 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-extrabold text-[#111c2c] text-lg leading-tight">
                Gateway de Pagamento
              </h4>
            </div>

            <p className="font-sans text-brand-variant text-xs sm:text-sm leading-relaxed">
              Configure suas chaves credenciadas Stripe / ASAAS de produção e webhook de recebimento automático para validação de pix de locação.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-variant">
                  Chave Pública (Live)
                </label>
                <input
                  type="password"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-brand-bg font-sans text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-variant">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-brand-bg font-sans text-xs focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Toggle bar identical to Screen 2 markup style */}
            <div className="flex justify-between items-center bg-brand-bg p-3.5 rounded-xl border border-outline-alt/20">
              <span className="font-sans text-xs font-semibold text-primary">Modo de Produção Ativo</span>
              <button 
                onClick={toggleProdMode}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none cursor-pointer ${
                  isProductionMode ? 'bg-secondary' : 'bg-[#bfc8c9]'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isProductionMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveGateway}
                className="bg-secondary hover:bg-secondary/95 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Atualizar Gateway
              </button>
            </div>
          </div>

        </div>

        {/* Content Management Segment (Matches Item 3 bottom spanning section in Screen 2) */}
        <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-outline-alt/20 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/15 text-secondary p-3 rounded-xl">
                <FileEdit className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-extrabold text-[#111c2c] text-lg leading-none">
                Gerenciamento de Conteúdo
              </h4>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('home')}
                className="text-primary font-sans font-bold text-xs px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                <span>Visualizar Site</span>
              </button>
              <button 
                onClick={handlePublishChanges}
                className="bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs px-5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Publicar Alterações
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Price Table Adjuster Column */}
            <div className="space-y-4">
              <h5 className="font-sans font-black text-xs uppercase tracking-wider text-primary">
                Tabela de Preços (Hora)
              </h5>

              <div className="space-y-3 font-sans text-xs text-brand-text">
                <div className="flex items-center justify-between p-3 border border-[#c2c7cf] rounded-xl bg-brand-bg">
                  <span className="font-medium text-brand-variant">Sala Standard / Hora</span>
                  <div className="flex items-center font-bold">
                    <span className="text-secondary mr-1">R$</span>
                    <input
                      type="number"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(Number(e.target.value))}
                      className="w-14 text-right bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-sans font-extrabold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-[#c2c7cf] rounded-xl bg-brand-bg">
                  <span className="font-medium text-brand-variant">Sala Premium / Hora</span>
                  <div className="flex items-center font-bold">
                    <span className="text-secondary mr-1">R$</span>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(Number(e.target.value))}
                      className="w-14 text-right bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-sans font-extrabold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-[#c2c7cf] rounded-xl bg-brand-bg">
                  <span className="font-medium text-brand-variant">Consultório Executivo / Hora</span>
                  <div className="flex items-center font-bold">
                    <span className="text-secondary mr-1">R$</span>
                    <input
                      type="number"
                      value={executivoLuxoPrice}
                      onChange={(e) => setExecutivoLuxoPrice(Number(e.target.value))}
                      className="w-14 text-right bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-sans font-extrabold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-[#c2c7cf] rounded-xl bg-brand-bg">
                  <span className="font-medium text-brand-variant">Auditório / Turno</span>
                  <div className="flex items-center font-bold">
                    <span className="text-secondary mr-1">R$</span>
                    <input
                      type="number"
                      value={auditoriumPrice}
                      onChange={(e) => setAuditoriumPrice(Number(e.target.value))}
                      className="w-14 text-right bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-sans font-extrabold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Hero Section Text Area Spanning 2 Columns */}
            <div className="xl:col-span-2 space-y-4">
              <h5 className="font-sans font-black text-xs uppercase tracking-wider text-primary">
                Editor de Textos (Hero Banner Geral)
              </h5>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant block">Título Principal Hero</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-alt/60 bg-brand-bg text-primary font-bold focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Título principal da Landing Page"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant block">Descrição do Hero</label>
                  <textarea
                    rows={3}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-alt/60 bg-brand-bg text-[#42474e] focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm leading-relaxed"
                    placeholder="Descrição secundária"
                  />
                </div>

                {/* Portfólio Gallery image slot in Screen 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">
                      Adicionar Imagem à Galeria
                    </span>
                    <div
                      onClick={handleAddMockImage}
                      className="border-2 border-dashed border-[#c2c7cf] hover:border-secondary bg-brand-bg rounded-xl py-6 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/5 transition-colors text-center"
                    >
                      <Upload className="w-5 h-5 text-brand-variant mb-1" />
                      <span className="text-[10px] font-bold text-primary font-sans">
                        Fazer Upload de Foto (.png, .jpg)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">
                      Imagens Existentes ({gallery.length})
                    </span>
                    <div className="flex gap-2 flex-wrap items-start">
                      {gallery.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-outline-alt group shadow-sm bg-[#ffffff]">
                          <img
                            src={img}
                            alt={`Gallery clinical ${idx}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-lg bg-surface-container border border-dashed border-outline-alt flex items-center justify-center font-sans font-bold text-brand-variant text-xs cursor-pointer hover:bg-secondary/15 transition-all" onClick={handleAddMockImage}>
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                {/* Custom Page Text Customizer Section */}
                <div className="pt-6 border-t border-outline-alt/10 xl:col-span-3 space-y-6">
                  <div className="border-l-4 border-secondary pl-3">
                    <h6 className="font-sans font-extrabold text-[#111c2c] text-sm uppercase tracking-wide">
                      Editor de Textos & Imagens das Telas do Site
                    </h6>
                    <p className="text-[11px] text-brand-variant">Customize o cabeçalho, os planos, as fotos e os blocos de confiança de todo o fluxo do sistema.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Landing Page Content Box */}
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-outline-alt/25 space-y-4">
                      <span className="text-[10px] uppercase font-black text-secondary tracking-widest block">
                        📍 Tela "Encontrar Salas" (Landing Page)
                      </span>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-variant uppercase block">URL Foto de Capa (Hero Banner)</label>
                          <input
                            type="text"
                            value={heroImage}
                            onChange={(e) => setHeroImage(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Cole a URL de uma imagem JPG/PNG..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-variant uppercase block">Título da Seção de Salas</label>
                          <input
                            type="text"
                            value={landingRoomsHeading}
                            onChange={(e) => setLandingRoomsHeading(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary font-bold"
                            placeholder="Ex: Locação flexível com alto padrão"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-variant uppercase block">Slogan da Seção de Salas</label>
                          <textarea
                            rows={2}
                            value={landingRoomsSub}
                            onChange={(e) => setLandingRoomsSub(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary leading-normal"
                            placeholder="Ex: Encontre salas equipadas que transmitem credibilidade..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-outline-alt/10 pt-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-variant uppercase block">Trust Card - Título</label>
                            <input
                              type="text"
                              value={trustTitle}
                              onChange={(e) => setTrustTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
                              placeholder="97 Profissionais Credenciados"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-variant uppercase block">Trust Card - Descrição</label>
                            <input
                              type="text"
                              value={trustDesc}
                              onChange={(e) => setTrustDesc(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Confiam diariamente..."
                            />
                          </div>
                        </div>

                        {/* Plan Customizer Box Inside */}
                        <div className="border-t border-outline-alt/15 pt-3 space-y-3">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Personalização dos Planos do Rodapé</span>
                          
                          {/* Plan 1 */}
                          <div className="p-3 bg-white rounded-xl border border-outline-alt/25 space-y-2">
                            <span className="text-[9px] font-bold text-primary block">Plano 1 (Reserva Avulsa)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={plan1Title}
                                onChange={(e) => setPlan1Title(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs font-bold"
                                placeholder="Título (Reserva Avulsa)"
                              />
                              <input
                                type="text"
                                value={plan1Subtitle}
                                onChange={(e) => setPlan1Subtitle(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs"
                                placeholder="Subtítulo (Uso Esporádico)"
                              />
                            </div>
                            <input
                              type="text"
                              value={plan1Desc}
                              onChange={(e) => setPlan1Desc(e.target.value)}
                              className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs text-slate-600"
                              placeholder="Descrição resumida..."
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={plan1PriceSuffix}
                                onChange={(e) => setPlan1PriceSuffix(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs"
                                placeholder="Fixo/A partir (A partir de)"
                              />
                              <input
                                type="text"
                                value={plan1Price}
                                onChange={(e) => setPlan1Price(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs font-extrabold"
                                placeholder="Preço (35)"
                              />
                            </div>
                          </div>

                          {/* Plan 2 */}
                          <div className="p-3 bg-white rounded-xl border border-outline-alt/25 space-y-2">
                            <span className="text-[9px] font-bold text-secondary block">Plano 2 (Mensal)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={plan2Title}
                                onChange={(e) => setPlan2Title(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs font-bold"
                                placeholder="Título (16 Horas Mensais)"
                              />
                              <input
                                type="text"
                                value={plan2Subtitle}
                                onChange={(e) => setPlan2Subtitle(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs"
                                placeholder="Subtítulo (Pacote Profissional)"
                              />
                            </div>
                            <input
                              type="text"
                              value={plan2Desc}
                              onChange={(e) => setPlan2Desc(e.target.value)}
                              className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs text-slate-600"
                              placeholder="Descrição resumida..."
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={plan2PriceSuffix}
                                onChange={(e) => setPlan2PriceSuffix(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs"
                                placeholder="Fixo/A partir (Valor fixo mensal)"
                              />
                              <input
                                type="text"
                                value={plan2Price}
                                onChange={(e) => setPlan2Price(e.target.value)}
                                className="w-full px-2 py-1 rounded border border-outline-alt/30 text-xs font-extrabold"
                                placeholder="Preço (480)"
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Booking Page Content Box */}
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-outline-alt/25 space-y-4">
                      <span className="text-[10px] uppercase font-black text-primary tracking-widest block">
                        📅 Tela "Reservar Consultório" (Booking View)
                      </span>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-variant uppercase block">Título Principal Disponibilidade Clínica</label>
                          <input
                            type="text"
                            value={bookingRoomsHeading}
                            onChange={(e) => setBookingRoomsHeading(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-alt/40 bg-white text-xs outline-none focus:ring-1 focus:ring-primary font-bold"
                            placeholder="Ex: Disponibilidade Clínica (6 Salas em Palhoça)"
                          />
                        </div>
                        <p className="text-[11px] text-brand-variant leading-relaxed bg-[#f1f6fc] p-3 rounded-lg border border-secondary/15">
                          Para editar fotos, nomes, capacidades, metragens quadradas e benefícios específicos de cada sala exibidos na tela de reserva e no catálogo, use o painel **Gerenciamento de Salas & Consultórios** logo abaixo. Cada sala possui controles de edição de texto individuais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

          </div>
        </div>

        {/* Panel 3: Gerenciamento de Salas (Room Creation & Catalog Administration) */}
        <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-outline-alt/20 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/15 text-secondary p-3 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-[#111c2c] text-lg leading-tight">
                  Gerenciamento de Salas & Consultórios
                </h4>
                <p className="text-xs text-brand-variant mt-0.5">
                  Adicione novas salas, defina endereços, comodidades, recursos lúdicos e fotos para o catálogo de locações em Palhoça.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsAddingRoom(!isAddingRoom)}
              className="px-4 py-2.5 bg-secondary text-white rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-secondary/10 hover:bg-secondary/95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingRoom ? 'Fechar Formulário' : 'Criar Nova Sala'}</span>
            </button>
          </div>

          {/* Form Expansion Block */}
          {isAddingRoom && (
            <form onSubmit={handleCreateRoom} className="space-y-6 p-6 bg-brand-bg rounded-2xl border border-outline-alt/20 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-xs">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Nome da Sala / Consultório</label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Ex: Sala das Palmeiras, Sala Multidisciplinar, Consultório de Pediatria"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Sub-number of office */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Número do Consultório</label>
                  <input
                    type="text"
                    required
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="Ex: Consultório 102, Sala B, Bloco C"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Location Address */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Endereço Completo</label>
                  <input
                    type="text"
                    required
                    value={newRoomLocation}
                    onChange={(e) => setNewRoomLocation(e.target.value)}
                    placeholder="Ex: Av. Barão do Rio Branco, 150 - Centro, Palhoça - SC"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Categoria da Sala (Tabela de Preços)</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary focus:ring-2 focus:ring-primary outline-none font-bold text-secondary"
                  >
                    <option value="standard">Padrão / Standard (R$ {adminSettings.tableOfPrices.standard}/h)</option>
                    <option value="premium">Premium (R$ {adminSettings.tableOfPrices.premium}/h)</option>
                    <option value="executivo_luxo">Consultório Executivo Luxo (R$ {adminSettings.tableOfPrices.executivo_luxo}/h)</option>
                    <option value="auditorium">Auditório (R$ {adminSettings.tableOfPrices.auditorium}/turno)</option>
                  </select>
                </div>

                {/* Photo URL Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block font-bold text-secondary">Foto de Capa do Consultório</label>
                  <input
                    type="text"
                    required
                    value={newRoomImage}
                    onChange={(e) => setNewRoomImage(e.target.value)}
                    placeholder="Cole a URL ou selecione um preset abaixo"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary focus:ring-2 focus:ring-primary outline-none text-xs font-mono"
                  />
                </div>

                {/* Presets Grid */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Presets de Imagem Clínica (Clique p/ selecionar)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewRoomImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAoW3_3-lK3ixFkeSUuv13KklvQeADvFsiWG-M2JXqkPo3zc351XK-v-QY5B6WZhMFYcdux00x9OQx8JQ3t81CRSw19hEzWMubmMom5eMM-9Jwz14jeGfJBQe8fV4f5h3ioRQdGt2JHH92cElgmq9VuAOcTw7-9w7x1_cltDMQPUqRRNV5kEMi9GPzjkXYtGddkTSaSfaEtayWZ4p31vYarH7bg2go2QjYVqVzV4JvlyzqGLQH-dZynak73vV5-YBhcm0oWpMxUf0w')}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${newRoomImage.includes('AB6AXuAoW3') ? 'border-secondary scale-102 ring-4 ring-secondary/15' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoW3_3-lK3ixFkeSUuv13KklvQeADvFsiWG-M2JXqkPo3zc351XK-v-QY5B6WZhMFYcdux00x9OQx8JQ3t81CRSw19hEzWMubmMom5eMM-9Jwz14jeGfJBQe8fV4f5h3ioRQdGt2JHH92cElgmq9VuAOcTw7-9w7x1_cltDMQPUqRRNV5kEMi9GPzjkXYtGddkTSaSfaEtayWZ4p31vYarH7bg2go2QjYVqVzV4JvlyzqGLQH-dZynak73vV5-YBhcm0oWpMxUf0w" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[9px] text-white font-bold">Lúdica / Infantil</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewRoomImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBEA5kcWz6rbF7fVL_dVyf4kNliZh8hHnoTBjUNP-IqEaUPjRkWwbmMiVLt0-qmPlAPb3WEBZnuKKxtPPdeGGyuE_itqi6_ADsV6lfhB-fI-90aTCt_Kyju8NQXl4klyixYzoi2wZ9JjTPioHfHvMoc5a5FtygotQs05VASNttBMqHVm6ehI5O4Z4R2xHI1I4FcB8tiWzzVTW8agz70qJ57GdPnq75ElzCPEckGi-yYNWCFvqxTKKYq9S-f0Srazuq69vYW1Xa02jA')}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${newRoomImage.includes('AB6AXuBEA5k') ? 'border-secondary scale-102 ring-4 ring-secondary/15' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEA5kcWz6rbF7fVL_dVyf4kNliZh8hHnoTBjUNP-IqEaUPjRkWwbmMiVLt0-qmPlAPb3WEBZnuKKxtPPdeGGyuE_itqi6_ADsV6lfhB-fI-90aTCt_Kyju8NQXl4klyixYzoi2wZ9JjTPioHfHvMoc5a5FtygotQs05VASNttBMqHVm6ehI5O4Z4R2xHI1I4FcB8tiWzzVTW8agz70qJ57GdPnq75ElzCPEckGi-yYNWCFvqxTKKYq9S-f0Srazuq69vYW1Xa02jA" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[9px] text-white font-bold">Psicologia Clássica</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewRoomImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBq8jn8GNPvhb_gIC4xr06rraY39VlEUEH-0vSJU6AYujIG9DPkiUF1zqgzTX4ed3d_R2wOdBXRkiOMI1Y9BO9LzgJkVhgoETydsTV8dowqy_Z9JNSoh_SiVLn0ilBjJowhkrFI_0mgfjbkVy-Qq32p4dqZVc0fNwPvvGoy_Z8ShEwGo0oyYQgb5AdRSb09mKV_O1pwN0N-wglRmLTKXEAy6PFRZCkL8A7B8oN3s_OrsOv7CY8nPWXlcPeRWSvDO5P2k_UvMbJ51tU')}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${newRoomImage.includes('AB6AXuBq8') ? 'border-secondary scale-102 ring-4 ring-secondary/15' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq8jn8GNPvhb_gIC4xr06rraY39VlEUEH-0vSJU6AYujIG9DPkiUF1zqgzTX4ed3d_R2wOdBXRkiOMI1Y9BO9LzgJkVhgoETydsTV8dowqy_Z9JNSoh_SiVLn0ilBjJowhkrFI_0mgfjbkVy-Qq32p4dqZVc0fNwPvvGoy_Z8ShEwGo0oyYQgb5AdRSb09mKV_O1pwN0N-wglRmLTKXEAy6PFRZCkL8A7B8oN3s_OrsOv7CY8nPWXlcPeRWSvDO5P2k_UvMbJ51tU" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[9px] text-white font-bold">Multidisciplinar / Geral</div>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-variant block">Descrição do Consultório / Sala</label>
                  <textarea
                    rows={3}
                    required
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    placeholder="Insira detalhes sobre móveis, sonorização, conforto e finalidade..."
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-[#42474e] focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* CHOSEN AMENITIES/FEATURES CHECKS */}
                <div className="md:col-span-2 space-y-3 pt-2 border-t border-outline-alt/20">
                  <h5 className="text-[10px] uppercase font-black tracking-wider text-primary">Comodidades & Diferenciais do Consultório</h5>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {AMENITIES_LIST.map((amenity) => {
                      const valueString = `${amenity.emoji} ${amenity.label}`;
                      const isSelected = newRoomFeatures.includes(valueString);
                      return (
                        <button
                          key={amenity.label}
                          type="button"
                          onClick={() => {
                            setNewRoomFeatures(prev => 
                              prev.includes(valueString)
                                ? prev.filter(f => f !== valueString)
                                : [...prev, valueString]
                            );
                          }}
                          className={`flex items-center gap-2.5 p-2 px-3 border rounded-xl cursor-pointer select-none transition-all text-left ${
                            isSelected
                              ? 'bg-slate-900 border-slate-950 text-white shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-outline-alt/45 text-slate-700'
                          }`}
                        >
                          <span className="text-base">{amenity.emoji}</span>
                          <span className="font-semibold text-[11px] leading-tight">{amenity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRoom(false)}
                  className="px-5 py-2.5 text-xs text-brand-variant font-bold border border-[#c2c7cf] hover:bg-outline-alt/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs text-white font-bold bg-primary hover:bg-primary/95 rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Consultório
                </button>
              </div>
            </form>
          )}

          {/* Edit Room Form Expansion Block */}
          {editingRoom && (
            <form onSubmit={handleSaveEditedRoom} id="edit-room-form-anchor" className="space-y-6 p-6 bg-[#ebf3fc]/40 rounded-2xl border-2 border-secondary/20 animate-fade-in mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-secondary/10">
                <span className="font-sans font-black text-secondary text-xs uppercase tracking-wider">
                  ✏️ Editando Consultório: {editingRoom.name}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="text-brand-variant hover:text-primary text-xs font-bold cursor-pointer"
                >
                  Fechar [✕]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 font-sans text-xs">
                {/* Room Custom Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Identificação da Sala (Nome)</label>
                  <input
                    type="text"
                    required
                    value={editRoomNameOnly}
                    onChange={(e) => setEditRoomNameOnly(e.target.value)}
                    placeholder="Ex: Consultório A04 - Terapia"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-primary font-bold focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                {/* Sublocation Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Tipo de Categoria Técnica</label>
                  <select
                    value={editRoomType}
                    onChange={(e) => setEditRoomType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white focus:ring-2 focus:ring-secondary outline-none font-semibold text-primary"
                  >
                    <option value="standard">Standard (Básica Completa)</option>
                    <option value="premium">Premium (Clínica Especializada)</option>
                    <option value="executivo_luxo">Luxo Executivo (Mobiliada Alto Padrão)</option>
                    <option value="auditorium">Auditório / Turno Especial</option>
                  </select>
                </div>

                {/* Address Location */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Endereço da Unidade Clínica</label>
                  <input
                    type="text"
                    required
                    value={editRoomLocation}
                    onChange={(e) => setEditRoomLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-brand-text focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                {/* Picture Image URLs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Foto Principal (URL)</label>
                  <input
                    type="text"
                    required
                    value={editRoomImage0}
                    onChange={(e) => setEditRoomImage0(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-[#42474e] focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Foto Opcional 2 (URL)</label>
                  <input
                    type="text"
                    value={editRoomImage1}
                    onChange={(e) => setEditRoomImage1(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-[#42474e] focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Foto Opcional 3 (URL)</label>
                  <input
                    type="text"
                    value={editRoomImage2}
                    onChange={(e) => setEditRoomImage2(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-[#42474e] focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                {/* Description texts */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-variant">Descrição de Recursos & Acolhimento</label>
                  <textarea
                    rows={2}
                    required
                    value={editRoomDescription}
                    onChange={(e) => setEditRoomDescription(e.target.value)}
                    placeholder="Recursos da sala..."
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-alt/60 bg-white text-[#42474e] focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                {/* CHOSEN AMENITIES/FEATURES CHECKS */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <h5 className="text-[10px] uppercase font-black tracking-wider text-secondary font-sans font-extrabold pb-1">Ajustar Comodidades / Diagnósticos</h5>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {AMENITIES_LIST.map((amenity) => {
                      const valueString = `${amenity.emoji} ${amenity.label}`;
                      const isSelected = editRoomFeatures.includes(valueString);
                      return (
                        <button
                          key={amenity.label}
                          type="button"
                          onClick={() => {
                            setEditRoomFeatures(prev => 
                              prev.includes(valueString)
                                ? prev.filter(f => f !== valueString)
                                : [...prev, valueString]
                            );
                          }}
                          className={`flex items-center gap-2.5 p-2 px-3 border rounded-xl cursor-pointer select-none transition-all text-left ${
                            isSelected
                              ? 'bg-slate-900 border-slate-950 text-white shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-outline-alt/45 text-slate-700'
                          }`}
                        >
                          <span className="text-base">{amenity.emoji}</span>
                          <span className="font-semibold text-[11px] leading-tight">{amenity.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-5 py-2.5 text-xs text-brand-variant font-bold border border-[#c2c7cf] hover:bg-outline-alt/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs text-white font-bold bg-[#38761d] hover:bg-green-700 rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar Edição
                </button>
              </div>
            </form>
          )}

          {/* Catalog Review List - Page Editor and Preview */}
          <div className="space-y-6 pt-3 font-sans">
            <div className="bg-slate-50 border border-slate-250/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
              <div className="text-left">
                <span className="text-[10px] uppercase font-black text-secondary bg-secondary/15 px-2.5 py-1 rounded-full block w-fit">
                  Visualização do Catálogo ("Encontrar Salas")
                </span>
                <p className="text-xs text-brand-variant mt-1.5 font-medium">
                  Esta é a visualização idêntica à tela pública de busca de salas. Gerencie dados, comodidades e fotos de cada consultório com cuidado.
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-white border border-outline-alt/40 px-3 py-1.5 rounded-xl shadow-2xs flex-shrink-0">
                {rooms.length} Salas Cadastradas
              </span>
            </div>

            {/* Mirroring "Encontrar Salas" page visual layout with rich cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => {
                const isStandard = room.type === 'standard';
                const isPremium = room.type === 'premium';
                const isExecutivo = room.type === 'executivo_luxo';

                return (
                  <div
                    key={room.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-outline-alt/45 hover:border-secondary/35 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Room Image */}
                      <div className="h-44 overflow-hidden bg-slate-100 relative">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-secondary border border-secondary/10 flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-secondary text-secondary" />
                          <span>{(room.rating || 5.0).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Content details matching finding rooms page exactly */}
                      <div className="p-5 text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-wider bg-secondary/10 px-2.5 py-0.5 rounded-md">
                            {isExecutivo ? 'Executivo Luxo' : (isPremium ? 'Premium' : 'Standard')}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-brand-variant font-bold">
                            <span className="flex items-center gap-0.5">📐 {room.size || '32m²'}</span>
                            <span className="flex items-center gap-0.5">👥 {room.capacity || 'Clínica'}</span>
                          </div>
                        </div>

                        <h3 className="font-sans font-extrabold text-base text-primary leading-tight">
                          {room.name}
                        </h3>

                        <p className="font-sans text-[11px] text-brand-variant line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>

                        {/* Elegant Black & White Amenities Icons */}
                        <div className="flex flex-wrap gap-1.5 py-1">
                          {room.features.map((feat, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-black bg-white border border-black/15 shadow-2xs px-2.5 py-0.5 rounded-full transition-all"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Integrated actions in footer block */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-outline-alt/15 flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[9px] text-brand-variant font-extrabold uppercase tracking-widest block">Locação</span>
                          <p className="font-sans font-black text-lg text-primary">
                            R$ {room.pricePerHour.toFixed(2).replace('.', ',')} <span className="text-xs font-normal text-brand-variant">/h</span>
                          </p>
                        </div>

                        {/* Double button admin editors built meticulously into card bottom */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => handleSelectRoomForEditing(room)}
                            className="text-center font-bold text-[10px] text-primary border border-[#c2c7cf] hover:bg-slate-50 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-1 font-sans"
                            title="Editar Informações da Sala"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-center font-bold text-[10px] text-red-600 bg-red-50 border border-red-200/40 hover:bg-red-100 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-1 font-sans"
                            title="Excluir Sala com Cuidado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Healthcare Practitioners / Onboarding Documents Validation Board */}
        <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-alt/25 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/15 text-secondary p-3 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-[#111c2c] text-lg leading-tight animate-pulse">
                  Validação de Documentos de Profissionais
                </h4>
                <p className="text-xs text-brand-variant mt-0.5">
                  Analise as fotos, certidões de conselhos (CRM/CRP/CRN), aceite contratual e dê baixa nos documentos do Dr./Dra. para liberação na portaria do condomínio em Palhoça, SC.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-secondary/10 text-secondary font-sans font-black text-[10px] rounded-full uppercase tracking-wider">
              {registeredUsers.length} Cadastros
            </span>
          </div>

          <div className="space-y-6">
            {registeredUsers.length === 0 ? (
              <p className="text-brand-variant text-center py-6 font-sans text-xs">
                Nenhum profissional cadastrado até o momento.
              </p>
            ) : (
              registeredUsers.map((user, idx) => {
                const status = user.approvalStatus || 'Pendente';
                
                // Toggle / Clearance action helper
                const updateStatus = (newStatus: 'Aprovado' | 'Rejeitado' | 'Pendente') => {
                  const updated = [...registeredUsers];
                  updated[idx] = { ...user, approvalStatus: newStatus };
                  onUpdateUsers(updated);
                  triggerToast(`Status de ${user.name} atualizado para: ${newStatus}!`);
                };

                return (
                  <div
                    key={user.email}
                    className="p-6 rounded-2xl border border-[#bfc8c9] bg-brand-bg flex flex-col lg:flex-row gap-6 transition-all hover:bg-white hover:shadow-md"
                  >
                    {/* Column 1: Profile Photo */}
                    <div className="flex flex-col items-center text-center lg:w-44 flex-shrink-0 space-y-2.5">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-secondary/20 shadow-inner group bg-slate-100">
                        {user.profilePhoto?.previewUrl ? (
                          <img 
                            src={user.profilePhoto.previewUrl} 
                            alt={user.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 font-sans text-xs">
                            Sem Foto
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-secondary/85 py-1 text-center text-[8px] text-white font-black leading-none uppercase">
                          Portaria
                        </div>
                      </div>

                      <div className="w-full">
                        <h5 className="font-bold text-primary text-sm font-sans truncate leading-none">{user.name}</h5>
                        <p className="text-[10px] text-brand-variant font-semibold mt-1 truncate">{user.registerNumber}</p>
                      </div>

                      {/* Acceptance status pill */}
                      {user.acceptedTerms ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-200" title="Termo Aceito">
                          <Check className="w-3.5 h-3.5" />
                          <span className="leading-none">Termos Aceitos</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded-lg border border-yellow-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-yellow-600" />
                          <span className="leading-none">Termo Pendente</span>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Detailed fields info */}
                    <div className="flex-grow min-w-0 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-variant block">E-mail Profissional</span>
                          <span className="font-bold text-primary font-sans block truncate">{user.email}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-variant block">Telefone com WhatsApp</span>
                          <span className="font-bold text-primary font-sans block truncate">{user.phone || '(48) ----- ----'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-variant block">Data do Aceite Contratual:</span>
                          <span className="font-sans text-[#42474e] text-xs font-semibold block">
                            {user.acceptedTermsDate || 'Não disponível'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-variant block">Situação Geral de Cadastro</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {status === 'Aprovado' && (
                              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-green-200 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 block"></span>
                                Aprovado (Acesso Liberado)
                              </span>
                            )}
                            {status === 'Pendente' && (
                              <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-850 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-yellow-200 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-550 block animate-pulse"></span>
                                Aguardando Liberação / Baixa
                              </span>
                            )}
                            {status === 'Rejeitado' && (
                              <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-red-200 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span>
                                Rejeitado (Necessário Reanexar)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Documents Attachments Drawer list */}
                      <div className="space-y-2 pt-3 border-t border-outline-alt/10">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-variant block">Anexos de Documentos Carregados</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                          {/* Item 1: CNH/RG */}
                          <div className="p-2.5 bg-white border border-outline-alt/25 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="font-extrabold text-primary block leading-none">Documento de ID (RG/CNH)</span>
                                <span className="text-[9px] text-brand-variant truncate block mt-0.5">{user.idDocument?.name || 'rg_cnh_original_sc.pdf'}</span>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => alert(`Abrindo visualização do Documento de Identidade de ${user.name}`)}
                              className="text-[10px] font-bold text-secondary hover:underline cursor-pointer flex-shrink-0"
                            >
                              Visualizar
                            </button>
                          </div>

                          {/* Item 2: Class register */}
                          <div className="p-2.5 bg-white border border-outline-alt/25 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="font-extrabold text-primary block leading-none">Inscrição Profissional</span>
                                <span className="text-[9px] text-brand-variant truncate block mt-0.5">{user.professionalDocument?.name || 'conselho_profissional_sc.pdf'}</span>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => alert(`Abrindo visualização do Registro de Classe de ${user.name}`)}
                              className="text-[10px] font-bold text-secondary hover:underline cursor-pointer flex-shrink-0"
                            >
                              Visualizar
                            </button>
                          </div>

                          {/* Item 3: Secondary files */}
                          <div className="p-2.5 bg-white border border-outline-alt/25 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-brand-variant flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="font-semibold text-primary block leading-none">Outros Diplomas (Extras)</span>
                                <span className="text-[9px] text-brand-variant truncate block mt-0.5">
                                  {user.documents && user.documents[0] ? user.documents[0].name : 'Nenhum comprovante extra'}
                                </span>
                              </div>
                            </div>
                            {user.documents && user.documents[0] ? (
                              <button 
                                onClick={() => alert('Diploma de pós-graduação e residência anexado.')}
                                className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                              >
                                Ver
                              </button>
                            ) : (
                              <span className="text-[9px] text-brand-variant italic">Nenhum</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CLEARANCE / ACTION BUTTONS (Dar baixa nos documentos) */}
                      <div className="bg-[#ebf1fa] p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 border border-secondary/10">
                        <div className="text-left w-full sm:w-auto">
                          <span className="font-bold text-xs text-[#111c2c] block leading-none">Ações de Regularização de Cadastro</span>
                          <span className="text-[10px] text-brand-variant leading-none block mt-1">Clique para dar baixa nos documentos e ativar/recusar o profissional no condomínio</span>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          {status !== 'Aprovado' && (
                            <button
                              onClick={() => updateStatus('Aprovado')}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-sans font-bold text-xs flex items-center gap-1 cursor-pointer flex-1 sm:flex-initial justify-center shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Dar Baixa (Aprovar)</span>
                            </button>
                          )}
                          {status !== 'Rejeitado' && (
                            <button
                              onClick={() => updateStatus('Rejeitado')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-sans font-bold text-xs flex items-center gap-1 cursor-pointer flex-1 sm:flex-initial justify-center shadow-sm"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Recusar</span>
                            </button>
                          )}
                          {status !== 'Pendente' && (
                            <button
                              onClick={() => updateStatus('Pendente')}
                              className="px-4 py-2 bg-white text-[#42474e] border border-[#c2c7cf] hover:bg-slate-100 rounded-lg font-sans font-semibold text-xs flex items-center gap-1 cursor-pointer flex-1 sm:flex-initial justify-center"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Reanalisar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic section: My Bookings Live Monitor Sheet */}
        <div className="bg-white p-8 rounded-3xl border border-outline-alt/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 justify-between pb-4 border-b border-outline-alt/25">
            <h4 className="font-sans font-extrabold text-[#111c2c] text-base uppercase tracking-wide">
              Controle de Agendamentos ({bookings.length})
            </h4>
            <span className="px-2.5 py-1 bg-primary/10 text-primary font-bold text-[10px] rounded-full uppercase tracking-wider animate-pulse">
              Em Tempo Real
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {bookings.length === 0 ? (
              <p className="text-brand-variant text-center py-6">
                Nenhum agendamento realizado até o momento.
              </p>
            ) : (
              bookings.map((booking) => {
                const isConfirmed = booking.status === 'Confirmado';
                return (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl border border-outline-alt/30 bg-brand-bg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary text-sm truncate">{booking.roomName}</span>
                        <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[9px] font-black uppercase rounded-full tracking-wider">
                          R$ {booking.pricePerHour}/h
                        </span>
                      </div>
                      <p className="text-brand-variant font-semibold">
                        Data: <span className="text-primary font-bold">{booking.date}</span>
                      </p>
                      <p className="text-brand-variant">
                        Horários Reservados: <span className="font-bold text-secondary">{booking.timeSlots.join(', ')}</span>
                      </p>
                      <p className="text-[10px] text-brand-variant uppercase tracking-wider font-semibold">
                        Profissional: <span className="text-primary font-bold">{booking.professionalName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t border-outline-alt/10 pt-2.5 md:pt-0 md:border-none">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-brand-variant uppercase">Total pago</p>
                        <p className="font-bold text-primary text-base">
                          R$ {booking.totalValue.toFixed(2).replace('.', ',')}
                        </p>
                      </div>

                      {isConfirmed ? (
                        <button
                          onClick={() => {
                            if (confirm('Deseja realmente cancelar este agendamento?')) {
                              onCancelBooking(booking.id);
                              triggerToast('Agendamento cancelado com sucesso.');
                            }
                          }}
                          className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Cancelar Agendamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                          Cancelado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
