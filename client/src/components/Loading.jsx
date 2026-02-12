import { Loader2 } from 'lucide-react';

const Loading = ({ text = 'Yükleniyor...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-dark-400 mt-4">{text}</p>
        </div>
    );
};

export default Loading;
