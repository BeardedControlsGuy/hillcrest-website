// Pulls upcoming published events from Planning Center and writes
// src/data/events-synced.json so the Events page can render them natively,
// with Register buttons deep-linking into Church Center.
//
// Requires a Planning Center Personal Access Token in env:
//   PCO_APP_ID, PCO_SECRET   (create at https://api.planningcenteronline.com/oauth/applications)
// Without credentials the script exits cleanly and the existing JSON is kept.
import { writeFileSync } from 'node:fs';

const { PCO_APP_ID, PCO_SECRET } = process.env;
const OUT = new URL('../src/data/events-synced.json', import.meta.url);

if (!PCO_APP_ID || !PCO_SECRET) {
  console.log('PCO_APP_ID / PCO_SECRET not set; skipping Planning Center sync.');
  process.exit(0);
}

const auth = 'Basic ' + Buffer.from(`${PCO_APP_ID}:${PCO_SECRET}`).toString('base64');
const api = async (path) => {
  const res = await fetch(`https://api.planningcenteronline.com${path}`, {
    headers: { Authorization: auth },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
};

// Registrations signups (these carry Church Center registration URLs)
const signups = await api(
  '/registrations/v2/signups?filter=unarchived,published&order=starts_at&per_page=50'
);

const events = (signups.data ?? []).map((s) => {
  const a = s.attributes ?? {};
  return {
    name: a.name,
    description: a.description_plain ?? '',
    starts_at: a.starts_at,
    ends_at: a.ends_at,
    location: a.location_name ?? '',
    image: a.logo_url ?? '',
    register_url: a.new_registration_url ?? a.public_url ?? '',
    open: a.open_for_registrations ?? true,
  };
}).filter((e) => e.name && (!e.ends_at || new Date(e.ends_at) > new Date()));

writeFileSync(
  OUT,
  JSON.stringify({ synced_at: new Date().toISOString(), events }, null, 2) + '\n'
);
console.log(`Wrote ${events.length} events from Planning Center.`);
