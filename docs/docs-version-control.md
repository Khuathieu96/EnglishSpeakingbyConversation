# Docs Version Control Workflow

This guide defines how to version and track documentation releases using Git tags.

## Release tagging workflow

### 1) Release v1

```bash
git tag -a v1.0 -m "Version 1.0 release"
git push origin v1.0
```

### 2) Continue v2 documentation updates

- Keep updating docs in-place for v2 work.
- Example target file:

```bash
# Edit docs/requirements/functional-requirements.md directly
```

### 3) Release v2

```bash
git tag -a v2.0 -m "Version 2.0 release"
git push origin v2.0
```

## View docs at a specific version

```bash
git show v1.0:docs/requirements/functional-requirements.md
```

## Compare documentation between releases

```bash
git diff v1.0..v2.0 -- docs/
```

## Documentation versioning summary

| Goal | Command / Practice |
|---|---|
| Track doc history | `git log -- docs/` |
| Snapshot a release | `git tag v2.0` |
| Compare versions | `git diff v1.0..v2.0 -- docs/` |
| Record decisions | Add new ADR files (never edit old ones) |
| Track changes | Maintain `CHANGELOG.md` |

## Recommended conventions

- Use semantic version tags for documentation milestones (e.g. `v1.0`, `v2.0`).
- Prefer annotated tags (`git tag -a`) for releases.
- Keep documentation updates on normal branches and tag only when a release is complete.
- Add changelog entries as part of each docs release.
- For architectural decisions, create a new ADR document instead of modifying historical ADRs.
