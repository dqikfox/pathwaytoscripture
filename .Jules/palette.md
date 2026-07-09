## 2024-05-18 - Contextual ARIA Labels for Repeated Actions
**Learning:** When using tables or lists with repeated form controls (like "Update" or "Remove" buttons), screen reader users navigating out-of-context only hear the visible text, resulting in repetitive and confusing announcements.
**Action:** Always append dynamic ARIA labels (e.g., `aria-label="Remove <%= item.name %>"`) to repeated interactive elements to ensure context is preserved.
