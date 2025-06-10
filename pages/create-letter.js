import { useState, useEffect } from 'react';

export default function CreateLetter() {
  const [formData, setFormData] = useState({
    letterType: '',
    purpose: '',
    style: '',
    isFirst: '',
    recipient: '',
    title: '',
    content: ''
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    letterTypes: [],
    purposes: [],
    styles: []
  });

  const [generatedLetter, setGeneratedLetter] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('form');

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch('/api/sheets?worksheet=Settings');
      const data = await response.json();
      
      if (data.length > 1) {
        const letterTypes = data.slice(1).map(row => row[1]).filter(Boolean);
        const purposes = data.slice(1).map(row => row[2]).filter(Boolean);
        const styles = data.slice(1).map(row => row[6]).filter(Boolean);
        
        setDropdownOptions({
          letterTypes: [...new Set(letterTypes)],
          purposes: [...new Set(purposes)],
          styles: [...new Set(styles)]
        });
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateLetter = async () => {
    if (!formData.letterType || !formData.purpose || !formData.style || 
        !formData.recipient || !formData.title || !formData.content || !formData.isFirst) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category: formData.letterType,
        sub_category: formData.purpose,
        title: formData.title,
        recipient: formData.recipient,
        isFirst: formData.isFirst === 'yes',
        prompt: formData.content,
        tone: formData.style
      };

      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setGeneratedLetter(data.letter || data.content || 'تم إنشاء الخطاب بنجاح');
      setCurrentSection('preview');
    } catch (error) {
      console.error('Error generating letter:', error);
      alert('حدث خطأ في إنشاء الخطاب');
    }
    setLoading(false);
  };

  const saveAndProceed = async () => {
    if (!selectedTemplate) {
      alert('يرجى اختيار قالب');
      return;
    }

    setLoading(true);
    try {
      const archiveData = {
        file: null,
        letter_content: generatedLetter,
        letter_type: formData.letterType,
        recipient: formData.recipient,
        title: formData.title,
        is_first: formData.isFirst,
        ID: Date.now().toString()
      };

      const response = await fetch('/api/archive', {
        method: 'POST',
        body: JSON.stringify(archiveData)
      });

      if (response.ok) {
        alert('تم حفظ الخطاب بنجاح');
        // Reset form
        setFormData({
          letterType: '',
          purpose: '',
          style: '',
          isFirst: '',
          recipient: '',
          title: '',
          content: ''
        });
        setGeneratedLetter('');
        setSelectedTemplate('');
        setCurrentSection('form');
      }
    } catch (error) {
      console.error('Error saving letter:', error);
      alert('حدث خطأ في حفظ الخطاب');
    }
    setLoading(false);
  };

  const templates = [
    {
      id: 'template1',
      name: 'القالب الرسمي',
      preview: 'قالب رسمي بتصميم كلاسيكي مناسب للمراسلات الحكومية والشركات'
    },
    {
      id: 'template2', 
      name: 'القالب المبسط',
      preview: 'قالب مبسط وعملي مناسب للمراسلات العامة'
    }
  ];

  return (
    <div>
      <h1 className="section-title">إنشاء خطاب جديد</h1>

      {currentSection === 'form' && (
        <div className="section">
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
              بيانات الخطاب
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">نوع الخطاب *</label>
                <select
                  name="letterType"
                  value={formData.letterType}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">اختر نوع الخطاب</option>
                  {dropdownOptions.letterTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الغرض من الخطاب *</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">اختر الغرض</option>
                  {dropdownOptions.purposes.map((purpose, index) => (
                    <option key={index} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الأسلوب *</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">اختر الأسلوب</option>
                  {dropdownOptions.styles.map((style, index) => (
                    <option key={index} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">هل هذه أول مراسلة؟ *</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="first-yes"
                      name="isFirst"
                      value="yes"
                      checked={formData.isFirst === 'yes'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="first-yes">نعم</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="first-no"
                      name="isFirst"
                      value="no"
                      checked={formData.isFirst === 'no'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="first-no">لا</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">المرسل إليه *</label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="اسم المرسل إليه"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">عنوان الخطاب *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="عنوان الخطاب"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">محتوى الخطاب *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="form-control"
                rows="6"
                placeholder="اكتب محتوى الخطاب هنا..."
                required
              />
            </div>

            <button 
              onClick={generateLetter}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {loading ? <span className="loading"></span> : 'إنشاء الخطاب'}
            </button>
          </div>
        </div>
      )}

      {currentSection === 'preview' && (
        <div className="section">
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
              معاينة الخطاب
            </h2>

            <div className="form-group">
              <label className="form-label">محتوى الخطاب المُنشأ</label>
              <textarea
                                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="form-control"
                rows="10"
                style={{ marginBottom: '20px' }}
              />
            </div>

            <h3 style={{ marginBottom: '16px', color: 'var(--secondary-color)' }}>
              اختيار القالب
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-preview ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h4 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>
                    {template.name}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {template.preview}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setCurrentSection('form')}
                className="btn btn-secondary"
              >
                العودة للتحرير
              </button>
              <button 
                onClick={saveAndProceed}
                className="btn btn-primary"
                disabled={loading || !selectedTemplate}
              >
                {loading ? <span className="loading"></span> : 'حفظ ومتابعة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}