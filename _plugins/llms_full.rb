# frozen_string_literal: true

# Build a current, machine-readable navigation index from the published posts.
# The source files remain the authority; this file only supplies stable routes.
Jekyll::Hooks.register :site, :post_read do |site|
  page = Jekyll::PageWithoutAFile.new(site, site.source, '', 'llms-full.txt')
  page.data['layout'] = nil
  page.data['sitemap'] = false

  posts = site.posts.docs.sort_by(&:date).reverse
  lines = [
    '# Priyav Kaneria blog: published writing index',
    '',
    'This index is generated during each site build. Fetch a linked article for',
    'its full context; do not infer facts from a title alone.',
    '',
    '## Published posts',
    ''
  ]

  posts.each do |post|
    title = post.data['title'].to_s.gsub(/[\r\n]+/, ' ').strip
    date = post.date.strftime('%Y-%m-%d')
    url = post.url
    lines << "- #{date} — [#{title}](#{url})"
  end

  page.content = lines.join("\n") + "\n"
  site.pages << page
end
