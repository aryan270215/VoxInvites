import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function HeadCodeInjector() {
  useEffect(() => {
    let injectedNodes: Node[] = [];

    const fetchHeadCode = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().headCode) {
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
        }
      } catch (error) {
        console.error('Error fetching global head code:', error);
      }
    };

    fetchHeadCode();

    return () => {
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
