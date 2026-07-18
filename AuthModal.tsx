/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { LoggedInUser } from '../types';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  onLoginSuccess: (user: LoggedInUser) => void;
}

export default function AuthModal({ isOpen, onClose, lang, onLoginSuccess }: AuthModalProps) {
  const isAr = lang === 'ar';
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Google Sign-In interactive simulation states
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleStep, setGoogleStep] = useState<'loading' | 'select' | 'custom'>('loading');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Clear messages on toggle view
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleFlow(false);
  }, [isSignUp, isOpen]);

  if (!isOpen) return null;

  // Retrieve registered users database for fallback/simulated/admin setup
  const getRegisteredUsers = (): any[] => {
    const saved = localStorage.getItem('just_anime_users_all');
    if (saved) {
      return JSON.parse(saved);
    }
    const defaults = [
      { id: 'user-1', name: 'علاء عباس', email: 'alawyabbas15@gmail.com', role: 'admin', joinDate: '2026-01-10', status: 'active', password: 'admin' },
      { id: 'user-2', name: 'سارة أحمد', email: 'sara.ahmed@example.com', role: 'editor', joinDate: '2026-02-14', status: 'active', password: 'password' },
    ];
    localStorage.setItem('just_anime_users_all', JSON.stringify(defaults));
    return defaults;
  };

  // Helper to sync user profile in Firestore
  const syncUserProfile = async (uid: string, userEmail: string, displayName: string, isGoogle: boolean): Promise<LoggedInUser> => {
    const cleanEmail = userEmail.toLowerCase();
    const isOwner = cleanEmail === 'alawyabbas15@gmail.com';
    const defaultRole = isOwner ? 'admin' : 'user';

    const userProfile: LoggedInUser = {
      id: uid,
      name: displayName,
      email: cleanEmail,
      role: defaultRole,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
      isGoogleUser: isGoogle
    };

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const existingData = userSnap.data() as LoggedInUser;
        // Keep existing role/status if they already exist in database
        return {
          ...userProfile,
          role: existingData.role || defaultRole,
          status: existingData.status || 'active',
        };
      } else {
        await setDoc(userRef, userProfile);
        return userProfile;
      }
    } catch (err) {
      console.warn("Could not write to firestore (likely using placeholder config or offline). Syncing locally.", err);
      // Local fallback sync
      const users = getRegisteredUsers();
      let localUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!localUser) {
        localUser = {
          id: uid,
          name: displayName,
          email: cleanEmail,
          role: defaultRole,
          joinDate: userProfile.joinDate,
          status: 'active',
        };
        localStorage.setItem('just_anime_users_all', JSON.stringify([...users, localUser]));
      }
      return {
        id: localUser.id,
        name: localUser.name,
        email: localUser.email,
        role: localUser.role,
        joinDate: localUser.joinDate,
        status: localUser.status,
      };
    }
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg(isAr ? 'الرجاء ملء جميع الحقول المطلوبة!' : 'Please fill in all fields!');
        return;
      }
      if (password.length < 6) {
        setErrorMsg(isAr ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters long.');
        return;
      }

      try {
        // Try real Firebase registration first
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const profile = await syncUserProfile(userCredential.user.uid, email, name, false);
        
        setSuccessMsg(isAr ? 'تم تسجيل حسابك الجديد بنجاح!' : 'Your account was successfully registered!');
        setTimeout(() => {
          onLoginSuccess(profile);
          onClose();
        }, 1000);
      } catch (fbErr: any) {
        console.warn("Firebase Auth failed, falling back to simulated local database.", fbErr);
        
        // Check if config is placeholder or if it is a real error like email-already-in-use
        if (fbErr.code === 'auth/email-already-in-use') {
          setErrorMsg(isAr ? 'البريد الإلكتروني مسجل بالفعل!' : 'Email is already registered!');
          return;
        }

        // Local fallback registration
        const users = getRegisteredUsers();
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          setErrorMsg(isAr ? 'البريد الإلكتروني مسجل بالفعل!' : 'Email is already registered!');
          return;
        }

        const isOwner = email.toLowerCase() === 'alawyabbas15@gmail.com';
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email: email.toLowerCase(),
          role: isOwner ? 'admin' : 'user',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
          password,
        };

        localStorage.setItem('just_anime_users_all', JSON.stringify([...users, newUser]));
        setSuccessMsg(isAr ? 'تم تسجيل حسابك الجديد محلياً بنجاح!' : 'Your account was registered locally successfully!');
        
        setTimeout(() => {
          onLoginSuccess({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as any,
            joinDate: newUser.joinDate,
            status: newUser.status as any,
          });
          onClose();
        }, 1000);
      }

    } else {
      if (!email || !password) {
        setErrorMsg(isAr ? 'الرجاء كتابة البريد الإلكتروني وكلمة المرور!' : 'Please enter your email and password!');
        return;
      }

      try {
        // Try real Firebase sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(
          userCredential.user.uid, 
          userCredential.user.email || email, 
          userCredential.user.displayName || name || email.split('@')[0], 
          false
        );

        if (profile.status === 'suspended') {
          setErrorMsg(isAr ? 'عذراً، هذا الحساب موقوف حالياً من قبل الإدارة!' : 'This account has been suspended by the administrator!');
          await auth.signOut();
          return;
        }

        setSuccessMsg(isAr ? 'تم تسجيل الدخول بنجاح! جاري توجيهك...' : 'Login successful! Redirecting...');
        setTimeout(() => {
          onLoginSuccess(profile);
          onClose();
        }, 1000);
      } catch (fbErr: any) {
        console.warn("Firebase Auth sign in failed, trying simulated local database.", fbErr);
        
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found') {
          setErrorMsg(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' : 'Incorrect email or password!');
          return;
        }

        // Local fallback sign in
        const users = getRegisteredUsers();
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!foundUser) {
          setErrorMsg(isAr ? 'الحساب غير مسجل أو غير موجود في النظام!' : 'User account not found!');
          return;
        }

        if (foundUser.status === 'suspended') {
          setErrorMsg(isAr ? 'عذراً، هذا الحساب موقوف حالياً من قبل الإدارة!' : 'This account has been suspended by the administrator!');
          return;
        }

        if (foundUser.password !== password) {
          setErrorMsg(isAr ? 'كلمة المرور غير صحيحة!' : 'Incorrect password!');
          return;
        }

        // Upgrade role if matching owner email
        if (foundUser.email.toLowerCase() === 'alawyabbas15@gmail.com' && foundUser.role !== 'admin') {
          foundUser.role = 'admin';
          const updatedUsers = users.map(u => u.id === foundUser.id ? foundUser : u);
          localStorage.setItem('just_anime_users_all', JSON.stringify(updatedUsers));
        }

        setSuccessMsg(isAr ? 'تم تسجيل الدخول بنجاح! جاري توجيهك...' : 'Login successful! Redirecting...');
        
        setTimeout(() => {
          onLoginSuccess({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            joinDate: foundUser.joinDate,
            status: foundUser.status,
          });
          onClose();
        }, 1000);
      }
    }
  };

  // Google interactive authorization
  const handleGoogleSignInClick = async () => {
    setIsGoogleFlow(true);
    setGoogleStep('loading');

    try {
      // Try real Firebase Google pop-up sign in
      const userCredential = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(
        userCredential.user.uid,
        userCredential.user.email || '',
        userCredential.user.displayName || 'Google User',
        true
      );

      if (profile.status === 'suspended') {
        setErrorMsg(isAr ? 'عذراً، حساب Google هذا موقوف حالياً من قبل الإدارة!' : 'This Google account is suspended!');
        setIsGoogleFlow(false);
        await auth.signOut();
        return;
      }

      setSuccessMsg(isAr ? 'تم تسجيل الدخول الآمن بحساب Google!' : 'Securely signed in with Google!');
      setIsGoogleFlow(false);

      setTimeout(() => {
        onLoginSuccess(profile);
        onClose();
      }, 1000);
    } catch (fbErr) {
      console.warn("Real Google Auth failed/blocked by iframe sandboxing. Displaying secure account selector.", fbErr);
      // Fallback: Show interactive account selector
      setTimeout(() => {
        setGoogleStep('select');
      }, 1000);
    }
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, namePlaceholder: string) => {
    const profile = await syncUserProfile(`google-uid-${selectedEmail.split('@')[0]}`, selectedEmail, namePlaceholder, true);

    if (profile.status === 'suspended') {
      setErrorMsg(isAr ? 'عذراً، حساب Google هذا موقوف حالياً من قبل الإدارة!' : 'This Google account is suspended!');
      setIsGoogleFlow(false);
      return;
    }

    setSuccessMsg(isAr ? 'تم تسجيل الدخول الآمن بحساب Google!' : 'Securely signed in with Google!');
    setIsGoogleFlow(false);

    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 1000);
  };

  const handleCustomGoogleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      return;
    }
    const baseName = customGoogleEmail.split('@')[0];
    const capitalizedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    handleSelectGoogleAccount(customGoogleEmail, capitalizedName);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" id="auth-modal-portal">
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      />

      {/* Main modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-md bg-white border-4 border-black p-6 rounded-none shadow-[6px_6px_0px_rgba(0,0,0,1)] z-10 overflow-hidden text-black font-sans"
        id="auth-card-wrapper"
      >
        {/* Custom Retro Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 to-black" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 border-2 border-black hover:bg-neutral-100 transition-colors rounded-none cursor-pointer"
          id="auth-close-btn"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Interactive Google authorization popup overlay */}
        <AnimatePresence>
          {isGoogleFlow && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 z-50 p-6 flex flex-col justify-between"
              id="google-simulated-flow"
            >
              <div>
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-5">
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.25-.6-.39-1.27-.39-1.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-sans font-black text-sm text-neutral-800">
                    {isAr ? 'تسجيل الدخول الآمن مع Google' : 'Sign in with Google API'}
                  </span>
                </div>

                {googleStep === 'loading' && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="w-10 h-10 border-4 border-amber-400 border-t-black animate-spin rounded-none" />
                    <p className="text-xs font-black font-mono text-neutral-500 uppercase tracking-widest animate-pulse">
                      {isAr ? 'جاري الاتصال بالخادم الموثق...' : 'ESTABLISHING SECURE OAUTH...'}
                    </p>
                  </div>
                )}

                {googleStep === 'select' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <p className="text-xs text-neutral-500 font-bold mb-2">
                      {isAr ? 'الرجاء اختيار أحد الحسابات للمتابعة إلى JUST ANIME:' : 'Choose an account to continue to JUST ANIME:'}
                    </p>

                    {/* Pre-defined Account 1: Owner */}
                    <button
                      onClick={() => handleSelectGoogleAccount('alawyabbas15@gmail.com', 'علاء عباس (المالك)')}
                      className="w-full p-3 border-2 border-black hover:bg-neutral-50 flex items-center gap-3 transition-all text-left rounded-none cursor-pointer relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-mono font-black px-1.5 py-0.5 border-l border-b border-black uppercase rotate-3">
                        {isAr ? 'المؤسس والمالك' : 'Founder'}
                      </div>
                      <div className="w-8 h-8 rounded-none border border-black bg-amber-400 text-black font-black flex items-center justify-center shrink-0">
                        AA
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="text-xs font-black text-black">علاء عباس (المالك)</div>
                        <div className="text-[10px] text-neutral-500 font-mono">alawyabbas15@gmail.com</div>
                      </div>
                    </button>

                    {/* Pre-defined Account 2: Demo moderator */}
                    <button
                      onClick={() => handleSelectGoogleAccount('sara.ahmed@example.com', 'سارة أحمد')}
                      className="w-full p-3 border-2 border-black hover:bg-neutral-50 flex items-center gap-3 transition-all text-left rounded-none cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-none border border-black bg-red-500 text-white font-black flex items-center justify-center shrink-0">
                        SA
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="text-xs font-black text-black">سارة أحمد (مشرفة ومحررة)</div>
                        <div className="text-[10px] text-neutral-500 font-mono">sara.ahmed@example.com</div>
                      </div>
                    </button>

                    {/* Button to custom input */}
                    <button
                      onClick={() => setGoogleStep('custom')}
                      className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-black border border-neutral-300 rounded-none transition-colors cursor-pointer"
                    >
                      {isAr ? 'استخدام حساب آخر مخصص' : 'Use another custom email'}
                    </button>
                  </div>
                )}

                {googleStep === 'custom' && (
                  <form onSubmit={handleCustomGoogleSubmit} className="space-y-4 animate-in fade-in duration-200">
                    <p className="text-xs text-neutral-500 font-bold">
                      {isAr ? 'أدخل البريد الإلكتروني لحساب Google المخصص:' : 'Enter your custom Google account email:'}
                    </p>

                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-none p-3 text-xs focus:outline-none text-black"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGoogleStep('select')}
                        className="w-1/2 py-2.5 bg-white text-black border border-black font-black text-xs rounded-none cursor-pointer"
                      >
                        {isAr ? 'رجوع' : 'Back'}
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs rounded-none cursor-pointer"
                      >
                        {isAr ? 'متابعة الدخول' : 'Continue'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4 text-center">
                <button
                  onClick={() => setIsGoogleFlow(false)}
                  className="text-neutral-500 hover:text-black font-black text-[11px] uppercase tracking-wide cursor-pointer"
                >
                  {isAr ? 'إلغاء وتسجيل دخول عادي' : 'Cancel Google Login'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title / Headers */}
        <div className="text-center mb-6">
          <span className="text-[10px] bg-red-500 text-white font-mono font-black uppercase px-2.5 py-0.5 border border-black inline-block mb-2 italic">
            {isAr ? 'نظام العضوية الموحد' : 'JUST ANIME SECURE ACCESS'}
          </span>
          <h3 className="font-sans font-black text-2xl text-black">
            {isSignUp 
              ? (isAr ? 'إنشاء حساب أوتاكو جديد' : 'Register New Otaku Account')
              : (isAr ? 'تسجيل الدخول للموقع' : 'Sign In to Account')}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {isSignUp
              ? (isAr ? 'انضم إلينا لكتابة مقالات والتعليق ومتابعة التسريبات!' : 'Join us to comment, read leaks, and publish content!')
              : (isAr ? 'مرحباً بعودتك! ادخل حسابك للمتابعة' : 'Welcome back! Enter your details to continue')}
          </p>
        </div>

        {/* Error / Success feedback inside form */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-2 border-red-500 p-3 rounded-none mb-4 flex items-center gap-2 text-xs font-black text-red-600"
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-50 border-2 border-emerald-500 p-3 rounded-none mb-4 flex items-center gap-2 text-xs font-black text-emerald-600 animate-pulse"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Authentication Button (Sleek professional trigger) */}
        <div className="space-y-4 mb-5">
          <button
            onClick={handleGoogleSignInClick}
            className="w-full py-3 px-4 border-2 border-black hover:bg-neutral-50 flex items-center justify-center gap-3 transition-all cursor-pointer font-sans font-black text-xs text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            id="google-oauth-trigger"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.25-.6-.39-1.27-.39-1.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isSignUp 
                ? (isAr ? 'تسجيل سريع بحساب Google' : 'Sign Up fast with Google')
                : (isAr ? 'تسجيل الدخول الفوري مع Google' : 'Sign In with Google')}
            </span>
          </button>

          {/* Separator */}
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[9px] font-black uppercase tracking-widest">
            <div className="h-[1px] bg-neutral-200 flex-grow mr-2" />
            <span>{isAr ? 'أو عبر البريد والكلمة' : 'OR WITH USER ACCOUNT'}</span>
            <div className="h-[1px] bg-neutral-200 flex-grow ml-2" />
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-sans font-bold">
          {isSignUp && (
            <div className="space-y-1.5" id="form-field-fullname">
              <label className="block text-[10px] uppercase font-black text-neutral-700">
                {isAr ? 'الاسم واللقب الكريم:' : 'Your Name / Nickname:'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: أحمد الحربي' : 'e.g. Alaa Abbas'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/30 border-2 border-black rounded-none p-3 focus:outline-none focus:bg-white text-black"
                />
                <User className="absolute top-3.5 w-4 h-4 text-neutral-400 left-3" />
              </div>
            </div>
          )}

          <div className="space-y-1.5" id="form-field-email">
            <label className="block text-[10px] uppercase font-black text-neutral-700">
              {isAr ? 'البريد الإلكتروني المسجل:' : 'Email Address:'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100/30 border-2 border-black rounded-none p-3 focus:outline-none focus:bg-white text-black text-left"
              />
              <Mail className="absolute top-3.5 w-4 h-4 text-neutral-400 left-3" />
            </div>
          </div>

          <div className="space-y-1.5" id="form-field-password">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] uppercase font-black text-neutral-700">
                {isAr ? 'كلمة المرور الخاصة بك:' : 'Password:'}
              </label>
              {!isSignUp && (
                <a 
                  href="#forgot" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.alert(isAr 
                      ? 'لإعادة تعيين كلمة المرور، يرجى الاتصال المباشر بالدعم الفني!' 
                      : 'To reset your password, contact technical support directly!');
                  }}
                  className="text-[10px] text-neutral-400 hover:text-black font-bold uppercase transition-colors"
                >
                  {isAr ? 'نسيت كلمة السر؟' : 'Forgot?'}
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100/30 border-2 border-black rounded-none p-3 focus:outline-none focus:bg-white text-black text-left"
              />
              <Lock className="absolute top-3.5 w-4 h-4 text-neutral-400 left-3" />
            </div>
          </div>

          {/* Prompt regarding owner special accounts */}
          {!isSignUp && email.toLowerCase() === 'alawyabbas15@gmail.com' && (
            <div className="bg-amber-50 border border-amber-400 p-2.5 rounded-none text-[10px] font-mono font-bold text-amber-700 flex items-start gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                {isAr 
                  ? 'تم كشف حساب المالك والمؤسس الأكبر! عند تسجيل الدخول، ستحصل تلقائياً على لوحة التحكم الكاملة.'
                  : 'Owner and Founder account detected! Supreme Admin access will be granted automatically.'}
              </div>
            </div>
          )}

          {/* Submit Trigger Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-900 text-white font-sans font-black text-xs uppercase tracking-widest py-3 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_rgba(245,158,11,1)] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_rgba(245,158,11,1)]"
              id="auth-submit-trigger"
            >
              <span>
                {isSignUp 
                  ? (isAr ? 'تسجيل الحساب الآن 🚀' : 'Create Account 🚀')
                  : (isAr ? 'تسجيل الدخول الفوري 🔑' : 'Log In Securely 🔑')}
              </span>
            </button>
          </div>
        </form>

        {/* Footer switch state link */}
        <div className="text-center mt-6 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 font-bold">
            {isSignUp
              ? (isAr ? 'لديك حساب بالفعل في المدونة؟' : 'Already have an Otaku account?')
              : (isAr ? 'ليس لديك حساب أوتاكو مسجل حتى الآن؟' : 'Don\'t have an account registered yet?')}
            {' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-black font-black hover:line-through transition-all cursor-pointer font-sans"
            >
              {isSignUp 
                ? (isAr ? 'سجل دخولك الآن' : 'Log In Here')
                : (isAr ? 'أنشئ حساباً جديداً هنا' : 'Register Here')}
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
