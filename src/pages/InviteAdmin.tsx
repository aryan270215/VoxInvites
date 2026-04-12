import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Lock, Users, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';
import { templates } from '../utils/demoData';

export default function InviteAdmin() {
  const { id } = useParams<{ id: string }>();
  const [invite, setInvite] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!id) return;

      if (id.startsWith('demo-')) {
        const demoId = id.replace('demo-', '');
        const template = templates.find(t => t.id === demoId);
        if (template && template.demoData) {
          setInvite({ ...template.demoData, id, creatorId: 'demo-creator' });
          setLoading(false);
          return;
        }
      }

      try {
        const docRef = doc(db, 'invitations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvite(docSnap.data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `invitations/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [id]);

  const fetchRsvps = async () => {
    if (!id) return;
    if (id.startsWith('demo-')) {
      setRsvps([
        { id: '1', name: 'John Doe', attending: true, guests: 2, message: 'Can\'t wait!', createdAt: { toDate: () => new Date() } },
        { id: '2', name: 'Jane Smith', attending: false, guests: 0, message: 'Sorry, I have another event.', createdAt: { toDate: () => new Date() } }
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'invitations', id, 'rsvps'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRsvps(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `invitations/${id}/rsvps`);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invite?.adminPin === pin || (!invite?.adminPin && pin === '')) {
      setUnlocked(true);
      setPinError(false);
      fetchRsvps();
    } else {
      setPinError(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>;
  if (!invite) return <div className="min-h-screen flex items-center justify-center text-2xl font-serif">Invitation not found</div>;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-stone-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Invite Admin Panel</h2>
          <p className="text-stone-600 mb-6">Enter your Admin PIN to view RSVPs</p>
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
          <Link to={`/invite/${id}`} className="inline-block mt-6 text-sm text-stone-500 hover:text-stone-900">
            &larr; Back to Invitation
          </Link>
        </div>
      </div>
    );
  }

  const totalAttending = rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.guests, 0);
  const totalDeclined = rsvps.filter(r => !r.attending).length;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={`/invite/${id}`} className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Invitation
            </Link>
            <h1 className="text-3xl font-serif font-bold text-stone-900">RSVP Dashboard</h1>
            <p className="text-stone-600 mt-1">{invite.brideName} & {invite.groomName}'s Wedding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Total Guests Attending</p>
                <p className="text-3xl font-bold text-stone-900">{totalAttending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Accepted Invites</p>
                <p className="text-3xl font-bold text-stone-900">{rsvps.filter(r => r.attending).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-stone-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Declined Invites</p>
                <p className="text-3xl font-bold text-stone-900">{totalDeclined}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Guests</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rsvps.map(rsvp => (
                  <tr key={rsvp.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">{rsvp.name}</td>
                    <td className="px-6 py-4">
                      {rsvp.attending ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-600">{rsvp.attending ? rsvp.guests : '-'}</td>
                    <td className="px-6 py-4 text-stone-600 max-w-xs truncate" title={rsvp.message}>
                      {rsvp.message || '-'}
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-sm">
                      {rsvp.createdAt?.toDate ? format(rsvp.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                    </td>
                  </tr>
                ))}
                {rsvps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                      No RSVPs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
