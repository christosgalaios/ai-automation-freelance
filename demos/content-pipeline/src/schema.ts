import { z } from 'zod';

export const SocialPostSchema = z.object({
  platform: z.enum(['twitter', 'linkedin', 'instagram', 'facebook', 'threads']),
  content: z.string().min(1).max(2200),
  characterCount: z.number().int().positive(),
});

export const BlogOutlineSchema = z.object({
  title: z.string().min(1),
  metaDescription: z.string().max(160),
  sections: z.array(
    z.object({
      heading: z.string(),
      subpoints: z.array(z.string()),
      estimatedWordCount: z.number().int().positive(),
    })
  ),
  estimatedReadTime: z.string(),
  targetKeywords: z.array(z.string()),
});

export const PostingScheduleSchema = z.object({
  platform: z.string(),
  bestDays: z.array(z.string()),
  bestTimes: z.array(z.string()),
  frequency: z.string(),
  rationale: z.string(),
});

export const ContentOutputSchema = z.object({
  topic: z.string(),
  generatedAt: z.string(),
  socialPosts: z.array(SocialPostSchema),
  blogOutline: BlogOutlineSchema,
  hashtags: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
    niche: z.array(z.string()),
  }),
  postingSchedule: z.array(PostingScheduleSchema),
});

export type ContentOutput = z.infer<typeof ContentOutputSchema>;
export type SocialPost = z.infer<typeof SocialPostSchema>;
export type BlogOutline = z.infer<typeof BlogOutlineSchema>;
