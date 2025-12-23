import { supabase } from '@/services/supabase'

export async function sendHostApplicationEmails({
  applicantEmail,
  applicantName,
  applicantId,
  appliedAt,
  siteUrl
}) {
  const { data, error } = await supabase.functions.invoke('send-host-application-emails', {
    body: {
      applicantEmail,
      applicantName,
      applicantId,
      appliedAt,
      siteUrl
    }
  })

  if (error) throw error
  return data
}
