# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. A document in `/stories/{storyId}` MUST have `title` (1..200 chars), `fullStory` (1..20000 chars), `status` (`'published'` or `'pending'`), and `createdAt` equal to `request.time` on creation.
2. Public guests (`request.auth == null` or non-admin) can ONLY `get` and `list` documents in `/stories` where `resource.data.status == 'published'`. They CANNOT read `pending` stories.
3. Only a verified admin (`isAdmin()`) can create a story with `status == 'published'`, update any story (e.g., approve `pending` -> `published`), or delete a story.
4. Guest story submissions MUST always have `status == 'pending'`, `source == 'community_submission'`, NO `publishedAt`, and NO `authorUid`. Guests can never publish directly, update, or delete stories.
5. `createdAt` is immutable on update.
6. Admin role documents in `/admins/{userId}` can ONLY be read by admins (or the admin owner) and NEVER written from the client SDK.
7. All document IDs (`storyId`, `userId`) MUST match `^[a-zA-Z0-9_-]+$` and be `<= 128` characters.

## 2. Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `list` of `/stories` without filtering `status == 'published'` (attempts to scrape pending stories).
2. Unauthenticated `get` of `/stories/{pendingStoryId}` where `status == 'pending'`.
3. Non-admin authenticated user creating a story with `status: 'published'`.
4. Guest submitting a story with `status: 'published'`.
5. Guest submitting a story with an extra ghost field (`isAdmin: true` or `publishedAt`).
6. Guest attempting to `update` or `delete` a `pending` story.
7. Non-admin with unverified email (`email_verified: false`) spoofing `ausinon@gmail.com` to publish a story.
8. Admin attempting to create a story with an oversized `storyId` (> 128 chars or invalid characters like `../../admins/evil`).
9. Admin attempting to create a story with `createdAt` set to a forged past timestamp (`createdAt != request.time`).
10. Admin attempting to mutate `createdAt` during an `update`.
11. Non-admin attempting to create `/admins/{uid}` to escalate privileges.
12. Creating a story with `fullStory` exceeding 20,000 characters or `title` empty/over 200 chars.
