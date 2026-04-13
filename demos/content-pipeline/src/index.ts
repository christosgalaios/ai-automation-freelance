import { runContentPipeline } from './pipeline.js';

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error('Usage: node dist/index.js "<topic>"');
    console.error('Example: node dist/index.js "AI automation for small businesses"');
    process.exit(1);
  }

  console.log(`\nGenerating content for: "${topic}"\n`);
  console.log('This calls the Anthropic API — ensure ANTHROPIC_API_KEY is set.\n');

  try {
    const output = await runContentPipeline(topic);

    console.log('=== SOCIAL POSTS ===\n');
    for (const post of output.socialPosts) {
      console.log(`[${post.platform.toUpperCase()}] (${post.characterCount} chars)`);
      console.log(post.content);
      console.log();
    }

    console.log('=== BLOG OUTLINE ===\n');
    console.log(`Title: ${output.blogOutline.title}`);
    console.log(`Meta: ${output.blogOutline.metaDescription}`);
    console.log(`Read time: ${output.blogOutline.estimatedReadTime}\n`);
    for (const section of output.blogOutline.sections) {
      console.log(`  ## ${section.heading} (~${section.estimatedWordCount} words)`);
      for (const pt of section.subpoints) {
        console.log(`    - ${pt}`);
      }
    }

    console.log('\n=== HASHTAGS ===\n');
    console.log('Primary:', output.hashtags.primary.join(' '));
    console.log('Secondary:', output.hashtags.secondary.join(' '));
    console.log('Niche:', output.hashtags.niche.join(' '));

    console.log('\n=== POSTING SCHEDULE ===\n');
    for (const sched of output.postingSchedule) {
      console.log(`${sched.platform}: ${sched.frequency} | Best: ${sched.bestDays.join(', ')} at ${sched.bestTimes.join(', ')}`);
    }
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
