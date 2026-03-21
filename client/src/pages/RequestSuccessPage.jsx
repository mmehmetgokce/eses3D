import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, Copy, Home, ShoppingBag, Camera } from 'lucide-react';
import ColorCircle from '../components/ColorCircle';
import toast from 'react-hot-toast';

const RequestSuccessPage = () => {
    const { requestId } = useParams();
    const location = useLocation();
    const orderItems = location.state?.orderItems || [];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestId);
        toast.success('Talep numarası kopyalandı!');
    };

    return (
        <div className="min-h-screen py-20 animate-fade-in">
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto text-center">
                    {/* Success Icon */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4">
                        Talebiniz Alındı! 🎉
                    </h1>

                    <p className="text-light-600 dark:text-dark-400 mb-8">
                        Talebiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.
                    </p>

                    {/* Request ID Box */}
                    <div className="card p-6 mb-6">
                        <p className="text-light-500 dark:text-dark-400 text-sm mb-2">Talep Numaranız</p>
                        <div className="flex items-center justify-center space-x-3">
                            <span className="text-2xl md:text-3xl font-bold text-primary-500 dark:text-primary-400">
                                #{requestId}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-light-200 dark:bg-dark-700 hover:bg-light-300 dark:hover:bg-dark-600 rounded-lg transition-colors"
                                title="Kopyala"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-light-500 dark:text-dark-500 text-xs mt-3">
                            Bu numarayı saklayın. Talebinizi takip etmek için kullanabilirsiniz.
                        </p>
                    </div>

                    {/* Sipariş Edilen Ürünler */}
                    {orderItems.length > 0 && (
                        <div className="card p-6 mb-6 text-left">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                                    <h3 className="font-semibold">Talep Edilen Ürünler</h3>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between py-2 ${index !== orderItems.length - 1 ? 'border-b border-light-200 dark:border-dark-600' : ''}`}
                                    >
                                        <span className="text-sm">{item.name}</span>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-primary-500 dark:text-primary-400">
                                                {item.quantity} adet
                                            </span>
                                            {item.selectedColors?.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1 justify-end mt-0.5">
                                                    {item.selectedColors.map((sc, ci) => (
                                                        <span key={ci} className="text-xs text-light-500 dark:text-dark-500">
                                                            {sc.label}: {sc.color}{ci < item.selectedColors.length - 1 ? ',' : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.price != null && (
                                                <p className="text-xs text-light-500 dark:text-dark-500">
                                                    {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-light-200 dark:border-dark-600 font-semibold text-sm">
                                <span>Toplam</span>
                                <span className="text-primary-500 dark:text-primary-400">
                                    {orderItems.reduce((sum, item) => sum + item.quantity, 0)} adet
                                </span>
                            </div>
                            {orderItems.some(item => item.price != null) && (
                                <div className="flex items-center justify-between mt-2 font-semibold text-sm">
                                    <span>Tahmini Tutar</span>
                                    <span className="text-primary-500 dark:text-primary-400">
                                        {orderItems.reduce((sum, item) => {
                                            if (item.price != null) return sum + (item.price * item.quantity);
                                            return sum;
                                        }, 0).toLocaleString('tr-TR')} ₺
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 mt-4 p-3 bg-light-100 dark:bg-dark-700/50 rounded-lg">
                                <Camera className="w-4 h-4 text-light-500 dark:text-dark-400 flex-shrink-0" />
                                <p className="text-light-500 dark:text-dark-400 text-xs">
                                    Sipariş detaylarını saklamak isterseniz bu sayfanın ekran görüntüsünü alabilirsiniz.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Bilgi Kutusu */}
                    <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Sonraki Adım</h3>
                        <p className="text-light-700 dark:text-dark-300 text-sm">
                            Talebiniz incelendikten sonra fiyat ve üretim detayları hakkında sizinle iletişime geçeceğiz.
                        </p>
                    </div>

                    {/* Ana Sayfa Butonu */}
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center justify-center space-x-2"
                    >
                        <Home className="w-5 h-5" />
                        <span>Ana Sayfaya Dön</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RequestSuccessPage;
