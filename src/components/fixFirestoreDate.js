import { doc, updateDoc, getDoc, getDocs, query, where, collection, setDoc } from 'firebase/firestore';
import "../firebase.js"
import "../utils/firestore.js";

const fixFirestoreData = async () => {
  // Fix organizing_group/lAbgGrL81NTjBGp2fzf7zdc4JcB3
  const orgRef = doc(db, 'organizing_group', 'lAbgGrL81NTjBGp2fzf7zdc4JcB3');
  const orgSnap = await getDoc(orgRef);
  if (orgSnap.exists()) {
    const orgData = orgSnap.data();
    if (orgData.name && !orgData.orgName) {
      await updateDoc(orgRef, {
        orgName: orgData.name,
        name: null,
        updatedAt: serverTimestamp(),
      });
      console.log('Updated organizing_group/lAbgGrL81NTjBGp2fzf7zdc4JcB3');
    }
  }

  // Fix events/kisWOIgdGHD06TsoQsZN
  const eventId = 'kisWOIgdGHD06TsoQsZN';
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);
  if (!eventSnap.exists()) {
    console.log('Event not found');
    return;
  }

  const eventData = eventSnap.data();
  const updates = {};
  if (eventData.organizing_group_id === 'orgtest@gmail.com') {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', 'orgtest@gmail.com'), where('role', '==', 'organizer'));
    const userSnap = await getDocs(q);
    if (!userSnap.empty) {
      const organizerUid = userSnap.docs[0].id;
      updates.organizing_group_id = organizerUid;
      const orgRef = doc(db, 'organizing_group', organizerUid);
      const orgSnap = await getDoc(orgRef);
      if (!orgSnap.exists()) {
        console.warn(`Creating missing organizing_group/${organizerUid}`);
        await setDoc(orgRef, {
          orgName: 'Org Test',
          email: 'orgtest@gmail.com',
          desc: 'Default organizer description',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      console.warn('No organizer found. Creating new organizer.');
      const newUid = doc(collection(db, 'users')).id; // Generate new UID
      await setDoc(doc(db, 'users', newUid), {
        name: 'Org Test',
        email: 'orgtest@gmail.com',
        role: 'organizer',
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'organizing_group', newUid), {
        orgName: 'Org Test',
        email: 'orgtest@gmail.com',
        desc: 'Default organizer description',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      updates.organizing_group_id = newUid;
    }
  }

  if (eventData.type === '12') {
    updates.type = 'Workshop';
  }
  if (eventData.description === 'w') {
    updates.description = 'No description provided';
  }
  if (!eventData.imageUrl) {
    updates.imageUrl = null;
  }
  if (!eventData.participants) {
    updates.participants = 0;
  }
  if (eventData.image_name !== undefined) {
    updates.image_name = null;
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(eventRef, updates);
    console.log(`Updated event ${eventId}`);
  } else {
    console.log('No event updates needed');
  }
};

fixFirestoreData().catch(console.error);