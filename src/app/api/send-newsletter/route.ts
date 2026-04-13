import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

interface NewsletterPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage?: any;
  publishedAt: string;
  readTime?: number;
}

interface SendNewsletterRequest {
  // Legacy format
  subject?: string;
  content?: string;
  
  // New structured format
  title?: string;
  posts?: NewsletterPost[];
  editorNote?: string;
  
  // Scheduling and filtering
  scheduledFor?: string | null;
  filters?: {
    status?: string;
    category?: string;
  };
}

export async function POST(req: Request) {
  try {
    const body: SendNewsletterRequest = await req.json();
    
    // Determine format and extract data
    const isStructured = !!body.posts;
    const subject = isStructured ? body.title : body.subject;
    const posts = isStructured ? body.posts : null;
    const editorNote = isStructured ? body.editorNote : null;
    const scheduledFor = body.scheduledFor;
    const filters = body.filters || { status: 'active', category: 'all' };
    
    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Missing subject/title" }, 
        { status: 400 }
      );
    }

    // Validate posts exist for structured format
    if (isStructured && (!posts || posts.length === 0)) {
      return NextResponse.json(
        { success: false, error: "No posts provided for structured newsletter" }, 
        { status: 400 }
      );
    }

    // If scheduling for later, save to database and return
    if (scheduledFor && new Date(scheduledFor) > new Date()) {
      const { data: scheduledNewsletter, error: scheduleError } = await supabase
        .from("newsletter")
        .insert({
          title: subject,
          content: isStructured ? { posts, editorNote } : body.content,
          status: "scheduled",
          scheduled_for: scheduledFor,
          metadata: {
            filters,
            post_count: posts?.length || 0,
            format: isStructured ? "structured" : "legacy"
          }
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      return NextResponse.json({
        success: true,
        scheduled: true,
        id: scheduledNewsletter.id,
        scheduledFor,
        message: `Newsletter scheduled for ${scheduledFor}`
      });
    }

    // Build subscriber query
    let subscriberQuery = supabase
      .from("newsletter_subscribers")
      .select("*");

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      subscriberQuery = subscriberQuery.eq("status", filters.status);
    } else {
      // Default to active only
      subscriberQuery = subscriberQuery.eq("status", "active");
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      subscriberQuery = subscriberQuery.contains("category_interest", [filters.category]);
    }

    const { data: subscribers, error: fetchError } = await subscriberQuery;

    if (fetchError) throw fetchError;

    if (!subscribers?.length) {
      return NextResponse.json({ 
        success: true, 
        message: "No subscribers match the selected filters",
        filters 
      });
    }

    // Generate email content
    let emailHtml: string;

    if (isStructured) {
      // TypeScript now knows posts is defined here due to validation above
      emailHtml = generateStructuredEmail(subject, posts!, editorNote || undefined);
    } else {
      emailHtml = generateLegacyEmail(subject, body.content || "");
    }

    // Send emails
    const results = await Promise.all(
      subscribers.map(async (user) => {
        if (!user.unsubscribe_token) {
          console.warn(`Skipping user ${user.email} due to missing unsubscribe token`);
          return { email: user.email, status: "skipped", reason: "missing_token" };
        }

        const unsubscribeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${user.unsubscribe_token}`;

        const personalizedHtml = emailHtml.replace(
          /{{name}}/g,
          user.name || "Friend"
        ).replace(
          /{{unsubscribe_link}}/g,
          unsubscribeLink
        );

        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Shama Landscapes <journal@shamalandscapes.co.ke>",
              to: user.email,
              subject,
              html: personalizedHtml,
              tags: [
                { name: "newsletter", value: "quarterly" },
                { name: "source", value: "admin_portal" }
              ]
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to send to ${user.email}:`, errorText);
            return { email: user.email, status: "failed", error: errorText };
          }

          return { email: user.email, status: "sent" };
          } catch (err) {
            console.error(`Error sending to ${user.email}:`, err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            return { email: user.email, status: "error", error: errorMessage };
          }
      })
    );

    // Save send record
    await supabase.from("newsletter_sends").insert({
      title: subject,
      recipient_count: subscribers.length,
      sent_at: new Date().toISOString(),
      results: results,
      metadata: {
        filters,
        post_count: posts?.length || 0,
        format: isStructured ? "structured" : "legacy"
      }
    });

    return NextResponse.json({
      success: true,
      sent: true,
      recipientCount: subscribers.length,
      results: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed" || r.status === "error").length,
      details: results
    });

        } catch (err) {
          console.error("Newsletter send error:", err);
          const errorMessage = err instanceof Error ? err.message : "Internal server error";
          return NextResponse.json(
            { success: false, error: errorMessage }, 
            { status: 500 }
          );
        }
}

function generateLegacyEmail(subject: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:system-ui, -apple-system, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color:#264653; padding:30px; text-align:center;">
                  <h1 style="color:#E9C46A; margin:0; font-size:24px; font-weight:900;">Shama Landscapes</h1>
                  <p style="color:#ffffff; margin:8px 0 0 0; font-size:14px; opacity:0.8;">Journal</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background-color:#f8f9fa; padding:30px; text-align:center; border-top:1px solid #e9ecef;">
                  <p style="color:#6c757d; font-size:12px; margin:0;">
                    Shama Landscapes • journal@shamalandscapes.co.ke<br>
                    <a href="{{unsubscribe_link}}" style="color:#264653;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function generateStructuredEmail(
  title: string, 
  posts: NewsletterPost[], 
  editorNote?: string
): string {
  const { projectId, dataset } = require('@/sanity/env');
  
  const getImageUrl = (mainImage: any) => {
    if (!mainImage?.asset) return '';
    const ref = mainImage.asset._ref || '';
    const match = ref.match(/image-([a-z0-9]+)-\d+x\d+-([a-z]+)/);
    if (!match) return '';
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.${match[2]}`;
  };

  const postsHtml = posts.map((post, index) => `
    <tr>
      <td style="padding:30px; ${index > 0 ? 'border-top:1px solid #e9ecef;' : ''}">
        ${post.mainImage ? `
          <img src="${getImageUrl(post.mainImage)}?w=600&h=300&fit=crop" 
               alt="${post.title}" 
               style="width:100%; height:auto; border-radius:8px; margin-bottom:16px;">
        ` : ''}
        <span style="color:#E9C46A; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">
          Article ${index + 1}
        </span>
        <h2 style="color:#264653; font-size:22px; font-weight:700; margin:8px 0 12px 0;">
          ${post.title}
        </h2>
        <p style="color:#6c757d; font-size:16px; line-height:1.6; margin:0 0 16px 0;">
          ${post.excerpt}
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}" 
           style="display:inline-block; color:#264653; font-weight:600; text-decoration:none; border-bottom:2px solid #E9C46A;">
          Read full article →
        </a>
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#F5EBE8; font-family:system-ui, -apple-system, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EBE8;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(38,70,83,0.12);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #264653 0%, #1a3238 100%); padding:40px 30px; text-align:center;">
                  <h1 style="color:#E9C46A; margin:0; font-size:28px; font-weight:900; letter-spacing:-0.5px;">Shama Landscapes</h1>
                  <div style="width:40px; height:3px; background:#E9C46A; margin:12px auto;"></div>
                  <p style="color:#ffffff; margin:0; font-size:14px; opacity:0.9; letter-spacing:2px; text-transform:uppercase;">Quarterly Journal</p>
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td style="padding:40px 30px 20px 30px; text-align:center;">
                  <h2 style="color:#264653; font-size:24px; font-weight:800; margin:0; line-height:1.3;">
                    ${title}
                  </h2>
                </td>
              </tr>

              <!-- Editor's Note -->
              ${editorNote ? `
              <tr>
                <td style="padding:0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EBE8; border-radius:12px; border-left:4px solid #E9C46A;">
                    <tr>
                      <td style="padding:24px;">
                        <p style="color:#264653; font-size:16px; line-height:1.7; margin:0; font-style:italic;">
                          "${editorNote}"
                        </p>
                        <p style="color:#264653; font-size:14px; margin:12px 0 0 0; font-weight:600; text-align:right;">
                          — The Shama Team
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ` : ''}

              <!-- Posts -->
              ${postsHtml}

              <!-- Footer -->
              <tr>
                <td style="background-color:#264653; padding:30px; text-align:center;">
                  <p style="color:#ffffff; font-size:14px; margin:0 0 8px 0; opacity:0.9;">
                    Shama Landscapes
                  </p>
                  <p style="color:#E9C46A; font-size:12px; margin:0 0 16px 0;">
                    journal@shamalandscapes.co.ke
                  </p>
                  <p style="color:#ffffff; font-size:11px; margin:0; opacity:0.6;">
                    <a href="{{unsubscribe_link}}" style="color:#E9C46A; text-decoration:none;">Unsubscribe</a> • 
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog" style="color:#E9C46A; text-decoration:none;">View in Browser</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}