import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const getUserRole = async (email) => {
  const studentQuery = query(collection(db, 'students'), where('email', '==', email));
  const organizerQuery = query(collection(db, 'organizing_group'), where('email', '==', email));

  const [studentSnap, organizerSnap] = await Promise.all([
    getDocs(studentQuery),
    getDocs(organizerQuery),
  ]);

  if (!studentSnap.empty) return 'student';
  if (!organizerSnap.empty) return 'organizer';
  return null;
};
