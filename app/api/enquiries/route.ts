import {database} from '@/lib/database';
import {deliverables,formats} from '@/lib/content';
import {getPublishedContent} from '@/lib/managed-content';
interface EnquiryPayload {
  website?: unknown;
  name?: unknown;
  company?: unknown;
  country?: unknown;
  email?: unknown;
  message?: unknown;
  consent?: unknown;
  projectType?: unknown;
  submissionId?: unknown;
  fileLink?: unknown;
  scale?: unknown;
  schedule?: unknown;
  services?: unknown;
  deliverables?: unknown;
  formats?: unknown;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const reply = (data: object, status = 200) =>
    Response.json(data, {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return reply({ error: 'Please send the enquiry from this website.' }, 403);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return reply({ error: 'Unsupported request format.' }, 415);
  }

  if (Number(request.headers.get('content-length') || 0) > 24000) {
    return reply({ error: 'The enquiry is too long.' }, 413);
  }

  let data: EnquiryPayload;
  try {
    const raw = await request.text();
    if (raw.length > 24000) return reply({ error: 'The enquiry is too long.' }, 413);
    data = JSON.parse(raw);
  } catch {
    return reply({ error: 'Please check the enquiry and try again.' }, 400);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return reply({ error: 'Invalid enquiry.' }, 400);
  }

  if (data.website) {
    return reply({ error: 'The enquiry could not be accepted.' }, 400);
  }

  const str = (name: string, max = 200) =>
    typeof data[name] === 'string' &&
    (data[name] as string).trim().length > 0 &&
    (data[name] as string).length <= max;

  const projectTypes = [
    'PEB / portal frame',
    'Multi-storey steel',
    'Industrial structure',
    'Platform / walkway',
    'Stairs / handrails',
    'Mixed or other steelwork',
  ];

  const resolvedProjectType =
    typeof data.projectType === 'string' && projectTypes.includes(data.projectType)
      ? data.projectType
      : 'Mixed or other steelwork';

  if (
    !str('name') ||
    !str('company') ||
    !str('country') ||
    !str('email') ||
    typeof data.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    !str('message', 6000) ||
    typeof data.message !== 'string' ||
    data.message.trim().length < 20 ||
    data.consent !== true ||
    (data.projectType && (typeof data.projectType !== 'string' || !projectTypes.includes(data.projectType))) ||
    typeof data.submissionId !== 'string' ||
    !/^[0-9a-f-]{36}$/.test(data.submissionId)
  ) {
    return reply(
      { error: 'Check the required fields, business email, message (at least 20 characters) and consent.' },
      400
    );
  }

  if (data.fileLink && typeof data.fileLink !== 'string') {
    return reply({ error: 'Invalid file-sharing link format.' }, 400);
  }
  if (typeof data.fileLink === 'string' && data.fileLink.length > 1000) {
    return reply({ error: 'Please keep the file-sharing link under 1000 characters.' }, 400);
  }

  const {services}=(await getPublishedContent()).settings;
  const allowedCollections: [string, string[]][] = [
    ['services', services.map((x) => x.title)],
    ['deliverables', deliverables],
    ['formats', formats],
  ];

  for (const [key, allowed] of allowedCollections) {
    const val = data[key];
    if (val !== undefined) {
      if (
        !Array.isArray(val) ||
        val.length > allowed.length ||
        val.some((v: unknown) => typeof v !== 'string' || !allowed.includes(v))
      ) {
        return reply({ error: 'Choose valid services, deliverables and file formats.' }, 400);
      }
    }
  }

  for (const key of ['scale', 'schedule']) {
    const val = data[key];
    if (val !== undefined && (typeof val !== 'string' || val.length > 300)) {
      return reply({ error: 'Please keep scale and schedule descriptions under 300 characters.' }, 400);
    }
  }

  try {
    const db = database();
    const now = new Date().toISOString();
    const ip =
      (process.env.VERCEL
        ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        : request.headers.get('cf-connecting-ip')) || 'local';

    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + now.slice(0, 10)));
    const hash = Array.from(new Uint8Array(bytes))
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');

    const recent = await db
      .prepare('SELECT count(*) AS total FROM enquiries WHERE request_hash = ? AND created_at > ?')
      .bind(hash, new Date(Date.now() - 3600000).toISOString())
      .first<{ total: number }>();

    if ((recent?.total || 0) >= 5) {
      return reply({ error: 'Several enquiries have been received. Please try again in an hour.' }, 429);
    }

    const details = JSON.stringify({
      fileLink: typeof data.fileLink === 'string' ? data.fileLink.trim() : '',
      scale: typeof data.scale === 'string' ? data.scale.trim() : '',
      schedule: typeof data.schedule === 'string' ? data.schedule.trim() : '',
      services: Array.isArray(data.services) ? data.services : [],
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
      formats: Array.isArray(data.formats) ? data.formats : [],
      message: (data.message as string).trim(),
    });

    await db
      .prepare(
        'INSERT INTO enquiries (id,created_at,name,company,email,country,project_type,details,consent_at,request_hash) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING'
      )
      .bind(
        data.submissionId,
        now,
        (data.name as string).trim(),
        (data.company as string).trim(),
        (data.email as string).trim(),
        (data.country as string).trim(),
        resolvedProjectType,
        details,
        now,
        hash
      )
      .run();

    return reply({ ok: true, reference: data.submissionId.slice(0, 8).toUpperCase() }, 201);
  } catch {
    return reply(
      {
        error:
          'Your enquiry could not be saved at the moment. Your information is still in the form; please try again.',
      },
      503
    );
  }
}

