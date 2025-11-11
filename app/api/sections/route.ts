import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: sections, error } = await supabase
    .from('section_hierarchy')
    .select('id, name, slug, level, parent_id, breadcrumb_slugs')
    .order('level', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }

  return NextResponse.json({ sections })
}