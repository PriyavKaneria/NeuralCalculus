# Agent maintenance

This repository publishes the canonical navigation hub for Priyav Kaneria's
public-site ecosystem.

- Keep `llms.txt` fact-free: it must route agents to current primary sources,
  not duplicate a biography or project summary.
- `_plugins/llms_full.rb` generates `llms-full.txt` from published posts during
  every Jekyll build. Preserve that behavior when changing post URLs, front
  matter, or the site build.
- When adding, removing, or repurposing a routed first-party site, update
  `llms.txt`, the `know-priyav` Agent Skill, and their integrity digest.
- Keep generated artifacts truthful. Do not advertise APIs, authentication, or
  agent actions that the site does not offer.
