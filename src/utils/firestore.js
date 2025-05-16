import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// User Profile Operations
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return userRef;
  } catch (error) {
    throw new Error('Error creating user profile: ' + error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

// Organizer Profile Operations
export const createOrganizerProfile = async (userId, orgData) => {
  try {
    const orgRef = doc(db, 'organizing_group', userId);
    await setDoc(orgRef, {
      orgName: orgData.name,
      email: orgData.email,
      desc: orgData.desc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return orgRef;
  } catch (error) {
    throw new Error('Error creating organizer profile: ' + error.message);
  }
};

export const getOrganizerProfile = async (userId) => {
  try {
    const orgRef = doc(db, 'organizing_group', userId);
    const orgSnap = await getDoc(orgRef);
    if (orgSnap.exists()) {
      return { id: orgSnap.id, ...orgSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error('Error fetching organizer profile: ' + error.message);
  }
};

// Event Operations
export const createEvent = async (eventData) => {
  try {
    const eventsRef = collection(db, 'events');
    const eventDoc = await addDoc(eventsRef, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return eventDoc.id;
  } catch (error) {
    throw new Error('Error creating event: ' + error.message);
  }
};

export const getEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error('Error fetching event: ' + error.message);
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error('Error updating event: ' + error.message);
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    throw new Error('Error deleting event: ' + error.message);
  }
};

export const getEventsByOrganizer = async (organizerId) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('organizing_group_id', '==', organizerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Error fetching organizer events: ' + error.message);
  }
};

// Registration Operations
export const registerForEvent = async (eventId, userId, registrationData) => {
  try {
    const registrationRef = collection(db, 'events', eventId, 'registrations');
    await setDoc(doc(registrationRef, userId), {
      ...registrationData,
      userId,
      status: 'pending',
      registeredAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error('Error registering for event: ' + error.message);
  }
};

export const getEventRegistrations = async (eventId) => {
  try {
    const registrationsRef = collection(db, 'events', eventId, 'registrations');
    const querySnapshot = await getDocs(registrationsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Error fetching event registrations: ' + error.message);
  }
};

export const updateRegistrationStatus = async (eventId, userId, status) => {
  try {
    const registrationRef = doc(db, 'events', eventId, 'registrations', userId);
    await updateDoc(registrationRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error('Error updating registration status: ' + error.message);
  }
};

// Feedback Operations
export const submitFeedback = async (eventId, studentId, feedbackData) => {
  try {
    const feedbackRef = collection(db, 'feedback');
    const docRef = await addDoc(feedbackRef, {
      feedback_id: '',
      student_id: studentId,
      rating: feedbackData.rating,
      comments: feedbackData.comments,
      date: serverTimestamp(),
    });

    console.log('Feedback successfully submitted to Firestore with doc ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting feedback: ', error);
    throw new Error('Error submitting feedback: ' + error.message);
  }
};

export const getEventFeedback = async (eventId) => {
  try {
    const feedbackRef = collection(db, 'events', eventId, 'feedback');
    const querySnapshot = await getDocs(feedbackRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Error fetching event feedback: ' + error.message);
  }
};