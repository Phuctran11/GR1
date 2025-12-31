export default function SectionHeader({ title, subtitle, align = 'center', className = '' }) {
    const alignClass = align === 'left' ? 'text-left' : 'text-center'
    return (
        <div className={`${alignClass} section-mb ${className}`}>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
    )
}
