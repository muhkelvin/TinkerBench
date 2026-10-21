'use server';

import { createAdminClient, verifyAdmin } from '@/lib/supabase/server';
import { validateImageFile } from '@/lib/validation';

export async function uploadMedia(formData: FormData) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang dapat mengunggah media.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'File tidak ditemukan dalam request.' };
  }

  const validation = validateImageFile({
    size: file.size,
    type: file.type,
    name: file.name,
  });

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const supabase = await createAdminClient();

  // Create unique safe filename: timestamp-random.ext
  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'webp';
  const safeRandom = Math.random().toString(36).substring(2, 9);
  const filePath = `uploads/${Date.now()}-${safeRandom}.${cleanExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);

  return {
    success: true,
    path: filePath,
    url: publicUrlData.publicUrl,
  };
}
