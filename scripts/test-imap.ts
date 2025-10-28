import Imap from 'node-imap';
import dotenv from 'dotenv';

dotenv.config();

const testImapConnection = async () => {
  console.log('🧪 Testing IMAP connection...\n');

  const config = {
    user: process.env.EMAIL1_USER!,
    password: process.env.EMAIL1_PASSWORD!,
    host: process.env.EMAIL1_HOST!,
    port: parseInt(process.env.EMAIL1_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  };

  console.log(`Testing: ${config.user} on ${config.host}:${config.port}\n`);

  const imap = new Imap(config);

  imap.once('ready', () => {
    console.log('✅ IMAP connection successful!');
    
    imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        console.error('❌ Error opening INBOX:', err);
        imap.end();
        return;
      }

      console.log(`📬 INBOX opened successfully`);
      console.log(`📊 Total messages: ${box.messages.total}`);
      console.log(`📧 New messages: ${box.messages.new}`);
      
      imap.end();
    });
  });

  imap.once('error', (err: Error) => {
    console.error('❌ IMAP connection error:', err.message);
    process.exit(1);
  });

  imap.once('end', () => {
    console.log('\n✅ IMAP connection test completed!');
    process.exit(0);
  });

  imap.connect();
};

testImapConnection();
