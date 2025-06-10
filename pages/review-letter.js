import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReviewLetter() {
  const router = useRouter();
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [reviewData, setReviewData] = useState({
    reviewerName: '',
    letterContent: '',
    notes: '',
    reviewCompleted: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLetters();
    
    // If ID is provided in query, select that letter
    if (router.query.id) {
      selectLetterById(router.query.id);
    }
  }, [router.query.id]);

  const fetchLetters = async () => {
    try {
      const response = await fetch('/api/sheets?worksheet=Submissions');
      const data = await response.json();
      
      if (data.length > 1) {
        const lettersData = data.slice(1).map((row, index) => ({
          id: row[0] || `LETTER-${index + 1}`,
          date: row[1] || new Date().toLocaleDateString('ar-SA'),
          content: row[2] || '',
          type: row[3] || 'جديد',
          recipient: row[4] || '',
          subject: row[5] || '',
          review: row[9] || 'في الانتظار'
        }));
        
        setLetters(lettersData);
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
    }
  };

  const selectLetterById = (id) => {
    const letter = letters.find(l => l.id === id);
    if (letter) {
      selectLetter(letter);
    }
  };

  const selectLetter = (letter) => {
    setSelectedLetter(letter);
    setReviewData({
      reviewerName: '',
      letterContent: letter.content,
      notes: '',
      reviewCompleted: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusUpdate = async (status) => {
    if (!reviewData.reviewCompleted) {
      alert('يرجى تأكيد إتمام المراجعة أولاً');
      return;
    }

    if (!reviewData.reviewerName) {
      alert('يرجى إدخال اسم المراجع');
      return;
    }

    setLoading(true);
    try {
      // Update the letter status in the sheet
      // For now, we'll just update the local state
      const updatedLetters = letters.map(letter => 
        letter.id === selectedLetter.id 
          ? { ...letter, review: status }
          : letter
      );
      setLetters(updatedLetters);

      alert(`تم تحديث حالة الخطاب إلى: ${status}`);
      router.push('/');
    } catch (error) {
      console.error('Error updating letter status:', error);
      alert('حدث خطأ في تحديث الحالة');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="section-title">مراجعة خطاب</h1>

      {!selectedLetter ? (
        <div className="card">
          <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
            اختر خطاباً للمراجعة
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>الرقم المرجعي</th>
                  <th>التاريخ</th>
                  <th>المستلم</th>
                  <th>الموضوع</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {letters.map((letter) => (
                  <tr key={letter.id}>
                                        <td>{letter.id}</td>
                    <td>{letter.date}</td>
                    <td>{letter.recipient}</td>
                    <td>{letter.subject}</td>
                    <td>
                      <span style={{
                        backgroundColor: letter.review === 'جاهز للإرسال' ? 'var(--success)' :
                          letter.review === 'يحتاج إلى تحسينات' ? 'var(--danger)' : 'var(--warning)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {letter.review}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => selectLetter(letter)}
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        اختيار
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {letters.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--text-secondary)'
            }}>
              <p>لا توجد خطابات للمراجعة</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ color: 'var(--primary-color)' }}>
                مراجعة الخطاب - {selectedLetter.id}
              </h2>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedLetter(null)}
              >
                العودة للقائمة
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <strong>المستلم:</strong> {selectedLetter.recipient}
              </div>
              <div>
                <strong>الموضوع:</strong> {selectedLetter.subject}
              </div>
              <div>
                <strong>التاريخ:</strong> {selectedLetter.date}
              </div>
              <div>
                <strong>الحالة الحالية:</strong> 
                <span style={{
                  backgroundColor: selectedLetter.review === 'جاهز للإرسال' ? 'var(--success)' :
                    selectedLetter.review === 'يحتاج إلى تحسينات' ? 'var(--danger)' : 'var(--warning)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginRight: '8px'
                }}>
                  {selectedLetter.review}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">اسم المراجع *</label>
              <input
                type="text"
                name="reviewerName"
                value={reviewData.reviewerName}
                onChange={handleInputChange}
                className="form-control"
                placeholder="أدخل اسم المراجع"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">محتوى الخطاب</label>
              <textarea
                name="letterContent"
                value={reviewData.letterContent}
                onChange={handleInputChange}
                className="form-control"
                rows="8"
                placeholder="محتوى الخطاب للمراجعة والتعديل"
              />
            </div>

            <div className="form-group">
              <label className="form-label">الملاحظات</label>
              <textarea
                name="notes"
                value={reviewData.notes}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
                placeholder="أضف ملاحظاتك هنا..."
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="reviewCompleted"
                  name="reviewCompleted"
                  checked={reviewData.reviewCompleted}
                  onChange={handleInputChange}
                />
                <label htmlFor="reviewCompleted" className="form-label" style={{ margin: 0 }}>
                  تمت المراجعة
                </label>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              marginTop: '24px'
            }}>
              <button 
                className="btn"
                onClick={() => handleStatusUpdate('يحتاج إلى تحسينات')}
                disabled={!reviewData.reviewCompleted || loading}
                style={{
                  backgroundColor: reviewData.reviewCompleted ? 'var(--warning)' : 'var(--border-color)',
                  color: reviewData.reviewCompleted ? 'white' : 'var(--text-secondary)',
                  cursor: reviewData.reviewCompleted ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? <span className="loading"></span> : 'يحتاج إلى تحسينات'}
              </button>

              <button 
                className="btn"
                onClick={() => handleStatusUpdate('جاهز للإرسال')}
                disabled={!reviewData.reviewCompleted || loading}
                style={{
                  backgroundColor: reviewData.reviewCompleted ? 'var(--success)' : 'var(--border-color)',
                  color: reviewData.reviewCompleted ? 'white' : 'var(--text-secondary)',
                  cursor: reviewData.reviewCompleted ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? <span className="loading"></span> : 'جاهز للإرسال'}
              </button>

              <button 
                className="btn"
                onClick={() => handleStatusUpdate('مرفوض')}
                disabled={!reviewData.reviewCompleted || loading}
                style={{
                  backgroundColor: reviewData.reviewCompleted ? 'var(--danger)' : 'var(--border-color)',
                  color: reviewData.reviewCompleted ? 'white' : 'var(--text-secondary)',
                  cursor: reviewData.reviewCompleted ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? <span className="loading"></span> : 'مرفوض'}
              </button>
            </div>

            {!reviewData.reviewCompleted && (
              <div style={{
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid var(--warning)',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '16px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--warning)', margin: 0 }}>
                  يرجى تأكيد إتمام المراجعة لتفعيل أزرار تحديث الحالة
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}