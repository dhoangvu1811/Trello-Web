<!--
PR title: <type>(<scope>): <short imperative summary>
Types: feat, fix, refactor, test, docs, build, ci, chore, perf, security
Example: fix(auth): preserve the session after login

Keep this PR focused. Remove sections that are genuinely not applicable.
-->

## Summary

<!-- Explain the user or business problem and the outcome of this PR. -->

## Related work

<!-- Use "Closes #123", "Fixes #123", or link the relevant task/design. -->

- Closes: <!-- #issue -->
- Depends on: <!-- PR, API change, or deployment -->

## Change type

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Performance
- [ ] Security
- [ ] Test or documentation
- [ ] Build, CI, or dependency update
- [ ] Breaking change

## What changed

<!-- List the important implementation and behavior changes. -->

-

## User experience

<!-- Describe the before/after behavior and relevant edge cases. -->

### Screenshots or recordings

<!-- Required for visible UI changes. Include desktop and mobile states when relevant. -->

| Before | After |
| --- | --- |
| N/A | N/A |

## Technical impact

### API and data contract

- API endpoints affected: <!-- None, or list endpoints -->
- Request/response contract changed: <!-- No, or describe -->
- Compatible API PR/deployment required: <!-- No, or link -->

### State, authentication, and realtime

- Redux/persisted state affected: <!-- No, or describe -->
- Login, cookie, token, or permission behavior affected: <!-- No, or describe -->
- Socket.IO events or room behavior affected: <!-- No, or describe -->

### Configuration and deployment

- New or changed environment variables: <!-- None, or list names only -->
- Vercel configuration changed: <!-- No, or describe -->
- Deployment order or cache considerations: <!-- None, or describe -->

## Verification

<!-- Record commands and results. Do not write only "tested locally". -->

- [ ] `yarn lint`
- [ ] `yarn test`
- [ ] `yarn build`
- [ ] Relevant Playwright E2E tests
- [ ] Manual verification in a production-like browser

### Test evidence

```text
Command:
Result:
```

### Scenarios verified

- [ ] Happy path
- [ ] Loading, empty, and error states
- [ ] Authentication and authorization boundaries
- [ ] Refresh and direct-navigation behavior
- [ ] Realtime update and reconnect behavior, when applicable
- [ ] Responsive layout and keyboard interaction, when applicable

## Risk and rollback

- Risk level: <!-- Low / Medium / High -->
- Main risks: <!-- Describe likely failure modes -->
- Monitoring or validation after deployment: <!-- Describe checks -->
- Rollback plan: <!-- Revert PR, restore env value, coordinated API rollback, etc. -->

## Final checklist

- [ ] The PR has a focused scope and a clear title.
- [ ] No secrets, tokens, credentials, or production data are included.
- [ ] UI text, errors, and console output are intentional.
- [ ] Accessibility and responsive behavior were considered.
- [ ] Tests cover the regression or new behavior.
- [ ] Documentation and environment examples are updated when required.
- [ ] Breaking changes and required deployment order are clearly identified.

## Reviewer notes

<!-- Point reviewers to the highest-risk files, decisions, or tradeoffs. -->

