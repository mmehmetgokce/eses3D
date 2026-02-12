import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, FileText, Clock, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '../../services/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Dashboard yükleniyor..." />;
    }

    const statCards = [
        {
            icon: <Package className="w-6 h-6" />,
            label: 'Toplam Ürün',
            value: stats?.products || 0,
            to: '/admin/urunler',
            color: 'text-blue-400 bg-blue-400/20'
        },
        {
            icon: <FolderOpen className="w-6 h-6" />,
            label: 'Kategori',
            value: stats?.categories || 0,
            to: '/admin/kategoriler',
            color: 'text-purple-400 bg-purple-400/20'
        },
        {
            icon: <FileText className="w-6 h-6" />,
            label: 'Toplam Talep',
            value: stats?.totalRequests || 0,
            to: '/admin/talepler',
            color: 'text-green-400 bg-green-400/20'
        },
        {
            icon: <Clock className="w-6 h-6" />,
            label: 'Bekleyen Talep',
            value: stats?.pendingRequests || 0,
            to: '/admin/talepler?status=pending',
            color: 'text-yellow-400 bg-yellow-400/20'
        },
    ];

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.to}
                        className="card p-6 hover:border-dark-600 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-400 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Requests */}
            <div className="card">
                <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                    <h2 className="font-semibold">Son Talepler</h2>
                    <Link to="/admin/talepler" className="text-primary-400 text-sm hover:text-primary-300">
                        Tümünü Gör →
                    </Link>
                </div>

                {stats?.recentRequests?.length > 0 ? (
                    <div className="divide-y divide-dark-700">
                        {stats.recentRequests.map((request) => (
                            <div key={request._id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-primary-400">{request.requestId}</p>
                                    <p className="text-dark-400 text-sm">{new Date(request.createdAt).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : request.status === 'contacted'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : request.status === 'completed'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {request.status === 'pending' && 'Bekliyor'}
                                        {request.status === 'contacted' && 'İletişime Geçildi'}
                                        {request.status === 'completed' && 'Tamamlandı'}
                                        {request.status === 'cancelled' && 'İptal'}
                                    </span>
                                    <p className="text-dark-500 text-xs mt-1">
                                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-dark-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>Henüz talep bulunmuyor</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
