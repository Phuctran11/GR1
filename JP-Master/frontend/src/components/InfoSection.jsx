import { FaPen, FaBook, FaHeadphones, FaCheck } from 'react-icons/fa6'

export default function InfoSection({ title = 'How It Works', steps }) {
    const items = steps || [
        { step: 1, title: 'Choose Words', Icon: FaPen },
        { step: 2, title: 'Read Stories', Icon: FaBook },
        { step: 3, title: 'Listen & Learn', Icon: FaHeadphones },
        { step: 4, title: 'Take Quiz', Icon: FaCheck },
    ]

    return (
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="grid-4-cols">
                {items.map((item, idx) => (
                    <div key={idx} className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <item.Icon className="text-2xl text-green-600" />
                        </div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
