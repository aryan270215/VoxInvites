import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, Search, Users, Lock, Code } from 'lucide-react';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

export default function Admin() {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [headCode, setHeadCode] = useState('');
  const [savingHeadCode, setSavingHeadCode] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!user || user.email !== 'patadiaaryan27@gmail.com') {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'invitations'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvites(data);

        // Fetch global settings gracefully
        try {
          const settingsRef = doc(db, 'settings', 'global');
          const settingsSnap = await getDoc(settingsRef);
          if (settingsSnap.exists() && settingsSnap.data().headCode) {
            setHeadCode(settingsSnap.data().headCode);
          }
        } catch (settingsError) {
          console.warn("Could not fetch global settings block. It might be due to offline mode or network issues.", settingsError);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'invitations');
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, [user]);

  const handleSaveHeadCode = async () => {
    setSavingHeadCode(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), { headCode }, { merge: true });
      alert('Global head code saved successfully.');
    } catch (error) {
      console.error('Error saving global settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSavingHeadCode(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invitation?')) return;
    try {
      await deleteDoc(doc(db, 'invitations', id));
      setInvites(invites.filter(inv => inv.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `invitations/${id}`);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2026') {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') return;
      if (error.code === 'auth/unauthorized-domain') {
        alert(`Login failed: Unauthorized domain.\n\nPlease go to Firebase Console -> Authentication -> Settings -> Authorized domains and add:\n\n${window.location.hostname}`);
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Admin Sign In</h2>
          <p className="text-stone-600 mb-6">Please sign in to access the admin panel.</p>
          <button
            onClick={handleLogin}
            className="bg-stone-900 text-white px-6 py-2 rounded-full font-medium hover:bg-stone-800 transition-colors"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  if (user.email !== 'patadiaaryan27@gmail.com') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Access Denied</h2>
          <p className="text-stone-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-stone-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Global Admin Access</h2>
          <p className="text-stone-600 mb-6">Enter the master PIN to continue</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={4}
              className="w-full text-center text-2xl tracking-[1em] px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none mb-4"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••"
            />
            {pinError && <p className="text-red-500 text-sm mb-4">Incorrect PIN. Please try again.</p>}
            <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredInvites = invites.filter(inv => {
    const pName = (inv.primaryName || inv.brideName || '').toLowerCase();
    const sName = (inv.secondaryName || inv.groomName || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return pName.includes(search) || sName.includes(search);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-600 mt-2">Manage all invitations</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Total Invites</p>
              <p className="text-2xl font-bold text-stone-900">{invites.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900">Global Head Code</h2>
            <p className="text-sm text-stone-500">Inject code into the &lt;head&gt; of all pages (e.g., AdSense, Analytics, custom scripts).</p>
          </div>
        </div>
        <textarea
          value={headCode}
          onChange={(e) => setHeadCode(e.target.value)}
          placeholder="<!-- Paste your HTML/Scripts here -->"
          className="w-full h-48 p-4 font-mono text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveHeadCode}
            disabled={savingHeadCode}
            className="px-6 py-2 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
          >
            {savingHeadCode ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by host or couple name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Event / Hosts</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Theme</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInvites.map(invite => (
                <tr key={invite.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-900">
                      {invite.primaryName || invite.brideName} 
                      {(invite.secondaryName || invite.groomName) && ` & ${invite.secondaryName || invite.groomName}`}
                    </div>
                    <div className="text-sm text-stone-500 capitalize">{invite.eventType?.replace('_', ' ') || 'Wedding'} • {invite.venue}</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    {format(new Date(invite.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 capitalize">
                      {invite.theme}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-600 text-sm">
                    {invite.createdAt?.toDate ? format(invite.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/invite/${invite.id}`} target="_blank" className="inline-flex p-2 text-stone-400 hover:text-stone-900 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(invite.id)} className="inline-flex p-2 text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInvites.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                    No invitations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
