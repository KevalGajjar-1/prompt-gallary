import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/prompts:', error);
      throw new Error('Database error occurred');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/prompts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;

    if (!title?.trim() || !description?.trim() || !image) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: !title ? 'Title is required' : 
                  !description ? 'Description is required' : 'Image is required'
        },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const imageBuffer = await image.arrayBuffer();
    const imageUint8 = new Uint8Array(imageBuffer);
    
    // Import sharp
    const sharp = (await import('sharp')).default;
    
    // Process image with sharp
    let processedImage: Buffer;
    try {
      processedImage = await sharp(imageUint8)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 80,
          mozjpeg: true,
          progressive: true
        })
        .toBuffer();
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }

    // Generate a unique filename with jpg extension
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
    
    // Upload processed image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('prompt-images')
      .upload(fileName, processedImage, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('prompt-images')
      .getPublicUrl(fileName);

    // Save prompt to database
    const { data, error: insertError } = await supabase
      .from('prompts')
      .insert([
        { 
          title: title.trim(), 
          description: description.trim(), 
          image_url: publicUrl 
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      // Attempt to clean up the uploaded image if database insert fails
      await supabase.storage
        .from('prompt-images')
        .remove([fileName])
        .catch(console.error);
      
      throw new Error('Failed to save prompt to database');
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/prompts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
