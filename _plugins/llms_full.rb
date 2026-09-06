# frozen_string_literal: true

# Build a current, machine-readable navigation index from the published posts.
# The source files remain the authority; this file only supplies stable routes.
Jekyll::Hooks.register :site, :post_read do |site|
  page = Jekyll::PageWithoutAFile.new(site, site.source, '', 'llms-full.txt')
  page.data['layout'] = nil
  page.data['sitemap'] = false

  posts = site.posts.docs.sort_by(&:date).reverse
  pinned_posts = posts.select { |post| post.data['pin'] == true }
  weekly_logs = posts.select do |post|
    Array(post.data['categories']).map(&:downcase).include?('logs')
  end
  lines = [
    '# Priyav Kaneria blog: published writing index',
    '',
    'This index is generated during each site build. Fetch a linked article for',
    'its full context; do not infer facts from a title alone.',
    ''
  ]

  unless pinned_posts.empty?
    lines.concat([
      '## Contextual pinned writing',
      '',
      'These pinned essays are a starting point for understanding recurring',
      'themes in Priyav\'s public writing. Fetch the linked post for context.',
      ''
    ])
    pinned_posts.each do |post|
      lines << "- #{post.date.strftime('%Y-%m-%d')} — [#{post.data['title'].to_s.gsub(/[\r\n]+/, ' ').strip}](#{post.url})"
    end
    lines << ''
  end

  unless weekly_logs.empty?
    lines.concat([
      '## Latest weekly public-diary entries',
      '',
      'Weekly logs are the primary public source for recently active work,',
      'projects, learning, and interests. This list is generated newest first.',
      ''
    ])
    weekly_logs.first(12).each do |post|
      lines << "- #{post.date.strftime('%Y-%m-%d')} — [#{post.data['title'].to_s.gsub(/[\r\n]+/, ' ').strip}](#{post.url})"
    end
    lines << ''
  end

  lines.concat(['## Published posts', ''])

  posts.each do |post|
    title = post.data['title'].to_s.gsub(/[\r\n]+/, ' ').strip
    date = post.date.strftime('%Y-%m-%d')
    url = post.url
    lines << "- #{date} — [#{title}](#{url})"
  end

  page.content = lines.join("\n") + "\n"
  site.pages << page
end
