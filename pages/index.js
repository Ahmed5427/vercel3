import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'إنشاء خطاب جديد',
      description: 'قم بإنشاء خطابات احترافية باستخدام الذكاء الاصطناعي',
      icon: '✍️',
      href: '/create-letter',
      color: 'var(--primary-color)'
    },
    {
      title: 'سجل الخطابات',
      description: 'تصفح وإدارة جميع الخطابات المنشأة',
      icon: '📋',
      href: '/letters-log',
      color: 'var(--secondary-color)'
    },
    {
      title: 'مراجعة خطاب',
      description: 'راجع وقم بتحسين الخطابات الموجودة',
      icon: '🔍',
      href: '/review-letter',
      color: 'var(--accent-color)'
    }
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: 'var(--primary-color)',
          marginBottom: '16px'
        }}>
          مرحباً بك في مولد الخطابات الذكي
        </h1>
        <p style={{
          fontSize: '20px',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          أنشئ خطابات احترافية بسهولة باستخدام تقنية الذكاء الاصطناعي المتطورة
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {features.map((feature, index) => (
          <Link key={index} href={feature.href}>
            <div className="card" style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = feature.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                color: feature.color,
                textAlign: 'center'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{
        background: `linear-gradient(135deg, ${features[0].color}20, ${features[1].color}20)`,
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'var(--primary-color)'
        }}>
          ابدأ رحلتك الآن
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}>
          اختر من الخيارات أعلاه لبدء إنشاء خطابات احترافية
        </p>
        <Link href="/create-letter">
          <button className="btn btn-primary" style={{ fontSize: '18px' }}>
            إنشاء خطاب جديد
          </button>
        </Link>
      </div>
    </div>
  );
}