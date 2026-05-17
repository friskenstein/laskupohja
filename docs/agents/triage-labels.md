# Triage Labels

The skills speak in terms of canonical triage roles. This file maps those roles to the actual label strings used in this repo's GitHub issue tracker.

## Canonical role mapping

| Label in mattpocock/skills | Label in our tracker | Meaning                                           |
| -------------------------- | -------------------- | ------------------------------------------------- |
| `needs-triage`             | `status: draft`      | Raw idea that needs a spec                        |
| `needs-info`               | `status: discussion` | Spec is attempted, but blocked on a team decision |
| `ready-for-agent`          | `status: ready`      | Fully specified and ready to pick up              |
| `ready-for-human`          | `status: ready`      | Fully specified and ready to pick up              |
| `wontfix`                  | no label             | Close the issue instead of applying a label       |

When a skill mentions a role, use the corresponding label string from this table. If the mapped value is "no label", do not create a new label; close or comment according to the issue workflow.

## Repo label vocabulary

| Label                | Description                                                  | Color    |
| -------------------- | ------------------------------------------------------------ | -------- |
| `status: discussion` | Spec is attempted, but blocked on a team decision.           | `00a6f4` |
| `status: ready`      |                                                              | `00bc7d` |
| `status: blocked`    | Spec is clear, but waiting on code dependencies.             | `f0b100` |
| `status: draft`      | Raw idea. Needs spec.                                        | `e12afb` |
| `type: docs`         | Improvements or additions to documentation                   | `71717b` |
| `type: feat`         | New feature or request                                       | `71717b` |
| `type: fix`          | Something isn't working                                      | `71717b` |
| `type: chore`        | Non-feature related config, refactoring, scaffolding, DevOps | `71717b` |
