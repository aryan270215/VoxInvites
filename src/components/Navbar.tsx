import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, ignore the error
        return;
      }
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(`Login failed: Unauthorized domain.\n\nPlease go to Firebase Console -> Authentication -> Settings -> Authorized domains and add:\n\n${domain}`);
      } else {
        alert(`Login failed: ${error.message}`);
      }
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Vox Invites Logo" className="h-8 w-8 rounded-lg" />
            <span className="font-serif text-xl font-semibold text-stone-800">Vox Invites</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/templates" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Templates
            </Link>
            <Link to="/admin" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              Admin
            </Link>
            {user ? (
              <>
                <Link to="/create" className="text-sm font-medium text-stone-600 hover:text-stone-900">
                  Create Invite
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
