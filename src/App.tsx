import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Create from './pages/Create';
import Invite from './pages/Invite';
import InviteAdmin from './pages/InviteAdmin';
import Admin from './pages/Admin';
import Templates from './pages/Templates';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<Create />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/invite/:id" element={<Invite />} />
              <Route path="/invite/:id/admin" element={<InviteAdmin />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
