import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BedDouble, Shield, Sparkles, Building, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginApi } from '../api/auth.api';
import { Logo } from '../components/ui/Logo';

const ROLES = [
  { role: 'STUDENT' as const, label: 'Student', icon: BedDouble, user: { id: '60d5ec49c6396b2e1480f004', name: 'Varun A K', email: 'varun@student.com', role: 'STUDENT' as const }, redirect: '/student' },
  { role: 'WARDEN' as const, label: 'Warden', icon: Shield, user: { id: '60d5ec49c6396b2e1480f003', name: 'Warden Singh', email: 'warden@hosteliq.com', role: 'WARDEN' as const }, redirect: '/admin' },
  { role: 'HOSTEL_ADMIN' as const, label: 'Admin', icon: Building, user: { id: '60d5ec49c6396b2e1480f002', name: 'Admin Sharma', email: 'admin@hosteliq.com', role: 'HOSTEL_ADMIN' as const }, redirect: '/admin' },
  { role: 'SUPER_ADMIN' as const, label: 'System', icon: Sparkles, user: { id: '60d5ec49c6396b2e1480f001', name: 'System Root', email: 'super@hosteliq.com', role: 'SUPER_ADMIN' as const }, redirect: '/admin' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [password, setPassword] = useState('HostelIQ@2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await loginApi(selectedRole.user.email, password);
      login(result.token, result.user);
      navigate(selectedRole.redirect);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side - Minimalist Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-[45%] lg:px-20 xl:px-32 relative z-10 bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="mx-auto w-full max-w-[420px] animate-fade-in">
          <div className="mb-16">
            <Logo />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3 display-font">Sign in</h1>
          <p className="text-slate-500 mb-10 text-lg">Secure access to the allocation engine.</p>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Environment Profile</label>
                <div className="flex flex-wrap gap-3">
                  {ROLES.map((roleConfig) => {
                    const Icon = roleConfig.icon;
                    const isSelected = selectedRole.role === roleConfig.role;
                    return (
                      <button
                        key={roleConfig.role}
                        type="button"
                        onClick={() => setSelectedRole(roleConfig)}
                        className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 flex-1 min-w-[80px] transition-all duration-300 ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.2)]' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-primary-700' : 'text-slate-500'}`}>{roleConfig.label}</span>
                        {isSelected && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input 
                    type="email" 
                    value={selectedRole.user.email} 
                    readOnly
                    className="pl-12 h-12 bg-slate-50/50 border-slate-200 font-medium text-slate-600 focus:bg-white transition-all rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Security Key</label>
                  <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-500 transition-colors">Forgot key?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-slate-50/50 border-slate-200 text-lg tracking-[0.25em] focus:bg-white transition-all rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 flex items-start gap-3 animate-slide-up">
                 <div className="mt-0.5 rounded-full bg-danger-100 p-1">
                   <Lock className="h-3 w-3 text-danger-600" />
                 </div>
                 <p className="text-sm text-danger-700 font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full group h-14 rounded-xl text-base shadow-xl shadow-primary-500/20" isLoading={isLoading}>
              Authenticate
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Abstract SaaS Graphic */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden sidebar-surface justify-center items-center">
        {/* Deep, rich background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-transparent to-transparent opacity-80" />
        
        {/* Animated glowing orbs */}
        <div className="absolute top-[20%] right-[15%] h-[400px] w-[400px] rounded-full bg-primary-500/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Core Visual */}
        <div className="relative z-10 w-full max-w-2xl px-12">
          <div className="glass-dark rounded-[2.5rem] p-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl border border-white/5 relative transform hover:scale-[1.02] transition-transform duration-700 ease-out">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 bg-gradient-to-br from-accent-400 to-primary-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl shadow-primary-500/30 transform rotate-6 border border-white/20">
              SmartFit AI v2.0
            </div>
            
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
               <Activity className="h-8 w-8 text-accent-400" />
            </div>

            <h2 className="text-5xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight display-font">
              Intelligent<br/>Resource<br/>Allocation.
            </h2>
            
            <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-md font-medium">
              HostelIQ utilizes multidimensional algorithmic scoring to automate and optimize campus housing distributions instantly.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                <div className="text-3xl font-black text-white mb-2 tracking-tight display-font">99.8%</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Optimization Score</div>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                <div className="text-3xl font-black text-white mb-2 tracking-tight display-font">&lt;2s</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Processing Latency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
