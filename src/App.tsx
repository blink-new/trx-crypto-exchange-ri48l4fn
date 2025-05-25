import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SideNavigation from './components/SideNavigation';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MarketsPage from './pages/Markets';
import Dashboard from './pages/Dashboard';
import SpotTrading from './pages/spot/SpotTrading';
import CryptoTrading from './pages/CryptoTrading';
import ForexTrading from './pages/ForexTrading';
import Earn from './pages/Earn';
import BuyCrypto from './pages/BuyCrypto';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Open from './pages/orders/Open';
import Pending from './pages/orders/Pending';
import History from './pages/orders/History';
import Assets from './pages/wallet/Assets';
import Deposit from './pages/wallet/Deposit';
import Withdraw from './pages/wallet/Withdraw';
import Profile from './pages/wallet/Profile';
import Verification from './pages/wallet/Verification';
import Futures from './pages/Futures';
import More from './pages/More';
import BonusCenter from './components/dashboard/BonusCenter';
import VIP from './pages/VIP';
import Launchpad from './pages/Launchpad';
import Research from './pages/Research';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';
import Withdrawal from './pages/legal/Withdrawal';
import Agreement from './pages/legal/Agreement';
import Risk from './pages/legal/Risk';
import AML from './pages/legal/AML';
import Conflict from './pages/legal/Conflict';
import InsuranceFund from './pages/InsuranceFund';
import About from './pages/About';
import Contacts from './pages/Contacts';
import AllNews from './pages/AllNews';
import Blog from './pages/Blog';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isSpotPage = location.pathname === '/spot' || location.pathname === '/forex' || location.pathname === '/crypto';
  const isTradingPage = isSpotPage || location.pathname === '/crypto';
  const showHeader = !isSpotPage;
  const showFooter = !isTradingPage; // Скрываем футер на всех торговых страницах
  const [isNavExpanded] = React.useState(() => localStorage.getItem('sideNavExpanded') === 'true');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="main-container">
      {showHeader && <Header />}
      {user && <SideNavigation />}
      <main className={`main-content ${isNavExpanded ? 'nav-expanded' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crypto" element={<CryptoTrading />} />
          <Route path="/spot" element={<SpotTrading />} />
          <Route path="/forex" element={<ForexTrading />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/futures" element={<Futures />} />
          <Route path="/orders/open" element={<Open />} />
          <Route path="/orders/pending" element={<Pending />} />
          <Route path="/orders/history" element={<History />} />
          <Route path="/more" element={<More />} />
          <Route path="/wallet/assets" element={<Assets />} />
          <Route path="/buy-crypto" element={<BuyCrypto />} />
          <Route path="/wallet/deposit" element={<Deposit />} />
          <Route path="/wallet/withdraw" element={<Withdraw />} />
          <Route path="/wallet/profile/*" element={<Profile />} />
          <Route path="/wallet/verification" element={<Verification />} />
          <Route path="/support" element={<Support />} />
          
          {/* Маршруты для настроек преобразованы в единый путь, который открывает модальное окно */}
          <Route path="/settings" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/personal" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/general" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/trading" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/chart" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/notifications" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/security" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/feedback" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/email" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          <Route path="/settings/documents" element={<Settings isOpen={true} onClose={() => setIsSettingsOpen(false)} />} />
          
          <Route path="/bonus-center" element={<BonusCenter />} />
          <Route path="/vip" element={<VIP />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/research" element={<Research />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/legal/withdrawal" element={<Withdrawal />} />
          <Route path="/legal/agreement" element={<Agreement />} />
          <Route path="/legal/risk" element={<Risk />} />
          <Route path="/legal/aml" element={<AML />} />
          <Route path="/legal/conflict" element={<Conflict />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/insurance-fund" element={<InsuranceFund />} />
        </Routes>
        {showFooter && <Footer />}
      </main>

      {/* Отдельный рендер настроек как модальное окно */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;