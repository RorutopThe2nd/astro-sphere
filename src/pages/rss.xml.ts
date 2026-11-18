import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@consts"

type Context = {
  site: string
}

export async function GET(context: Context) {
  const posts = await getCollection("blog", (entry) => !entry.data.draft)
  const projects = await getCollection("projects", (entry) => !entry.data.draft)

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
    ...projects.map((project) => ({
      title: project.data.title,
      description: project.data.summary,
      pubDate: project.data.date,
      link: `/projects/${project.id}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items,
  })
}
