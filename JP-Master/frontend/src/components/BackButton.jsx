import { useNavigate } from 'react-router-dom';

/**
 * BackButton - Nút quay lại trang trước, có thể tái sử dụng cho mọi trang
 * Props:
 * - label: string (mặc định: 'Quay lại')
 * - className: string (tùy chỉnh style ngoài)
 */
export default function BackButton({ label = 'Quay lại', className = '' }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-all font-medium ${className}`}
        >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </button>
    );
}
