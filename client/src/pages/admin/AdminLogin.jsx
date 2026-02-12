import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { loginAdmin, setupAdmin } from '../../services/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [name, setName] = useState('');

    const from = location.state?.from?.pathname || '/admin';

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Kullanıcı adı ve şifre gereklidir!');
            return;
        }

        try {
            setLoading(true);
            const response = await loginAdmin({ username, password });

            if (response.data.success) {
                localStorage.setItem('eses3d-admin-token', response.data.token);
                toast.success('Giriş başarılı!');
                navigate(from, { replace: true });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Giriş yapılırken hata oluştu';
            toast.error(message);

            // Admin yoksa setup moduna geç
            if (error.response?.status === 401) {
                // Setup modu önerisi
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async (e) => {
        e.preventDefault();

        if (!username || !password || !name) {
            toast.error('Tüm alanları doldurun!');
            return;
        }

        try {
            setLoading(true);
            const response = await setupAdmin({ username, password, name });

            if (response.data.success) {
                localStorage.setItem('eses3d-admin-token', response.data.token);
                toast.success('Admin hesabı oluşturuldu!');
                navigate('/admin', { replace: true });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Hesap oluşturulurken hata oluştu';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light-100 dark:bg-dark-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo.jpeg"
                        alt="eses3D"
                        className="h-20 w-20 mx-auto rounded-xl shadow-xl mb-4"
                    />
                    <h1 className="text-2xl font-bold gradient-text">eses3D</h1>
                    <p className="text-light-500 dark:text-dark-400 mt-1">
                        {isSetupMode ? 'Admin Hesabı Oluştur' : 'Admin Paneli'}
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl p-6 shadow-lg">
                    <form onSubmit={isSetupMode ? handleSetup : handleLogin} className="space-y-4">
                        {isSetupMode && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Admin Adı"
                                    className="input"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-light-800 dark:text-white">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <span>İşleniyor...</span>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>{isSetupMode ? 'Hesap Oluştur' : 'Giriş Yap'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Setup Mode */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setIsSetupMode(!isSetupMode)}
                            className="text-light-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                        >
                            {isSetupMode
                                ? 'Zaten hesabım var, giriş yap'
                                : 'İlk kez mi kullanıyorsunuz? Hesap oluşturun'}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 flex items-start space-x-3 text-light-500 dark:text-dark-500 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                        İlk kurulumda "Hesap oluştur" seçeneğini kullanarak admin hesabınızı oluşturun.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
