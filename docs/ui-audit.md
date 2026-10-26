# UI Audit (SH-01)

| Route | Status | Note |
|---|---|---|
| / (index.tsx) | Improve | Hero, search card, prototype label, EN/Hindi, theme toggle hain. Sample advisory, 3-step section, closing section dekhna baaki |
| /check (check.tsx) | Improve | Advisories list ka kaam karta hai (/check?view=list). Search aur quick picks hain. Advisory cards dekhna baaki |
| /map (Live Map) | Improve | Separate route nahi hai. Live Map link /check?view=map par khulta hai (check.tsx ka ek view). Map aur list view ka detail check karna baaki, unavailable-provider fallback dekhna hai |
| /about | Missing | Nav bar mein link hai, par page nahi hai ("Page not found"). Truthful About content banana hai |
| /contact | Missing | Page not found |
| /traveller | Missing | Page not found |
| /advisories/:segmentId | Missing | Abhi route file nahi hai |
| 404 | Improve | Default "Page not found" aata hai, custom nahi hai |

Note: assignment mein /advisories aur /traveller hain, app mein /check hai. Teammates se naam confirm karna hai.