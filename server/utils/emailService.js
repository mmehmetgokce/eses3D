import nodemailer from 'nodemailer';

// E-posta transporter oluştur
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Talep onay e-postası gönder
export const sendRequestEmail = async (email, requestId, items, generalNote) => {
    const transporter = createTransporter();

    // Ürün listesi HTML'i oluştur
    const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.note || '-'}</td>
    </tr>
  `).join('');

    const whatsappLink = `https://wa.me/${process.env.WHATSAPP_NUMBER || '905522234619'}?text=${encodeURIComponent(`Merhaba, ${requestId} numaralı talebim hakkında bilgi almak istiyorum.`)}`;

    const mailOptions = {
        from: `"eses3D" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Talep Onayı - ${requestId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1F2937 0%, #374151 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 28px;">eses3D</h1>
          <p style="color: #9CA3AF; margin: 10px 0 0 0;">3D Baskı Talep Sistemi</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1F2937; margin-top: 0;">Talebiniz Alındı! 🎉</h2>
          
          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <strong style="color: #92400E;">Talep Numaranız:</strong>
            <div style="font-size: 24px; font-weight: bold; color: #1F2937; margin-top: 5px;">${requestId}</div>
          </div>
          
          <p>Merhaba,</p>
          <p>Talebinizi aldık ve en kısa sürede inceleyeceğiz. Aşağıda talep detaylarınızı bulabilirsiniz:</p>
          
          <h3 style="color: #1F2937; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">Talep Edilen Ürünler</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #F3F4F6;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E5E7EB;">Ürün</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #E5E7EB;">Adet</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E5E7EB;">Not</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          ${generalNote ? `
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Genel Not:</strong>
            <p style="margin: 10px 0 0 0;">${generalNote}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              📱 WhatsApp ile İletişime Geç
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Fiyat ve üretim detayları için lütfen WhatsApp üzerinden bizimle iletişime geçin. 
            Talep numaranızı paylaşmanız süreci hızlandıracaktır.
          </p>
        </div>
        
        <div style="background: #1F2937; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
            Bu e-posta eses3D talep sistemi tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      </body>
      </html>
    `
    };

    await transporter.sendMail(mailOptions);
};
