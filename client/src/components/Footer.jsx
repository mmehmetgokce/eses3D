import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

const WHATSAPP_NUMBER = '905522234619';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Merhaba, eses3D hakkında bilgi almak istiyorum.')}`;

    return (
        <footer className="bg-dark-900 border-t border-dark-800">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sol Grup - About + Links */}
                    <div className="md:col-span-8 flex flex-col md:flex-row gap-8 md:gap-16">
                        {/* About */}
                        <div className="md:max-w-xs">
                            <img
                                src="/logo.jpeg"
                                alt="eses3D Logo"
                                className="h-10 w-auto rounded-lg mb-4"
                            />
                            <p className="text-dark-400 text-sm leading-relaxed">
                                3D yazıcı ile üretilmiş tasarımların sergilendiği ve üretim taleplerinin
                                toplandığı bir vitrin.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/urunler" className="text-dark-400 hover:text-primary-500 text-sm transition-colors">
                                        Ürünler
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/talep-listem" className="text-dark-400 hover:text-primary-500 text-sm transition-colors">
                                        Talep Listem
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ozel-tasarim" className="text-dark-400 hover:text-primary-500 text-sm transition-colors">
                                        Özel Tasarım
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sağ Grup - İletişim */}
                    <div className="md:col-span-4">
                        <div>
                            <h3 className="text-white font-semibold mb-4">İletişim</h3>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 btn-whatsapp text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp'tan Yaz</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-dark-800 mt-8 pt-8 text-center">
                    <p className="text-dark-500 text-sm">
                        © {currentYear} eses3D. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
