import { useState, useEffect } from 'react';

export default function LettersLog() {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterReview, setFilterReview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  useEffect(() => {
    filterLetters();
  }, [letters, searchTerm, filterType, filterReview]);

  const fetchLetters = async () => {
    try {
      const response = await fetch('/api/sheets?worksheet=Submissions');
      const data = await response.json();
      
      if (data.length > 1) {
        const lettersData = data.slice(1).map((row, index) => ({
          id: row[0] || `LETTER-${index + 1}`,
          date: row[1] || new Date().toLocaleDateString('ar-SA'),
          type: row[3] || 'جديد',
          review: row[9] || 'في الانتظار',
          sent: row[10] || 'في الانتظار',
          recipient: row[4] || '',
          subject: row[5] || '',
          content: row[2] || ''
        }));
        
        setLetters(lettersData);
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
    }
    setLoading(false);
  };

  const filterLetters = () => {
    let filtered = letters;

    if (searchTerm) {
      filtered = filtered.filter(letter => 
        letter.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(letter => letter.type === filterType);
    }

    if (filterReview) {
      filtered = filtered.filter(letter => letter.review === filterReview);
    }

    setFilteredLetters(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'جاهز للإرسال':
        return 'var(--success)';
      case 'يحتاج إلى تحسينات':
        return 'var(--danger)';
      case 'تم الإرسال':
        return 'var(--success)';
      default:
        return 'var(--warning)';
    }
  };

  const translateType = (type) => {
    const translations = {
      'New': 'جديد',
      'Reply': 'رد',
      'Follow Up': 'متابعة',
      'Co-op': 'تعاون'
    };
    return translations[type] || type;
  };

  const handleAction = async (action, letterId) => {
    switch (action) {
      case 'delete':
        if (confirm('هل أنت متأكد من حذف هذا الخطاب؟')) {
          // Implement delete functionality
          setLetters(letters.filter(letter => letter.id !== letterId));
        }
        break;
      case 'print':
        window.print();
        break;
      case 'download':
        // Implement PDF download
        const letter = letters.find(l => l.id === letterId);
        if (letter) {
          downloadAsPDF(letter);
        }
        break;
      case 'review':
        window.location.href = `/review-letter?id=${letterId}`;
        break;
    }
  };

  const downloadAsPDF = (letter) => {
    // Create a simple PDF download
    const content = `
      الرقم المرجعي: ${letter.id}
      التاريخ: ${letter.date}
      المستلم: ${letter.recipient}
      الموضوع: ${letter.subject}
      
      ${letter.content}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-${letter.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="loading" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px' }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">سجل الخطابات</h1>

      <div className="card">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="form-group">
            <label className="form-label">البحث</label>
            <input
              type="text"
              className="form-control"
              placeholder="ابحث عن المستلم أو الرقم المرجعي"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">نوع الخطاب</label>
            <select
              className="form-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">جميع الأنواع</option>
              <option value="جديد">جديد</option>
              <option value="رد">رد</option>
              <option value="متابعة">متابعة</option>
              <option value="تعاون">تعاون</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">حالة المراجعة</label>
            <select
              className="form-control"
              value={filterReview}
              onChange={(e) => setFilterReview(e.target.value)}
            >
              <option value="">جميع الحالات</option>
              <option value="في الانتظار">في الانتظار</option>
              <option value="جاهز للإرسال">جاهز للإرسال</option>
              <option value="يحتاج إلى تحسينات">يحتاج إلى تحسينات</option>
              <option value="مرفوض">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>الرقم المرجعي</th>
                <th>التاريخ</th>
                <th>نوع الخطاب</th>
                <th>المراجعة</th>
                <th>الإرسال</th>
                <th>المستلم</th>
                <th>الموضوع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredLetters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.id}</td>
                  <td>{letter.date}</td>
                  <td>{translateType(letter.type)}</td>
                  <td>
                    <span 
                      className={`status-${letter.review === 'جاهز للإرسال' ? 'ready' : 
                        letter.review === 'يحتاج إلى تحسينات' ? 'needs-improvement' : 'waiting'}`}
                      style={{ 
                        backgroundColor: getStatusColor(letter.review),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {letter.review}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        backgroundColor: getStatusColor(letter.sent),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {letter.sent}
                    </span>
                  </td>
                  <td>{letter.recipient}</td>
                  <td>{letter.subject}</td>
                  <td>
                    <div className="actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleAction('review', letter.id)}
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        title="مراجعة"
                      >
                        🔍
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleAction('print', letter.id)}
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        title="طباعة"
                      >
                        🖨️
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleAction('download', letter.id)}
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        title="تحميل"
                      >
                        📥
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleAction('delete', letter.id)}
                        style={{ backgroundColor: 'var(--danger)', color: 'white' }}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLetters.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'var(--text-secondary)'
          }}>
            <p>لا توجد خطابات تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}