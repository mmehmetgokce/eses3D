import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Trash2, MessageCircle, X, ChevronDown, Phone, User } from 'lucide-react';
import { getAllRequests, updateRequestStatus, deleteRequest } from '../../services/api';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '905522234619';

const AdminRequests = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getAllRequests({ status: statusFilter || undefined });
            setRequests(response.data.data);
        } catch (error) {
            console.error('Talepler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await updateRequestStatus(requestId, newStatus);
            toast.success('Durum güncellendi!');
            fetchRequests();
            if (selectedRequest?._id === requestId) {
                setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
        } catch (error) {
            toast.error('Durum güncellenirken hata oluştu');
        }
    };

    const handleDelete = async (request) => {
        if (!confirm(`${request.requestId} numaralı talebi silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await deleteRequest(request._id);
            toast.success('Talep silindi!');
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            toast.error('Talep silinirken hata oluştu');
        }
    };

    const statusOptions = [
        { value: '', label: 'Tümü' },
        { value: 'pending', label: 'Bekliyor' },
        { value: 'contacted', label: 'İletişime Geçildi' },
        { value: 'completed', label: 'Tamamlandı' },
        { value: 'cancelled', label: 'İptal' },
    ];

    const getStatusBadge = (status) => {
        const classes = {
            pending: 'bg-yellow-500/20 text-yellow-500 dark:text-yellow-400',
            contacted: 'bg-blue-500/20 text-blue-500 dark:text-blue-400',
            completed: 'bg-green-500/20 text-green-500 dark:text-green-400',
            cancelled: 'bg-red-500/20 text-red-500 dark:text-red-400'
        };
        const labels = {
            pending: 'Bekliyor',
            contacted: 'İletişime Geçildi',
            completed: 'Tamamlandı',
            cancelled: 'İptal'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-light-200 dark:bg-dark-600 text-light-500 dark:text-dark-400'}`}>
                {labels[status] || status}
            </span>
        );
    };

    // Müşteriye WhatsApp mesajı gönder (ürün detayları ile)
    const handleWhatsApp = (request) => {
        const targetNumber = request.customerPhone || WHATSAPP_NUMBER;
        const items = request.items || [];

        let message = 'Merhaba';
        const fullName = ((request.customerName || '') + ' ' + (request.customerSurname || '')).trim();
        if (fullName) {
            message += ' ' + fullName;
        }
        message += ', ' + request.requestId + ' numaralı talebiniz hakkında bilgi vermek istiyoruz.';

        if (items.length > 0) {
            message += '\n\nTalep ettiğiniz ürünler:';
            items.forEach(function (item) {
                const name = item.productName || (item.product && item.product.name) || 'Ürün';
                message += '\n• ' + name + ' - ' + item.quantity + ' adet';
            });
        }

        const url = 'https://wa.me/' + targetNumber + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank');
    };

    // Müşteri adını formatla
    const getCustomerName = (request) => {
        if (request.customerName || request.customerSurname) {
            return `${request.customerName || ''} ${request.customerSurname || ''}`.trim();
        }
        return null;
    };

    // Telefon numarasını formatla (90XXXXXXXXXX -> +90 XXX XXX XX XX)
    const formatPhoneDisplay = (phone) => {
        if (!phone) return null;
        const clean = phone.replace(/\D/g, '');
        if (clean.length === 12 && clean.startsWith('90')) {
            const number = clean.slice(2);
            return `+90 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 8)} ${number.slice(8)}`;
        }
        return phone;
    };

    if (loading) {
        return <Loading text="Talepler yükleniyor..." />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Talepler</h1>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            if (e.target.value) {
                                setSearchParams({ status: e.target.value });
                            } else {
                                setSearchParams({});
                            }
                        }}
                        className="input pr-10 appearance-none"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-500 dark:text-dark-400 pointer-events-none" />
                </div>
            </div>

            {/* Requests List */}
            <div className="card">
                {requests.length === 0 ? (
                    <div className="p-8 text-center text-light-500 dark:text-dark-500">
                        {statusFilter ? 'Bu durumda talep bulunmuyor' : 'Henüz talep bulunmuyor'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-300 dark:border-dark-700">
                                    <th className="text-left p-4 text-light-600 dark:text-dark-400 font-medium">Talep No</th>
                                    <th className="text-left p-4 text-light-600 dark:text-dark-400 font-medium">Müşteri</th>
                                    <th className="text-left p-4 text-light-600 dark:text-dark-400 font-medium">Ürün</th>
                                    <th className="text-left p-4 text-light-600 dark:text-dark-400 font-medium">Durum</th>
                                    <th className="text-left p-4 text-light-600 dark:text-dark-400 font-medium">Tarih</th>
                                    <th className="text-right p-4 text-light-600 dark:text-dark-400 font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-200 dark:divide-dark-700">
                                {requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-light-100 dark:hover:bg-dark-700/50">
                                        <td className="p-4">
                                            <span className="font-medium text-primary-600 dark:text-primary-400">{request.requestId}</span>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                {getCustomerName(request) && (
                                                    <p className="text-sm">{getCustomerName(request)}</p>
                                                )}
                                                {request.customerPhone && (
                                                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{formatPhoneDisplay(request.customerPhone)}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">{request.items?.length || 0} ürün</td>
                                        <td className="p-4">{getStatusBadge(request.status)}</td>
                                        <td className="p-4 text-light-500 dark:text-dark-400 text-sm">
                                            {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-light-300 dark:hover:bg-dark-500 rounded-lg transition-colors"
                                                    title="Detay"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleWhatsApp(request)}
                                                    className="p-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-lg transition-colors"
                                                    title="Müşteriye WhatsApp ile Ulaş"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(request)}
                                                    className="p-2 bg-light-200 dark:bg-dark-600 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl w-full max-w-2xl my-8 animate-fade-in">
                        <div className="flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-700">
                            <h2 className="font-semibold">
                                Talep Detayı - {selectedRequest.requestId}
                            </h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-light-500 dark:text-dark-400 text-sm">Müşteri</p>
                                    <p className="font-medium">{getCustomerName(selectedRequest) || 'Belirtilmemiş'}</p>
                                </div>
                                <div>
                                    <p className="text-light-500 dark:text-dark-400 text-sm">Tarih</p>
                                    <p className="font-medium">
                                        {new Date(selectedRequest.createdAt).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Name & Phone - Her zaman göster */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-light-100 dark:bg-dark-700/50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-light-500 dark:text-dark-400" />
                                    <div>
                                        <p className="text-light-500 dark:text-dark-400 text-xs">Müşteri Adı</p>
                                        <p className="font-medium">{getCustomerName(selectedRequest) || 'Belirtilmemiş'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-light-500 dark:text-dark-400" />
                                    <div>
                                        <p className="text-light-500 dark:text-dark-400 text-xs">Telefon</p>
                                        <p className={`font-medium ${selectedRequest.customerPhone ? 'text-green-600 dark:text-green-400' : 'text-light-500 dark:text-dark-500'}`}>
                                            {formatPhoneDisplay(selectedRequest.customerPhone) || 'Belirtilmemiş'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Change */}
                            <div>
                                <p className="text-light-500 dark:text-dark-400 text-sm mb-2">Durum</p>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.slice(1).map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleStatusChange(selectedRequest._id, opt.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRequest.status === opt.value
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-light-200 dark:bg-dark-700 text-light-700 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-600'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-light-500 dark:text-dark-400 text-sm mb-2">Talep Edilen Ürünler</p>
                                <div className="bg-light-100 dark:bg-dark-700 rounded-lg divide-y divide-light-200 dark:divide-dark-600">
                                    {selectedRequest.items?.map((item, index) => (
                                        <div key={index} className="p-3 flex items-center space-x-3">
                                            {item.product?.images?.[0] && (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt=""
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-light-500 dark:text-dark-400 text-sm">Adet: {item.quantity}</p>
                                                {item.note && (
                                                    <p className="text-light-500 dark:text-dark-500 text-xs">Not: {item.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* General Note */}
                            {selectedRequest.generalNote && (
                                <div>
                                    <p className="text-light-500 dark:text-dark-400 text-sm mb-2">Genel Not</p>
                                    <p className="bg-light-100 dark:bg-dark-700 rounded-lg p-3 text-sm">{selectedRequest.generalNote}</p>
                                </div>
                            )}

                            {/* WhatsApp - Sadece telefon varsa göster */}
                            {selectedRequest.customerPhone && selectedRequest.customerPhone.trim() !== '' && (
                                <a
                                    href={`https://wa.me/${selectedRequest.customerPhone}?text=${encodeURIComponent(`Merhaba ${getCustomerName(selectedRequest) || ''}, ${selectedRequest.requestId} numaralı talebiniz hakkında bilgi vermek istiyoruz.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp w-full flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Müşteriye WhatsApp ile Ulaş ({formatPhoneDisplay(selectedRequest.customerPhone)})</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRequests;

