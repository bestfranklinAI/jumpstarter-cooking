// src/components/common/TrustPanel.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Proof {
  network: string;
  dealId: string;
  contentHash: string; // 0x...
  txHash: string; // 0x...
  blockNumber: number;
  anchorTimestamp: string; // ISO
  signer: string;
  canonical: string; // canonical message string
}

interface TrustPanelProps {
  dealId: string;
  name: string;
}

function shortHash(h: string, left = 8, right = 6) {
  if (!h) return '';
  return h.length > left + right + 2 ? `${h.slice(0, left)}…${h.slice(-right)}` : h;
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  return '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const TrustPanel: React.FC<TrustPanelProps> = ({ dealId, name }) => {
  const [proof, setProof] = useState<Proof | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProof = useCallback(async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${dealId}/proof`);
      if (!res.ok) throw new Error('Unable to load proof');
      const json = (await res.json()) as Proof;
      setProof(json);
      // Cross-verify contentHash locally
      const local = await sha256Hex(json.canonical);
      setVerified(local === json.contentHash);
    } catch (e: any) {
      setError(e?.message ?? 'Verification failed');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchProof();
  }, [fetchProof]);

  const statusLabel = useMemo(() => {
    if (verifying) return 'Verifying…';
    if (verified) return 'Verified on-chain';
    if (verified === false) return 'Verification mismatch';
    return 'Unknown';
  }, [verifying, verified]);

  const copy = (value: string) => navigator.clipboard?.writeText(value);

  return (
    <section className="trust-panel" aria-live="polite">
      <header className="trust-panel__header">
        <div className={`trust-badge ${verified ? 'ok' : verified === false ? 'fail' : ''}`} aria-label={statusLabel}>
          {verifying ? '…' : verified ? '✓' : verified === false ? '!' : '?'}
        </div>
        <div>
          <p className="eyebrow">Traceability</p>
          <h3>Blockchain verifiability</h3>
          <p className="meta">This listing for “{name}” is anchored on {proof?.network ?? 'Testnet'}. Data below is locally verified.</p>
        </div>
        <div className="trust-actions">
          <button className="secondary" onClick={fetchProof} disabled={verifying}>Verify again</button>
        </div>
      </header>

      {error ? <div className="error-state compact">{error}</div> : null}

      <div className="trust-grid">
        <div>
          <label>Content hash</label>
          <code className="code" title={proof?.contentHash}>{shortHash(proof?.contentHash ?? '')}</code>
          {proof?.contentHash ? <button className="ghost" onClick={() => copy(proof.contentHash)}>Copy</button> : null}
        </div>
        <div>
          <label>Transaction</label>
          <code className="code" title={proof?.txHash}>{shortHash(proof?.txHash ?? '')}</code>
          {proof?.txHash ? <button className="ghost" onClick={() => copy(proof.txHash)}>Copy</button> : null}
        </div>
        <div>
          <label>Block</label>
          <span>{proof?.blockNumber ?? '—'}</span>
        </div>
        <div>
          <label>Anchored at</label>
          <span>{proof ? new Date(proof.anchorTimestamp).toLocaleString() : '—'}</span>
        </div>
        <div>
          <label>Signer</label>
          <span>{proof?.signer ?? '—'}</span>
        </div>
        <div className="trust-explorer">
          <label>Explorer</label>
          <a role="button" className="ghost" target="_blank" rel="noreferrer" href="#" aria-disabled="true">View on testnet explorer</a>
        </div>
      </div>

      {proof ? (
        <details className="trust-details">
          <summary>Show canonical record</summary>
          <pre className="code-block" aria-label="Canonical message"><code>{proof.canonical}</code></pre>
        </details>
      ) : null}
    </section>
  );
}
