import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import toast from 'react-hot-toast';

const Auth = ({ adminLoginHint = false }) => {
  // ... rest of component unchanged ...
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            toast.error("reCAPTCHA expired. Please try again.");
          }
        });
      } catch (err) {
        console.error("Firebase is likely not configured yet:", err);
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      return setError('Please fill in all details first.');
    }

    // Ensure phone number starts with + for Firebase
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+')) {
      return setError('Please include your country code (e.g. +1 or +91) at the beginning of your phone number.');
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      // SMS sent. Prompt user to type the code from the message.
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast.success('OTP sent via Firebase! Please check your mobile phone.');
      
    } catch (err) {
      console.error("Firebase SMS Error:", err);
      // Reset recaptcha so the user can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Must include country code (+).');
      } else if (err.code === 'auth/invalid-api-key' || err.message.includes('API_KEY')) {
        setError('Firebase Configuration is missing! Please check firebase.js.');
      } else {
        setError(err.message || 'Failed to send OTP via Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && (!formData.name || !formData.email || !formData.password || !formData.phone)) {
      return setError('Please fill in all details first.');
    }

    setLoading(true);
    let res;

    if (isLogin) {
      res = await login(formData.email, formData.password);
      setLoading(false);
      
      if (res.success) {
        if (adminLoginHint) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message);
      }
    } else {
      // DEV MODE: Bypass Firebase OTP and directly register
      res = await register(formData.name, formData.email, formData.password, formData.phone);
      
      setLoading(false);
      if (res.success) {
        toast.success("Account created successfully!");
        navigate('/');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex-1">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/10 via-dark-bg to-dark-bg z-0"></div>
      
      <div className="max-w-md w-full space-y-8 bg-dark-surface p-10 rounded-2xl border border-dark-border relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <button onClick={() => { 
              setIsLogin(!isLogin); 
              setError(''); 
              setOtpSent(false);
              setFormData({ name: '', email: '', password: '', phone: '', otp: '' });
            }} className="font-medium text-brand-blue hover:text-brand-blue-light transition-colors cursor-pointer">
              {isLogin ? 'register for full access to sales' : 'sign in if you already have an account'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm text-center">{error}</div>}
          
          <div className="space-y-4 rounded-md shadow-sm">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input id="name" name="name" type="text" required={!isLogin} disabled={otpSent}
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-dark-border bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm disabled:opacity-50"
                  placeholder="Full Name" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required disabled={otpSent && !isLogin}
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-dark-border bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm disabled:opacity-50"
                placeholder="Email address" />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <input id="phone" name="phone" type="tel" required={!isLogin} disabled={otpSent}
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-dark-border bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm disabled:opacity-50"
                  placeholder="Phone (+CountryCode)" />
              </div>
            )}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required disabled={otpSent && !isLogin}
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-dark-border bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm disabled:opacity-50"
                placeholder="Password" />
            </div>

            {/* OTP Field - Only shown after OTP is sent */}
            {!isLogin && otpSent && (
              <div>
                <label htmlFor="otp" className="sr-only">6-Digit OTP</label>
                <input id="otp" name="otp" type="text" required={otpSent} maxLength={6}
                  value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-brand-green/50 bg-dark-bg text-white placeholder-gray-500 focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                  placeholder="Enter 6-Digit SMS Code" />
              </div>
            )}
          </div>

          {/* Invisible Recaptcha Container */}
          <div id="recaptcha-container"></div>

          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue shadow-[0_0_15px_rgba(0,85,255,0.3)] transition-all cursor-pointer disabled:opacity-50">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            
            {!isLogin && otpSent && (
              <button type="button" onClick={() => { setOtpSent(false); setFormData({...formData, otp: ''}); }} 
                className="mt-4 w-full text-sm text-gray-400 hover:text-white transition-colors cursor-pointer text-center block">
                Change phone number or details
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
