import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, error: queryError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (queryError) {
      console.error('Supabase error in GET /api/prompts/[id]:', queryError);
      return NextResponse.json(
        { error: 'Failed to fetch prompt', details: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in GET /api/prompts/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;
    const currentImageUrl = formData.get('currentImageUrl') as string | null;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: !title ? 'Title is required' : 'Description is required'
        },
        { status: 400 }
      );
    }

    let imageUrl: string | null = currentImageUrl;
    let newFileName: string | null = null;

    try {
      // If a new image is provided, upload it
      if (image) {
        // Generate a unique filename
        const fileExt = image.name.split('.').pop();
        newFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        // Upload new image
        const { error: uploadError } = await supabase.storage
          .from('prompt-images')
          .upload(newFileName, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error('Failed to upload new image');
        }

        // Get the public URL for the new image
        const { data: urlData } = await supabase.storage
          .from('prompt-images')
          .getPublicUrl(newFileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Update prompt in database
      const { data, error: updateError } = await supabase
        .from('prompts')
        .update({ 
          title: title.trim(), 
          description: description.trim(), 
          ...(imageUrl && { image_url: imageUrl }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating prompt:', updateError);
        throw new Error('Failed to update prompt in database');
      }

      // If we uploaded a new image and had a previous one, delete the old one
      if (newFileName && currentImageUrl) {
        const oldFileName = currentImageUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('prompt-images')
            .remove([oldFileName])
            .catch(console.error); // Don't fail if deletion fails
        }
      }

      return NextResponse.json(data);
    } catch (error) {
      // Clean up the uploaded file if there was an error
      if (newFileName) {
        await supabase.storage
          .from('prompt-images')
          .remove([newFileName])
          .catch(console.error);
      }
      throw error; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('Error in PUT /api/prompts/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // First get the prompt to delete its image
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // No rows found
        return new Response(null, { status: 204 });
      }
      console.error('Error fetching prompt for deletion:', fetchError);
      throw new Error('Failed to fetch prompt for deletion');
    }

    // Delete the image from storage if it exists
    if (prompt?.image_url) {
      try {
        const fileName = prompt.image_url.split('/').pop();
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('prompt-images')
            .remove([fileName]);
          
          if (deleteError) {
            console.error('Error deleting image:', deleteError);
            // Continue with prompt deletion even if image deletion fails
          }
        }
      } catch (imageError) {
        console.error('Error during image deletion:', imageError);
        // Continue with prompt deletion even if image deletion fails
      }
    }

    // Delete the prompt from the database
    const { error: deleteError } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting prompt:', deleteError);
      throw new Error('Failed to delete prompt from database');
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/prompts/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
