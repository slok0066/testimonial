import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <div style={{ padding: '20px', fontFamily: 'sans-serif', fontSize: '24px' }}>
      Test Successful
    </div>
  );
}
