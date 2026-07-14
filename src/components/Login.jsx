import React, { useState } from 'react';

const ALLOWED_USERS = {
  'lhidalgo@sisprotgf.com': '04128150454',
  'dacevedo@sisprotgf.com': '04121494173'
};

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Por favor, ingrese su correo electrónico.');
      return;
    }

    if (!ALLOWED_USERS[cleanEmail]) {
      setError('Correo no autorizado para acceder a este sistema.');
      return;
    }

    setLoading(true);
    const phone = ALLOWED_USERS[cleanEmail];
    
    // Generate a 6-digit random OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);

    try {
      const response = await fetch('https://n8n.sisprottaurus.com/webhook/sms-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tlf: phone,
          message: `Tu codigo OTP es: ${code}`
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el código OTP a través del gateway.');
      }

      setSuccessMessage(`Código enviado al teléfono terminado en ...${phone.slice(-4)}`);
      setStep(2);
    } catch (err) {
      console.error(err);
      // Even if webhook fails, let's log the code in console for development/backup
      console.log(`[DEV ONLY] OTP Code: ${code}`);
      setError('Hubo un problema al enviar el código por SMS. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Por favor, ingrese el código OTP.');
      return;
    }

    if (otp.trim() === generatedOtp) {
      // Save authenticated state in session storage
      sessionStorage.setItem('authenticated_user', email);
      onLoginSuccess();
    } else {
      setError('El código OTP ingresado es incorrecto.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#0f172a',
      fontFamily: 'var(--font-body)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div className="card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '40px 30px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>
          {step === 1 ? 'Acceso al Sistema' : 'Verificación de Código'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
          {step === 1 
            ? 'Ingrese su correo electrónico autorizado para recibir un código de verificación por SMS.'
            : successMessage
          }
        </p>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            borderLeft: '4px solid var(--danger-color)',
            color: '#991b1b',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@sisprotgf.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
              {loading ? 'Enviando código...' : 'Solicitar Código OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label className="form-label">Código OTP de 6 Dígitos</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5em', fontWeight: 'bold' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }} 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Atrás
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2, justifyContent: 'center' }}
              >
                Verificar y Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
