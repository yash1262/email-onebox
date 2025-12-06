export const Fallback = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '256px', borderRight: '1px solid #e5e7eb', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>✉</div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>OneBox</h1>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>AI Email Manager</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Accounts</h2>
          <button style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#0369a1', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            All Accounts
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Folders</h2>
          {['Inbox', 'Sent', 'Starred', 'Trash', 'Archive'].map(folder => (
            <button key={folder} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'transparent', color: '#4b5563', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '4px' }}>
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="text" placeholder="Search emails..." style={{ flex: 1, maxWidth: '500px', padding: '10px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>🔄</button>
              <button style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>⚙️</button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Email List */}
          <div style={{ width: '400px', borderRight: '1px solid #e5e7eb', overflow: 'auto', backgroundColor: '#fafafa' }}>
            {[
              { subject: 'Welcome to Email Onebox - Demo Mode', from: 'noreply@email-onebox.com', preview: 'This is a demo showing the full interface...' },
              { subject: 'AI-Powered Email Organization', from: 'demo@email-onebox.com', preview: 'Email Onebox uses AI to automatically categorize...' },
              { subject: 'Features Overview', from: 'demo@email-onebox.com', preview: 'Features include: Email aggregation...' }
            ].map((email, i) => (
              <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', backgroundColor: i === 0 ? '#f0f9ff' : 'white', borderLeft: i === 0 ? '3px solid #0369a1' : 'none' }}>
                <p style={{ fontWeight: i === 0 ? '600' : '500', margin: '0 0 4px 0', fontSize: '13px' }}>{email.subject}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>{email.from}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.preview}</p>
              </div>
            ))}
          </div>

          {/* Email Detail */}
          <div style={{ flex: 1, padding: '24px', overflow: 'auto', backgroundColor: '#f9fafb' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>Welcome to Email Onebox - Demo Mode</h2>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>From: <strong>noreply@email-onebox.com</strong></p>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>To: <strong>you@example.com</strong></p>
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />
              <div style={{ lineHeight: '1.6', color: '#374151', fontSize: '14px' }}>
                <p>This is a demo email. The backend API is not currently running. In production, real emails from your Gmail, Outlook, and other accounts would appear here.</p>
                <p><strong>Backend Status:</strong> Not connected</p>
                <p><strong>Demo Mode:</strong> Active - showing sample emails</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
