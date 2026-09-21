import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { person } from '../data/person';

export async function GET(context: APIContext) {
  const notes = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: `${person.name} — writing`,
    description: 'Notes: experiments, numbers, what did not work.',
    site: context.site!,
    items: notes.map((n) => ({
      title: n.data.title,
      pubDate: n.data.date,
      description: n.data.summary,
      link: `/writing/${n.id}/`,
    })),
  });
}
