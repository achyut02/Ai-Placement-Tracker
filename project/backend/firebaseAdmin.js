const admin = require('firebase-admin');

// Initialize Firebase Admin with dev fallback
const hasFirebaseEnv = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (!admin.apps.length) {
  if (hasFirebaseEnv) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    // Allow server to boot in development without Firebase credentials
    admin.initializeApp();
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[firebaseAdmin] Missing Firebase env. Running with default app (limited capabilities).');
    }
  }
}

const db = admin.firestore();

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (innerError) {
      if (process.env.NODE_ENV !== 'production' && !hasFirebaseEnv) {
        // In dev without Firebase env, accept any token for local testing
        decodedToken = { uid: 'dev-user', email: 'dev@example.com' };
      } else {
        throw innerError;
      }
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = {
  admin,
  db,
  verifyFirebaseToken
};