import { createContext, useContext, useState, useEffect } from 'react';

const RequestContext = createContext();

export const useRequest = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequest must be used within a RequestProvider');
    }
    return context;
};

export const RequestProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        // localStorage'dan başlangıç değerini al
        const saved = localStorage.getItem('eses3d-request-list');
        return saved ? JSON.parse(saved) : [];
    });

    // items değiştiğinde localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('eses3d-request-list', JSON.stringify(items));
    }, [items]);

    // Listeye ürün ekle
    const addItem = (product, quantity = 1, note = '', selectedColors = []) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.product._id === product._id);

            if (existingIndex > -1) {
                // Ürün zaten var, miktarı güncelle
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            // Yeni ürün ekle
            return [...prev, {
                product,
                productName: product.name,
                quantity,
                note,
                selectedColors
            }];
        });
    };

    // Listeden ürün çıkar
    const removeItem = (productId) => {
        setItems(prev => prev.filter(item => item.product._id !== productId));
    };

    // Ürün miktarını güncelle
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item =>
            item.product._id === productId
                ? { ...item, quantity }
                : item
        ));
    };

    // Ürün notunu güncelle
    const updateNote = (productId, note) => {
        setItems(prev => prev.map(item =>
            item.product._id === productId
                ? { ...item, note }
                : item
        ));
    };

    // Listeyi temizle
    const clearList = () => {
        setItems([]);
    };

    // Toplam ürün sayısı
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Ürün listede mi kontrol et
    const isInList = (productId) => {
        return items.some(item => item.product._id === productId);
    };

    return (
        <RequestContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            updateNote,
            clearList,
            totalItems,
            isInList
        }}>
            {children}
        </RequestContext.Provider>
    );
};
