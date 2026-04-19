export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

import { auth } from '../firebase';

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  // Only aggressively throw (which trips the ErrorBoundary) for permission errors
  // This prevents transient offline/connection errors from crashing the entire app
  if (errorMessage.toLowerCase().includes('permission') || errorMessage.toLowerCase().includes('missing or insufficient permissions')) {
    alert(`Firebase Permission Error: We couldn't save this. Please check if your Firebase Rules are blocking the write!`);
    throw new Error(JSON.stringify(errInfo));
  } else if (errorMessage.toLowerCase().includes('not found')) {
     alert(`CRITICAL SETUP ERROR: Your Firebase project does not have a Firestore Database created! Please open your Firebase Console, navigate to "Firestore Database" on the left menu, and click "Create Database". Start it in production mode.`);
     throw new Error(JSON.stringify(errInfo));
  } else {
    // For other errors like offline, we can just log or alert
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
      console.warn("Firestore connection is offline or unavailable. Retrying in background...");
    } else {
      alert(`Database Error: ${errorMessage}`);
    }
  }
}
