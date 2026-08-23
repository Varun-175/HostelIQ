import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BedDouble, Shield, Sparkles, Building, Lock, Mail, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginApi } from '../api/auth.api';
import { Logo } from '../components/ui/Logo';

const ROLES = [
  { role: 'STUDENT' as const, label: 'Student', icon: BedDouble, token: 'STUDENT_TOKEN', user: { id: '60d5ec49c6396b2e1480f004', name: 'Varun A K', email: 'varun@student.com', role: 'STUDENT' as const, permissions: ['allocation.request'] }, redirect: '/student' },
  { role: 'WARDEN' as const, label: 'Warden', icon: Shield, token: 'WARDEN_TOKEN', user: { id: '60d5ec49c6396b2e1480f003', name: 'Warden Singh', email: 'warden@hosteliq.com', role: 'WARDEN' as const, permissions: ['allocation.approve', 'allocation.manage', 'student.read', 'room.read', 'analytics.read'] }, redirect: '/admin' },
  { role: 'HOSTEL_ADMIN' as const, label: 'Admin', icon: Building, token: 'HOSTEL_ADMIN_TOKEN', user: { id: '60d5ec49c6396b2e1480f002', name: 'Admin Sharma', email: 'admin@hosteliq.com', role: 'HOSTEL_ADMIN' as const, permissions: ['room.manage', 'allocation.manage', 'student.read', 'analytics.read'] }, redirect: '/admin' },
  { role: 'SUPER_ADMIN' as const, label: 'Super Admin', icon: Sparkles, token: 'SUPER_ADMIN_TOKEN', user: { id: '60d5ec49c6396b2e1480f001', name: 'Super Admin', email: 'super@hosteliq.com', role: 'SUPER_ADMIN' as const, permissions: ['*'] }, redirect: '/admin' },
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
      setError(requestError.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 xl:px-32 relative z-10 bg-white shadow-2xl">
        <div className="mx-auto w-full max-w-md animate-slide-up">
          <div className="mb-10 flex items-center gap-3">
            <Logo labelClassName="text-2xl font-black" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to your account to continue.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl sm:grid-cols-4">
                {ROLES.map((roleConfig) => {
                  const Icon = roleConfig.icon;
                  const isSelected = selectedRole.role === roleConfig.role;
                  return (
                    <button
                      key={roleConfig.role}
                      type="button"
                      onClick={() => setSelectedRole(roleConfig)}
                      className={`flex min-w-0 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all ${
                        isSelected ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{roleConfig.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input 
                    type="email" 
                    value={selectedRole.user.email} 
                    readOnly
                    className="pl-10 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200 text-lg tracking-widest"
                  />
                </div>
              </div>
            </div>

            {error && <p className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700" role="alert">{error}</p>}

            <Button type="submit" className="w-full group" size="lg" isLoading={isLoading}>
              Sign In
              {!isLoading && <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </Button>
            
            <div className="text-center mt-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                Hackathon Demo
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Hero Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
        {/* Animated background elements */}
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Glassmorphic decorative cards */}
        <div className="relative z-10 w-full max-w-lg mx-auto">
          <div className="glass-dark border border-white/10 rounded-2xl p-10 shadow-2xl backdrop-blur-2xl relative transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
              Powered by SmartFit AI
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Smarter Hostel<br/>Allocations.
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              HostelIQ uses advanced dimensions like academic performance, behavior, and department balance to find the perfect room for every student.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-slate-400">Match Accuracy</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">5x</div>
                <div className="text-sm text-slate-400">Faster Processing</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-16 -right-12 glass border border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success-400" />
              </div>
              <div>
                <div className="text-white font-bold">Secure Override</div>
                <div className="text-sm text-slate-300">Admin control guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
