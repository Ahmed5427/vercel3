import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: '🏠' },
    { href: '/create-letter', label: 'إنشاء خطاب جديد', icon: '✍️' },
    { href: '/letters-log', label: 'سجل الخطابات', icon: '📋' },
    { href: '/review-letter', label: 'مراجعة خطاب', icon: '🔍' }
  ];

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: 'var(--shadow)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--primary-color)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            AI
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--primary-color)'
          }}>
            مولد الخطابات الذكي
          </h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: router.pathname === item.href ? 'white' : 'var(--text-primary)',
                background: router.pathname === item.href ? 'var(--primary-color)' : 'transparent',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{item.icon}</span>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}