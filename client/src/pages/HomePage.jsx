import { Link } from 'react-router-dom';
import { ArrowRight, Package, Palette, MessageCircle, Zap } from 'lucide-react';

const WHATSAPP_NUMBER = '905522234619';

const HomePage = () => {
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, eses3D hakkında bilgi almak istiyorum.')}`;

    const features = [
        {
            icon: <Package className="w-8 h-8" />,
            title: 'Vitrin Sistemi',
            description: '3D baskı ürünlerini inceleyin ve beğendiklerinizi talep listenize ekleyin.'
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: 'Özel Tasarım ve İstekler',
            description: 'Kendi STL dosyanızı gönderin veya gördüğünüz bir ürünü sorun, birlikte değerlendirelim.'
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: 'Birebir İletişim',
            description: 'WhatsApp üzerinden doğrudan iletişim kurarak fiyat ve üretim detaylarını öğrenin.'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Hızlı Takip',
            description: 'Oluşturduğunuz her talep benzersiz bir numara ile kayıt altına alınır.'
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient - Tema uyumlu */}
                <div className="absolute inset-0 bg-gradient-to-b from-light-100 via-light-50 to-white dark:from-dark-900 dark:via-dark-900 dark:to-dark-950">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 dark:from-primary-900/20 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Logo */}
                        <img
                            src="/logo.jpeg"
                            alt="eses3D Logo"
                            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-2xl shadow-2xl shadow-primary-500/20 animate-slide-up"
                        />

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up text-light-900 dark:text-white">
                            <span className="gradient-text">3D Baskı</span> ile<br />
                            Hayallerinizi Gerçeğe Dönüştürün
                        </h1>

                        <p className="text-light-600 dark:text-dark-300 text-lg md:text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Bu bir mağaza değil; üretim alanımız, vitrinimiz ve birlikte bir şeyler
                            ortaya çıkarma niyetimizdir.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/urunler" className="btn-primary flex items-center space-x-2">
                                <span>Ürünleri İncele</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp flex items-center space-x-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>WhatsApp ile Ulaş</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-light-400 dark:border-dark-600 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-light-500 dark:bg-dark-400 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-light-100 dark:bg-dark-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-light-900 dark:text-white">
                        Nasıl Çalışır?
                    </h2>
                    <p className="text-light-600 dark:text-dark-400 text-center mb-12 max-w-2xl mx-auto">
                        Ödeme sistemi veya sepet mantığı yoktur. İnceleyin, listeleyin ve bizimle iletişime geçin.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card p-6 text-center group hover:border-primary-500/50 animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-light-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-light-600 dark:text-dark-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-blue-500/10 dark:from-primary-900/20 dark:to-blue-900/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-light-300 dark:border-dark-700 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-light-900 dark:text-white">
                            Özel Tasarımınız mı Var? Bir Ürün mü Arıyorsunuz?
                        </h2>
                        <p className="text-light-600 dark:text-dark-300 mb-6">
                            STL dosyanızla baskı yaptırmak istiyorsanız veya bir yerde gördüğünüz bir modeli sormak istiyorsanız,
                            WhatsApp üzerinden bize ulaşabilirsiniz.
                        </p>
                        <Link to="/ozel-tasarim" className="btn-primary inline-flex items-center space-x-2">
                            <Palette className="w-5 h-5" />
                            <span>Detaylı Bilgi</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-light-100 dark:bg-dark-900/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-xl font-semibold mb-4 text-light-800 dark:text-dark-200">
                            Fiyat Bilgisi
                        </h3>
                        <p className="text-light-600 dark:text-dark-400 text-sm leading-relaxed">
                            Fiyat bilgileri sitede sabit olarak yer almaz. Fiyat; ölçü, malzeme ve talebe göre
                            değişir.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

