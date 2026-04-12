import { createContext, useContext, useState, useEffect } from 'react';

const WholesaleContext = createContext();

export const useWholesale = () => {
    const context = useContext(WholesaleContext);
    if (!context) {
        throw new Error('useWholesale must be used within a WholesaleProvider');
    }
    return context;
};

// Kademe tablosu
const TIERS = [
    { min: 50, discount: 20 },
    { min: 60, discount: 25 },
    { min: 70, discount: 30 },
    { min: 80, discount: 35 },
    { min: 90, discount: 40 },
    { min: 100, discount: 50 }
];

// Stand bilgileri
const STANDS = {
    single: { label: 'Tek Katlı Anahtarlık Standı', price: 200, minQty: 50 },
    double: { label: 'Çift Katlı Anahtarlık Standı', price: 400, minQty: 80 }
};

export const getStandType = (totalQty) => {
    if (totalQty >= 80) return STANDS.double;
    if (totalQty >= 50) return STANDS.single;
    return null;
};

export const getTier = (totalQty) => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
        if (totalQty >= TIERS[i].min) return TIERS[i];
    }
    return null;
};

export const getNextTier = (totalQty) => {
    for (let i = 0; i < TIERS.length; i++) {
        if (totalQty < TIERS[i].min) return TIERS[i];
    }
    return null;
};

export { TIERS, STANDS };

// Ürün + renk seçiminden benzersiz key oluştur
const getItemKey = (productId, selectedColors = []) => {
    if (selectedColors.length === 0) return `${productId}__no-color`;
    const colorKey = selectedColors.map(c => `${c.label}:${c.color}`).sort().join('|');
    return `${productId}__${colorKey}`;
};

export const WholesaleProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('eses3d-wholesale-list');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('eses3d-wholesale-list', JSON.stringify(items));
    }, [items]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const currentTier = getTier(totalItems);
    const nextTier = getNextTier(totalItems);
    const discountPercent = currentTier ? currentTier.discount : 0;
    const currentStand = getStandType(totalItems);

    // Ürün ekle (renk seçimli)
    const addItem = (product, quantity = 1, selectedColors = []) => {
        const key = getItemKey(product._id, selectedColors);

        setItems(prev => {
            const existingIndex = prev.findIndex(item => item._itemKey === key);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, {
                _itemKey: key,
                productId: product._id,
                productName: product.name,
                price: product.price || 0,
                image: product.images?.[0]?.url || '',
                quantity,
                selectedColors
            }];
        });
        return true;
    };

    // Adet güncelle
    const updateQuantity = (itemKey, quantity) => {
        if (quantity < 1) {
            removeItem(itemKey);
            return;
        }
        setItems(prev => prev.map(item =>
            item._itemKey === itemKey
                ? { ...item, quantity }
                : item
        ));
    };

    // Ürün sil
    const removeItem = (itemKey) => {
        setItems(prev => prev.filter(item => item._itemKey !== itemKey));
    };

    // Listeyi temizle
    const clearList = () => {
        setItems([]);
    };

    // Toplam fiyat (indirimli)
    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * (discountPercent / 100);
        return { subtotal, discount, total: subtotal - discount };
    };

    return (
        <WholesaleContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearList,
            totalItems,
            currentTier,
            nextTier,
            discountPercent,
            currentStand,
            calculateTotal
        }}>
            {children}
        </WholesaleContext.Provider>
    );
};
