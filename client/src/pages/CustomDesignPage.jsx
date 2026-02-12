import { Link } from 'react-router-dom';
import { MessageCircle, Upload, FileCode, AlertCircle, ArrowRight, Camera, HelpCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '905522234619';

const CustomDesignPage = () => {
    const whatsappDesign = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, özel bir 3D tasarımımı bastırmak istiyorum. STL dosyam hazır.')}`;
    const whatsappInquiry = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, bir ürün hakkında bilgi almak istiyorum.')}`;

    const steps = [
        {
            icon: <FileCode className="w-8 h-8" />,
            title: 'STL Dosyanızı Hazırlayın',
            description: 'Kendi tasarladığınız veya indirdiğiniz STL formatındaki 3D model dosyanızı hazır edin.'
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: 'WhatsApp ile Bize Ulaşın',
            description: 'Aşağıdaki butona tıklayarak WhatsApp üzerinden bizimle iletişime geçin.'
        },
        {
            icon: <Upload className="w-8 h-8" />,
            title: 'Dosyanızı Paylaşın',
            description: 'STL dosyanızı WhatsApp üzerinden gönderin ve üretim detaylarını birlikte değerlendirelim.'
        }
    ];

    return (
        <div className="min-h-screen py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-light-900 dark:text-white">Özel Tasarım ve İstekler</h1>
                    <p className="text-light-600 dark:text-dark-400">
                        Kendi 3D tasarımınızı bastırmak mı istiyorsunuz? Ya da bir yerde gördüğünüz bir modeli mi arıyorsunuz?
                        Her iki durumda da WhatsApp üzerinden bize ulaşabilirsiniz.
                    </p>
                </div>

                {/* Özel Tasarım Bölümü */}
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-xl font-bold mb-6 text-center text-light-900 dark:text-white">🎨 Özel Tasarım (STL Dosyası)</h2>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="card p-6 text-center relative"
                            >
                                {/* Step Number */}
                                <div className="absolute top-4 right-4 w-8 h-8 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>

                                <div className="inline-flex items-center justify-center w-16 h-16 bg-light-200 dark:bg-dark-700 rounded-xl text-primary-500 mb-4">
                                    {step.icon}
                                </div>

                                <h3 className="text-lg font-semibold mb-2 text-light-900 dark:text-white">{step.title}</h3>
                                <p className="text-light-600 dark:text-dark-400 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* STL CTA */}
                    <div className="text-center">
                        <a
                            href={whatsappDesign}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp inline-flex items-center space-x-2 text-lg px-8 py-4"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span>STL Dosyamı Göndermek İstiyorum</span>
                        </a>
                    </div>
                </div>

                {/* Genel İstek / Soru Bölümü */}
                <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border border-light-300 dark:border-dark-700 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto mb-12 shadow-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-xl text-blue-500 mb-4">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-light-900 dark:text-white">Bir Ürün mü Arıyorsunuz?</h2>
                    <p className="text-light-600 dark:text-dark-300 mb-6">
                        Bir videoda, sosyal medyada veya başka bir yerde gördüğünüz bir modeli mi istiyorsunuz?
                        Ekran görüntüsü, video veya fotoğrafını WhatsApp üzerinden bize gönderin,
                        sizin için üretip üretemeyeceğimize birlikte bakalım.
                    </p>
                    <a
                        href={whatsappInquiry}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
                    >
                        <Camera className="w-6 h-6" />
                        <span>Gördüğüm Bir Ürünü Sormak İstiyorum</span>
                    </a>
                </div>

                {/* Info Box */}
                <div className="bg-yellow-50 dark:bg-dark-800/50 border border-yellow-200 dark:border-dark-700 rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold mb-2 text-light-900 dark:text-white">Önemli Bilgiler</h3>
                            <ul className="text-light-700 dark:text-dark-400 text-sm space-y-2">
                                <li>• Site üzerinden dosya yükleme yapılmamaktadır. Tüm dosya transferleri WhatsApp üzerinden gerçekleşir.</li>
                                <li>• Fiyat; dosyanın boyutuna, karmaşıklığına ve malzeme seçimine göre değişir.</li>
                                <li>• Her dosya üretime uygunluk açısından değerlendirilir.</li>
                                <li>• Gördüğünüz her ürünü üretme imkânımız olmayabilir, ancak elimizden geleni yapacağız.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Alternative CTA */}
                <div className="text-center mt-12">
                    <p className="text-light-500 dark:text-dark-500 mb-4">Hazır ürünlerimizi de görmek ister misiniz?</p>
                    <Link to="/urunler" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 inline-flex items-center space-x-2">
                        <span>Ürünlere Göz At</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomDesignPage;
