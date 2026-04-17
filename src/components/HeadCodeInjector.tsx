import { useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function HeadCodeInjector() {
  const injected = useRef(false);

  useEffect(() => {
    let injectedNodes: Node[] = [];

    const docRef = doc(db, 'settings', 'global');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      // If we already injected or the doc doesn't have headCode, do nothing
      // We only want to inject once per session to avoid duplicate scripts
      if (injected.current || !docSnap.exists() || !docSnap.data().headCode) {
        return;
      }
      
      injected.current = true;
      const headCode = docSnap.data().headCode;
      
      // Create a range to properly parse the string into a DocumentFragment
      const range = document.createRange();
      range.selectNode(document.head);
      const fragment = range.createContextualFragment(headCode);
      
      // Recreate script tags to ensure they execute
      const scripts = fragment.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
      
      // Keep track of the nodes so we can clean them up if needed
      injectedNodes = Array.from(fragment.childNodes);
      
      document.head.appendChild(fragment);
    }, (error) => {
      // Ignore offline errors, onSnapshot will automatically retry
      if (error.message && error.message.includes('offline')) {
        return;
      }
      console.error('Error fetching global head code:', error);
    });

    return () => {
      unsubscribe();
      // Cleanup injected nodes if component unmounts
      injectedNodes.forEach(node => {
        if (node.parentNode === document.head) {
          document.head.removeChild(node);
        }
      });
    };
  }, []);

  return null;
}
