<!-- rls-website-kit -->
## RLS website kit

This site is `sea-gypsies` in the RLS website registry (`website-policy/sites.yaml` in RedLetterSolutions/rls-claude-skills). It follows **rls-astro-site-kit**, the universal website kit, in **existing-site** mode: apply its rules to every change without moving the site onto the kit's code.

Before any change, run `python ~/.rls/rls-claude-skills/scripts/website-policy.py context --dir .` (`~` is your user folder) and read the files it lists. If the resolver is not installed, first read `AGENTS.md` and `docs/adoption.md` from a current clone of https://github.com/RedLetterSolutions/rls-astro-site-kit. The registry is the authority: if it names another kit, follow it and tell Max. The kit's current rules override older kit rules copied into this repository, and the site's approved exceptions are in the registry.
<!-- /rls-website-kit -->
