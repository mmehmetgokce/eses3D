import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Copy, MessageCircle, Home, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '905522234619';

const RequestSuccessPage = () => {
    const { requestId } = useParams();
    const [searchParams] = useSearchParams();
    const hasPhone = searchParams.get('phone') === 'true';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestId);
        toast.success('Talep numarası kopyalandı!');
    };

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Merhaba, ${requestId} numaralı talebim hakkında bilgi almak istiyorum.`)}`;

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
                        Talebiniz başarıyla oluşturuldu. E-posta adresinize talep detayları gönderildi.
                    </p>

                    {/* Request ID Box */}
                    <div className="card p-6 mb-8">
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
                    </div>

                    {/* Telefon girildiyse özel mesaj */}
                    {hasPhone && (
                        <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-6 text-left">
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">
                                        Sizinle İletişime Geçeceğiz
                                    </h3>
                                    <p className="text-light-700 dark:text-dark-300 text-sm">
                                        Girdiğiniz telefon numarasından en kısa sürede sizinle iletişime geçeceğiz.
                                        Beklemek istemezseniz aşağıdaki WhatsApp butonunu kullanabilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Sonraki Adım</h3>
                        <p className="text-light-700 dark:text-dark-300 text-sm">
                            Fiyat ve üretim detayları için lütfen WhatsApp üzerinden bizimle iletişime geçin.
                            İletişim kurarken talep numaranızı paylaşmanız süreci hızlandıracaktır.
                            Eğer telefon numaranızı bizimle paylaştıysanız, biz size ulaşacağız.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp flex items-center justify-center space-x-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>WhatsApp ile İletişime Geç</span>
                        </a>

                        <Link
                            to="/"
                            className="btn-secondary flex items-center justify-center space-x-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>Ana Sayfaya Dön</span>
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <p className="text-light-500 dark:text-dark-500 text-xs mt-8">
                        Talep numaranızı saklayın. Bu numara ile talebinizi takip edebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RequestSuccessPage;

