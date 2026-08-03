# frozen_string_literal: true

# Jekyll renders Markdown pages as HTML. Agent Skills discovery requires the
# skill artifact itself to be served as SKILL.md, so copy the hidden source to
# its public well-known path as a static file.
class AgentSkillStaticFile < Jekyll::StaticFile
  def destination(dest)
    File.join(dest, '.well-known', 'agent-skills', 'site-reading', 'SKILL.md')
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  site.static_files << AgentSkillStaticFile.new(
    site,
    site.source,
    '.agent-skills/site-reading',
    'SKILL.md'
  )
end
