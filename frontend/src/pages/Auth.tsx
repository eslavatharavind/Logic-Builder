import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { Brain, Loader2, AlertTriangle, Eye, EyeOff, User, Mail, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Auth = () => {
    const navigate = useNavigate();
    const { theme } = useStore();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/dashboard');
        };
        checkUser();
    }, [navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error } = isSignUp
                ? await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { username } }
                })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            if (isSignUp) {
                if (data.user && data.session) {
                    navigate('/dashboard');
                } else {
                    alert('Check your email for the confirmation link!');
                }
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.78rem', fontWeight: 500,
        color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
        marginBottom: 6, marginLeft: 2,
        textTransform: 'uppercase', letterSpacing: '0.04em',
    };

    const inputWrapStyle: React.CSSProperties = {
        position: 'relative', marginBottom: 18,
    };

    const iconStyle: React.CSSProperties = {
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af',
        pointerEvents: 'none',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: isDark ? '#06071b' : '#f0f4f8',
            transition: 'background 0.3s ease',
        }}>
            {/* ─── Background: Lamp Effect (Absolute) ─── */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0, pointerEvents: 'none',
                opacity: isDark ? 1 : 0.4,
                transition: 'opacity 0.3s ease',
            }}>
                {/* Lamp fixture */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 80, height: 30,
                    background: isDark ? 'linear-gradient(180deg, rgba(42, 42, 74, 0.8) 0%, rgba(26, 26, 58, 0.8) 100%)' : 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%)',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                }}>
                    <div style={{
                        width: 16, height: 8, borderRadius: '50%',
                        background: '#fff',
                        boxShadow: `0 0 15px 6px ${isDark ? 'rgba(124, 92, 252, 0.6)' : 'rgba(124, 92, 252, 0.3)'}, 0 0 40px 15px ${isDark ? 'rgba(124, 92, 252, 0.25)' : 'rgba(124, 92, 252, 0.1)'}`,
                        marginBottom: -2,
                    }} />
                </div>

                {/* Outer light cone */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    style={{
                        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', transformOrigin: 'top center',
                        width: 0, height: 0,
                        borderLeft: '400px solid transparent', borderRight: '400px solid transparent',
                        borderTop: '800px solid rgba(124, 92, 252, 0.03)',
                        filter: 'blur(1px)',
                    }}
                />

                {/* Inner brighter cone */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    style={{
                        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', transformOrigin: 'top center',
                        width: 0, height: 0,
                        borderLeft: '200px solid transparent', borderRight: '200px solid transparent',
                        borderTop: '700px solid rgba(124, 92, 252, 0.05)',
                        filter: 'blur(2px)',
                    }}
                />

                {/* Glow pulse */}
                <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                        width: 300, height: 300, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124, 92, 252, 0.2) 0%, transparent 70%)',
                    }}
                />

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [100 + i * 50, 400 + i * 40, 100 + i * 50],
                            x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 8), (i % 2 === 0 ? 1 : -1) * (30 + i * 5), (i % 2 === 0 ? -1 : 1) * (20 + i * 8)],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 5 + i * 0.5, delay: i * 0.3, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute', width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: '50%',
                            background: i % 2 === 0 ? 'rgba(124, 92, 252, 0.6)' : 'rgba(92, 160, 252, 0.5)',
                            boxShadow: `0 0 ${4 + i * 2}px ${i % 2 === 0 ? 'rgba(124, 92, 252, 0.3)' : 'rgba(92, 160, 252, 0.25)'}`,
                            left: `${35 + (i % 7) * 5}%`,
                        }}
                    />
                ))}
            </div>

            {/* ─── Centered Auth Card ─── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    width: '100%', maxWidth: 380,
                    margin: '0 20px',
                    padding: '36px 32px',
                    position: 'relative',
                    zIndex: 10,
                    borderRadius: 24,
                    // Dynamic Glassmorphism (dark mode now much more transparent)
                    background: isDark ? 'rgba(10, 10, 25, 0.2)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'var(--accent-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 24,
                        boxShadow: '0 8px 30px rgba(124, 92, 252, 0.3)',
                    }}
                >
                    <Brain size={26} color="white" />
                </motion.div>

                <h2 style={{
                    fontSize: '1.8rem', fontWeight: 800, marginBottom: 8, textAlign: 'center',
                    color: isDark ? '#fff' : '#111827'
                }}>
                    {isSignUp ? 'Create Account' : 'Welcome '}
                    {!isSignUp && <span className="gradient-text">Back!</span>}
                </h2>

                <p style={{
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
                    fontSize: '0.9rem', marginBottom: 32, textAlign: 'center'
                }}>
                    {isSignUp ? 'Join LogicBuilder and master algorithms' : 'Please enter your details'}
                </p>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            width: '100%', background: 'rgba(248, 80, 112, 0.1)',
                            border: '1px solid rgba(248, 80, 112, 0.2)',
                            padding: '12px 16px', borderRadius: 12,
                            color: 'var(--error)', fontSize: '0.85rem',
                            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
                        }}
                    >
                        <AlertTriangle size={18} /> {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>

                    {isSignUp && (
                        <div style={inputWrapStyle}>
                            <label style={labelStyle}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={iconStyle} />
                                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required
                                    style={{
                                        width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                                        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                        color: isDark ? '#fff' : '#111827',
                                        outline: 'none', transition: 'all 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                                />
                            </div>
                        </div>
                    )}

                    <div style={inputWrapStyle}>
                        <label style={labelStyle}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={iconStyle} />
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{
                                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                                    background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                    color: isDark ? '#fff' : '#111827',
                                    outline: 'none', transition: 'all 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            />
                        </div>
                    </div>

                    <div style={{ ...inputWrapStyle, marginBottom: 28 }}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={iconStyle} />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{
                                    width: '100%', padding: '12px 42px 12px 42px', borderRadius: 10,
                                    background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                    color: isDark ? '#fff' : '#111827',
                                    outline: 'none', transition: 'all 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af',
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="btn-primary" disabled={loading}
                        style={{
                            width: '100%', marginBottom: 24, padding: '14px', fontSize: '0.95rem', fontWeight: 700, borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: 'var(--accent-gradient)', color: '#fff', border: 'none',
                            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <><Sparkles size={18} /> {isSignUp ? 'Create Account' : 'Sign In'}</>
                        )}
                    </motion.button>
                </form>

                <p style={{ fontSize: '0.88rem', color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                        style={{ color: 'var(--accent-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;
