import { Resend } from 'resend';

/**
 * Yeni talep oluşturulduğunda bildirim e-postası gönder (Resend API)
 */
export const sendNewRequestNotification = async (request) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('RESEND_API_KEY tanımlı değil');
    }

    const notificationEmails = process.env.NOTIFICATION_EMAILS;
    if (!notificationEmails) {
        throw new Error('NOTIFICATION_EMAILS tanımlı değil');
    }

    const recipients = notificationEmails.split(',').map(e => e.trim()).filter(Boolean);
    if (recipients.length === 0) {
        throw new Error('NOTIFICATION_EMAILS boş');
    }

    const resend = new Resend(apiKey);

    // Müşteri bilgileri
    const fullName = `${request.customerName || ''} ${request.customerSurname || ''}`.trim();
    const phone = request.customerPhone || 'Belirtilmemiş';

    // Ürün listesi HTML
    let itemsHtml = '';
    let totalPrice = 0;
    let hasPrice = false;

    (request.items || []).forEach(item => {
        const name = item.productName || 'Ürün';
        const qty = item.quantity || 1;

        let colorText = '';
        if (item.selectedColors && item.selectedColors.length > 0) {
            colorText = item.selectedColors.map(sc => {
                if (sc && typeof sc === 'object') {
                    return `${sc.label || ''}: ${sc.color || ''}`;
                }
                return String(sc);
            }).join(', ');
        }

        let priceText = '';
        if (item.unitPrice != null) {
            const lineTotal = item.unitPrice * qty;
            priceText = `${lineTotal.toLocaleString('tr-TR')} ₺`;
            if (qty > 1) {
                priceText += ` (Birim: ${item.unitPrice.toLocaleString('tr-TR')} ₺)`;
            }
            totalPrice += lineTotal;
            hasPrice = true;
        }

        itemsHtml += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; font-size: 14px;">${name}</td>
                <td style="padding: 10px; font-size: 14px; text-align: center;">${qty}</td>
                <td style="padding: 10px; font-size: 14px;">${colorText || '—'}</td>
                <td style="padding: 10px; font-size: 14px; text-align: right;">${priceText || '—'}</td>
            </tr>`;
    });

    const noteText = request.generalNote ? `<p style="margin: 10px 0; color: #6b7280; font-size: 14px;"><strong>Genel Not:</strong> ${request.generalNote}</p>` : '';

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 20px;">🔔 Yeni Talep Alındı</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${request.requestId}</p>
        </div>
        <div style="padding: 24px;">
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px; font-size: 15px; color: #374151;">Müşteri Bilgileri</h3>
                <p style="margin: 4px 0; font-size: 14px; color: #4b5563;">
                    <strong>Ad Soyad:</strong> ${fullName || 'Belirtilmemiş'}
                </p>
                <p style="margin: 4px 0; font-size: 14px; color: #4b5563;">
                    <strong>Telefon:</strong> ${phone}
                </p>
            </div>
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #374151;">Talep Edilen Ürünler</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 10px; font-size: 13px; text-align: left; color: #6b7280;">Ürün</th>
                        <th style="padding: 10px; font-size: 13px; text-align: center; color: #6b7280;">Adet</th>
                        <th style="padding: 10px; font-size: 13px; text-align: left; color: #6b7280;">Renk</th>
                        <th style="padding: 10px; font-size: 13px; text-align: right; color: #6b7280;">Fiyat</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            ${hasPrice ? `
            <div style="background: #eef2ff; border-radius: 8px; padding: 12px 16px; text-align: right; margin-bottom: 16px;">
                <strong style="font-size: 16px; color: #4f46e5;">Tahmini Toplam: ${totalPrice.toLocaleString('tr-TR')} ₺</strong>
            </div>
            ` : ''}
            ${noteText}
            <div style="text-align: center; margin-top: 24px;">
                <a href="https://eses3-d.vercel.app/admin/requests?status=pending"
                   style="display: inline-block; background: #6366f1; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                    Talepleri İncele
                </a>
            </div>
        </div>
        <div style="padding: 16px 24px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                eses3D Bildirim Sistemi
            </p>
        </div>
    </div>`;

    const { data, error } = await resend.emails.send({
        from: 'eses3D <onboarding@resend.dev>',
        to: recipients,
        subject: `🔔 Yeni Talep: ${request.requestId} — ${fullName || 'Müşteri'}`,
        html
    });

    if (error) {
        throw new Error(error.message || JSON.stringify(error));
    }

    console.log(`[EMAIL] Resend ile gönderildi: ${request.requestId} → ${recipients.join(', ')} (id: ${data?.id})`);
};
