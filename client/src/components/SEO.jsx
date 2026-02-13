import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path = '' }) => {
    const siteName = 'eses3D';
    const baseUrl = 'https://eses3-d.vercel.app';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - 3D Baskı Ürünleri Vitrini`;
    const fullUrl = `${baseUrl}${path}`;
    const defaultDescription = '3D yazıcı ile üretilmiş anahtarlık, figür, dekoratif ürünler ve özel tasarımları inceleyin, talep oluşturun.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <link rel="canonical" href={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={fullUrl} />
        </Helmet>
    );
};

export default SEO;
