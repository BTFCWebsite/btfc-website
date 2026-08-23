import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  type DiarySession,
} from './clubDiary.server'

export type DiaryAuditEntry = {
  id: string
  at: string
  actorId?: string
  actorName: string
  actorRole: 'member' | 'admin' | 'public' | 'system'
  action: string
  targetType: string
  targetId?: string
  summary: string
}

type StoredAudit = Omit<DiaryAuditEntry, 'id' | 'at'>
type AuditDoc = { _id: string; at: string; payload: string }

export async function writeDiaryAudit(
  session: DiarySession | null,
  action: string,
  targetType: string,
  targetId: string | undefined,
  summary: string,
  publicActorName?: string
) {
  try {
    const at = new Date().toISOString()
    const stored: StoredAudit = {
      actorId: session?.personId || undefined,
      actorName: cleanText(session?.name || publicActorName || 'System', 100),
      actorRole: session?.role || (publicActorName ? 'public' : 'system'),
      action: cleanText(action, 80),
      targetType: cleanText(targetType, 80),
      targetId: cleanText(targetId, 200) || undefined,
      summary: cleanText(summary, 500),
    }

    await getDiaryClient().create({
      _type: 'clubDiaryAudit',
      at,
      payload: encryptDiaryPayload(stored),
    })
  } catch (error) {
    console.error('Unable to write Club Diary audit entry:', error)
  }
}

export async function loadDiaryAudit(limit = 200): Promise<DiaryAuditEntry[]> {
  const safeLimit = Math.max(1, Math.min(500, Math.round(limit)))
  const docs = await getDiaryClient().fetch<AuditDoc[]>(
    `*[_type == "clubDiaryAudit"] | order(at desc)[0...$limit] { _id, at, payload }`,
    { limit: safeLimit },
    { cache: 'no-store' }
  )

  return (docs || []).flatMap((doc) => {
    try {
      const stored = decryptDiaryPayload<StoredAudit>(doc.payload)
      return [{
        id: doc._id,
        at: cleanText(doc.at, 50),
        actorId: cleanText(stored.actorId, 200) || undefined,
        actorName: cleanText(stored.actorName, 100) || 'Unknown',
        actorRole: stored.actorRole,
        action: cleanText(stored.action, 80),
        targetType: cleanText(stored.targetType, 80),
        targetId: cleanText(stored.targetId, 200) || undefined,
        summary: cleanText(stored.summary, 500),
      } satisfies DiaryAuditEntry]
    } catch (error) {
      console.error('Unable to decrypt Club Diary audit entry', doc._id, error)
      return []
    }
  })
}
