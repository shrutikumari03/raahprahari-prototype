# SH-14 Part 2 QA report

Automated checks use Vitest, Testing Library, jsdom, and jest-axe. Browser automation was not run. The axe assertions report zero serious or critical violations. jsdom does not provide a reliable visual color-contrast check, so contrast still needs browser/manual confirmation.

| Page                       | Check                                                       | Result          |
| -------------------------- | ----------------------------------------------------------- | --------------- |
| Home                       | axe (serious/critical); one h1; skip link                   | Pass            |
| Traveller                  | axe (serious/critical); one h1; skip link                   | Pass            |
| Map                        | axe (serious/critical); one h1; skip link                   | Pass            |
| Advisories                 | axe (serious/critical); one h1; skip link                   | Pass            |
| About                      | axe (serious/critical); one h1; skip link                   | Pass            |
| Contact                    | axe (serious/critical); one h1; skip link                   | Pass            |
| 404                        | axe (serious/critical); one h1; skip link                   | Pass            |
| Shared mobile menu         | Keyboard open, focus trap, Escape close, focus restoration  | Pass            |
| Tabs                       | Arrow-key selection                                         | Pass            |
| Dialog                     | Keyboard focus containment, Escape close, focus restoration | Pass            |
| Map                        | Keyboard Map/List toggle                                    | Pass            |
| Shared and page animations | Reduced-motion handling                                     | Pass            |
| All listed pages           | Real 360/390/768/1440px layout                              | Manual: not run |
| All listed pages           | 200% zoom                                                   | Manual: not run |
| All listed pages           | Visual color-contrast confirmation                          | Manual: not run |
