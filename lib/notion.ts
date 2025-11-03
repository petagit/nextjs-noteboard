import { Client } from '@notionhq/client';
import { Note } from '@/types';

// Convert HTML to Notion blocks
function htmlToNotionBlocks(html: string): any[] {
  if (!html) {
    return [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Empty note',
              },
            },
          ],
        },
      },
    ];
  }

  // Strip HTML and convert to plain text paragraphs
  const text = html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

  if (!text) {
    return [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Empty note',
              },
            },
          ],
        },
      },
    ];
  }

  // Split into paragraphs and create blocks
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim());
  
  return paragraphs.map((paragraph: string) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: trimmed,
            },
          },
        ],
      },
    };
  }).filter(Boolean) as any[];
}

export async function syncNoteToNotion(note: Note, notionDatabaseId: string, notionToken: string): Promise<string | null> {
  // Validate token format
  if (!notionToken.startsWith('secret_')) {
    throw new Error('Invalid Notion token format. Token must start with "secret_". Please get your Internal Integration Token from https://www.notion.so/my-integrations');
  }

  // Validate database ID format (should be 32 characters, may have hyphens)
  const cleanDbId = notionDatabaseId.replace(/-/g, '');
  if (cleanDbId.length !== 32) {
    throw new Error('Invalid Database ID format. Database ID should be 32 characters. Get it from your database URL or settings.');
  }

  try {
    const notion = new Client({
      auth: notionToken,
    });

    // Convert HTML content to Notion blocks
    const blocks = htmlToNotionBlocks(note.content);

    // Create page in Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: cleanDbId.length === 32 ? cleanDbId : notionDatabaseId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: note.title,
              },
            },
          ],
        },
      },
      children: blocks,
    });

    return response.id;
  } catch (error: any) {
    console.error('Error syncing to Notion:', error);
    
    // Provide more helpful error messages
    if (error.code === 'unauthorized') {
      throw new Error('Unauthorized: Invalid token or token does not have access to the database. Check your integration token and make sure it\'s connected to the database.');
    } else if (error.code === 'object_not_found') {
      throw new Error('Database not found: Invalid Database ID or integration does not have access. Make sure you connected the integration to the database.');
    } else if (error.code === 'validation_error') {
      throw new Error(`Validation error: ${error.message}. Make sure the database has a "Title" property.`);
    } else if (error.message) {
      throw new Error(`Notion API error: ${error.message}`);
    } else {
      throw new Error(`Failed to sync to Notion: ${JSON.stringify(error)}`);
    }
  }
}

export async function syncAllNotesToNotion(
  notes: Note[],
  notionDatabaseId: string,
  notionToken: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const note of notes) {
    try {
      await syncNoteToNotion(note, notionDatabaseId, notionToken);
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`${note.title}: ${error.message}`);
    }
  }

  return { success, failed, errors };
}

