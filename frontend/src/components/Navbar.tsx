import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Brain, Sun, Moon, Menu, X, LogOut, User,
    Code2, BarChart3, LayoutDashboard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Navbar() {
    const { theme, toggleTheme } = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // Dashboard, Practice and Analysis only for logged-in users.
    // When logged out, no nav links are displayed in the center.
    const alwaysLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ];
    const authLinks = [
        { to: '/practice', label: 'Practice', icon: <Code2 size={16} /> },
        { to: '/analytics', label: 'Analysis', icon: <BarChart3 size={16} /> },
    ];
    const navLinks = user ? [...alwaysLinks, ...authLinks] : [];

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 100,
                background: 'rgba(6, 7, 27, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-glass)',
            }}
        >
            <div className="nav-container">
                {!user ? (
                    <>
                        {/* ─── Spacer for alignment ─── */}
                        <div style={{ flex: 1 }} />

                        {/* ─── Center: Logo ─── */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Link to="/dashboard" className="nav-logo">
                                <div className="nav-logo-icon">
                                    <Brain size={18} color="white" />
                                </div>
                                <span className="nav-logo-text">
                                    Logic<span className="gradient-text">Builder</span>
                                </span>
                            </Link>
                        </div>

                        {/* ─── Right: Theme Toggle ─── */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                                onClick={toggleTheme}
                                className="theme-btn"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* ─── Left: Logo ─────────────────────────── */}
                        <div className="nav-left">
                            <Link to="/dashboard" className="nav-logo">
                                <div className="nav-logo-icon">
                                    <Brain size={18} color="white" />
                                </div>
                                <span className="nav-logo-text">
                                    Logic<span className="gradient-text">Builder</span>
                                </span>
                            </Link>
                        </div>

                        {/* ─── Center: Nav Links ──────────────────── */}
                        <div className="nav-center nav-desktop">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`nav-link ${isActive(link.to) || (link.to === '/dashboard' && location.pathname === '/') ? 'active' : ''}`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* ─── Right: Theme & Auth ────────────────── */}
                        <div className="nav-right nav-desktop">
                            <button
                                onClick={toggleTheme}
                                className="theme-btn"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </button>

                            {user && (
                                <button onClick={handleLogout} className="logout-btn">
                                    <LogOut size={15} /> Logout
                                </button>
                            )}
                        </div>

                        {/* ─── Mobile: Theme + Hamburger ──────────── */}
                        <div className="nav-mobile-actions">
                            <button onClick={toggleTheme} className="theme-btn">
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </button>
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="theme-btn">
                                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ─── Mobile Menu ────────────────────────────── */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="nav-mobile-menu"
                >
                    <>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`nav-mobile-link ${isActive(link.to) ? 'active' : ''}`}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={() => { handleLogout(); setMobileOpen(false); }}
                                className="nav-mobile-logout"
                            >
                                <div className="nav-mobile-logout-inner">
                                    <LogOut size={15} /> Logout
                                </div>
                            </button>
                        )}
                    </>
                </motion.div>
            )}

            <style>{`
                .nav-container {
                    width: 100%;
                    max-width: 100%;
                    padding: 0 24px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;
                }
                .nav-left {
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                }
                .nav-center {
                    flex: 2;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .nav-right {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 12px;
                }
                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    flex-shrink: 0;
                    transition: transform 0.2s ease;
                }
                .nav-logo:hover {
                    transform: scale(1.02);
                }
                .nav-logo-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--accent-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav-logo-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .nav-link {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: transparent;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    color: var(--text-primary);
                    background: rgba(124, 92, 252, 0.08);
                    transform: translateY(-1px);
                }
                .nav-link.active {
                    font-weight: 600;
                    color: var(--accent-primary);
                    background: rgba(124, 92, 252, 0.12);
                }
                .theme-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-glass);
                    border: 1px solid var(--border-glass);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .theme-btn:hover {
                    color: var(--accent-primary);
                    border-color: rgba(124, 92, 252, 0.3);
                    background: rgba(124, 92, 252, 0.05);
                    transform: translateY(-1px);
                }
                .logout-btn {
                    padding: 8px 18px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: transparent;
                    border: 1px solid var(--border-glass);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                .logout-btn:hover {
                    color: #ff6b6b;
                    border-color: rgba(255, 107, 107, 0.3);
                    background: rgba(255, 107, 107, 0.05);
                    transform: translateY(-1px);
                }
                .login-btn {
                    padding: 8px 20px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--accent-primary);
                    background: rgba(124, 92, 252, 0.12);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .login-btn:hover {
                    background: rgba(124, 92, 252, 0.2);
                    transform: translateY(-1px);
                }
                .nav-mobile-menu {
                    padding: 8px 24px 20px;
                    border-top: 1px solid var(--border-glass);
                    background: rgba(6, 7, 27, 0.95);
                }
                .nav-mobile-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 0;
                    font-size: 1rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    border-bottom: 1px solid var(--border-glass);
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .nav-mobile-link:hover {
                    color: var(--text-primary);
                }
                .nav-mobile-link.active {
                    color: var(--accent-primary);
                    font-weight: 600;
                }
                .nav-mobile-logout {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 0 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fff;
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                }
                .nav-mobile-logout-inner {
                    padding: 10px 20px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #f85070 0%, #ff6b6b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    transition: opacity 0.2s ease;
                }
                .nav-mobile-logout-inner:hover {
                    opacity: 0.9;
                }
                .nav-mobile-login {
                    display: flex;
                    margin-top: 16px;
                    padding: 12px 24px;
                    border-radius: 12px;
                    color: white;
                    background: var(--accent-gradient);
                    text-decoration: none;
                    font-weight: 600;
                    justify-content: center;
                    align-items: center;
                    font-size: 1rem;
                    transition: opacity 0.2s ease;
                }
                .nav-mobile-login:hover {
                    opacity: 0.9;
                }
                .nav-mobile-actions { display: none; }
                @media (max-width: 860px) {
                    .nav-desktop { display: none !important; }
                    .nav-mobile-actions { display: flex !important; gap: 8px; }
                    .nav-left { flex: none; }
                }
                @media (min-width: 861px) {
                    .nav-mobile-menu { display: none !important; }
                    .nav-mobile-actions { display: none !important; }
                }
            `}</style>
        </motion.nav>
    );
}
