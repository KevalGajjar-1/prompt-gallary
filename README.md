# Prompt Gallery

A modern web application for managing and showcasing AI prompts with images. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Browse a grid of prompts with images
- Add new prompts with images
- Edit existing prompts
- Delete prompts
- Responsive design that works on all devices
- Modern UI with dark/light mode support

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with DaisyUI
- **Database**: PostgreSQL (hosted on Supabase)
- **File Storage**: Supabase Storage
- **Deployment**: Vercel
- **Type Safety**: TypeScript

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Supabase account (free tier available)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/prompt-gallery.git
   cd prompt-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up the database**
   - Create a new table named `prompts` in your Supabase database with the following schema:
     ```sql
     create table public.prompts (
       id uuid default gen_random_uuid() primary key,
       title text not null,
       description text not null,
       image_url text,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null,
       updated_at timestamp with time zone default timezone('utc'::text, now()) not null
     );
     ```
   - Set up Row Level Security (RLS) policies as needed
   - Create a storage bucket named 'prompt-images' in Supabase Storage

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
/src
  /app                  # App Router
    /api                # API routes
      /prompts          # Prompts API endpoints
        /[id]           # Dynamic route for single prompt operations
    /add                # Add new prompt page
    /edit/[id]          # Edit prompt page
  /components           # Reusable components
  /lib                  # Utility functions and libraries
    /supabase.ts        # Supabase client configuration
  /types                # TypeScript type definitions
```

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the project on Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

You can also deploy to other platforms that support Next.js applications. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

| Variable Name | Description | Required |
|---------------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
