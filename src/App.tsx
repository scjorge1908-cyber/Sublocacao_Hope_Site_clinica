import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPageView from './components/LandingPageView';
import BookingPageView from './components/BookingPageView';
import AdminDashboardView from './components/AdminDashboardView';
import RegisterPageView from './components/RegisterPageView';
import ProfessionalPortalView from './components/ProfessionalPortalView';

import { Room, Booking, AdminSettings, ProfessionalProfile } from './types';
import { INITIAL_ROOMS, INITIAL_ADMIN_SETTINGS } from './data';

export default function App() {
  // 1. App States
  const [currentView, setView] = useState<string>('home'); // Views: 'home', 'booking', 'admin', 'register'
  
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('sublocahope_rooms');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length >= 6) {
        return parsed;
      }
    }
    return INITIAL_ROOMS;
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('sublocahope_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed.heroTitle === 'Seu consultório profissional, pronto para atender.' || 
        parsed.heroTitle === 'Um consultório preparado para cuidar de quem precisa ser ouvido.'
      ) {
        parsed.heroTitle = INITIAL_ADMIN_SETTINGS.heroTitle;
        localStorage.setItem('sublocahope_settings', JSON.stringify(parsed));
      }
      if (parsed.heroDescription !== INITIAL_ADMIN_SETTINGS.heroDescription) {
        parsed.heroDescription = INITIAL_ADMIN_SETTINGS.heroDescription;
        localStorage.setItem('sublocahope_settings', JSON.stringify(parsed));
      }
      return parsed;
    }
    return INITIAL_ADMIN_SETTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sublocahope_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<ProfessionalProfile[]>(() => {
    const saved = localStorage.getItem('sublocahope_users');
    if (saved) return JSON.parse(saved);
    
    // Default pre-filled users to ensure a feature-rich admin dashboard on load
    const defaultUser: ProfessionalProfile = {
      name: 'Dr. Roberto Silva',
      email: 'roberto.silva@hope.com.br',
      registerNumber: 'CRM/SC 123456',
      phone: '(48) 99123-4567',
      profilePhoto: { name: 'roberto_silva_perfil.jpg', size: 124500, previewUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250&h=250' },
      idDocument: { name: 'cnh_roberto.pdf', size: 304520 },
      professionalDocument: { name: 'carteira_crm_sc.pdf', size: 154800 },
      documents: [{ name: 'diploma_medicina.pdf', size: 102456 }],
      acceptedTerms: true,
      acceptedTermsDate: '05/06/2026, 11:15',
      approvalStatus: 'Pendente'
    };
    
    const anotherUser: ProfessionalProfile = {
      name: 'Dra. Beatrice Santos',
      email: 'beatrice.santos@hope.com.br',
      registerNumber: 'CRP/SC 987654',
      phone: '(48) 98877-6655',
      profilePhoto: { name: 'beatrice_santos_perfil.jpg', size: 145000, previewUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=250&h=250' },
      idDocument: { name: 'rg_beatrice.pdf', size: 412000 },
      professionalDocument: { name: 'carteira_crp_sc.pdf', size: 210000 },
      documents: [],
      acceptedTerms: true,
      acceptedTermsDate: '04/06/2026, 14:32',
      approvalStatus: 'Aprovado'
    };
    
    return [defaultUser, anotherUser];
  });

  const [activeUser, setActiveUser] = useState<ProfessionalProfile | null>(() => {
    const saved = localStorage.getItem('sublocahope_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Track currently selected room for booking page
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-a04');

  // Persistence to localstorage
  useEffect(() => {
    localStorage.setItem('sublocahope_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('sublocahope_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('sublocahope_settings', JSON.stringify(adminSettings));
    
    // Dynamically update room prices in rooms array when admin modifications are published!
    setRooms(prevRooms => {
      return prevRooms.map(r => {
        if (r.type === 'standard') {
          return { ...r, pricePerHour: adminSettings.tableOfPrices.standard };
        } else if (r.type === 'premium') {
          return { ...r, pricePerHour: adminSettings.tableOfPrices.premium };
        } else if (r.type === 'executivo_luxo') {
          return { ...r, pricePerHour: adminSettings.tableOfPrices.executivo_luxo };
        }
        return r;
      });
    });
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('sublocahope_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('sublocahope_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('sublocahope_user');
    }
  }, [activeUser]);

  // View scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView]);

  // State actions
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelado' } : b))
    );
  };

  const handleUpdateSettings = (updated: AdminSettings) => {
    setAdminSettings(updated);
  };

  const handleRegister = (profile: ProfessionalProfile) => {
    setActiveUser(profile);
    setRegisteredUsers((prev) => {
      const filtered = prev.filter((p) => p.email !== profile.email);
      return [profile, ...filtered];
    });
  };

  const activeRoomObj = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen flex flex-col antialiased">
      {/* Top Application Header / Multi-View Navigation Switcher */}
      <Navbar currentView={currentView} setView={setView} activeUser={activeUser} />

      {/* Main Multi-Screen Content Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {currentView === 'home' && (
          <LandingPageView
            rooms={rooms}
            adminSettings={adminSettings}
            setView={setView}
            onSelectRoom={setSelectedRoomId}
          />
        )}

        {currentView === 'booking' && (
          <BookingPageView
            selectedRoom={activeRoomObj}
            pricePerHour={activeRoomObj.pricePerHour}
            onAddBooking={handleAddBooking}
            setView={setView}
            professionalName={activeUser?.name}
            professionalId={activeUser?.registerNumber}
            adminSettings={adminSettings}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            adminSettings={adminSettings}
            bookings={bookings}
            rooms={rooms}
            onUpdateSettings={handleUpdateSettings}
            onCancelBooking={handleCancelBooking}
            onUpdateRooms={(updatedRooms: Room[]) => setRooms(updatedRooms)}
            registeredUsers={registeredUsers}
            onUpdateUsers={(updatedUsers: ProfessionalProfile[]) => setRegisteredUsers(updatedUsers)}
            setView={setView}
          />
        )}

        {currentView.startsWith('register') && (
          <RegisterPageView 
            onRegister={handleRegister} 
            setView={setView} 
            registeredUsers={registeredUsers}
            onLogin={(profile) => {
              setActiveUser(profile);
              setView('professional-dashboard');
            }}
            initialTab={currentView === 'register-login' ? 'login' : 'register'}
          />
        )}

        {currentView === 'professional-dashboard' && activeUser && (
          <ProfessionalPortalView
            activeUser={activeUser}
            bookings={bookings}
            rooms={rooms}
            onCancelBooking={handleCancelBooking}
            onAddBooking={handleAddBooking}
            setView={setView}
            onLogout={() => {
              setActiveUser(null);
              setView('home');
            }}
            onUpdateProfile={(updated) => {
              setActiveUser(updated);
              setRegisteredUsers((prev) => prev.map((u) => u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u));
            }}
          />
        )}
      </main>
    </div>
  );
}
