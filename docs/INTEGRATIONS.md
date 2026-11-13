# Tally and PostHog setup

## Tally: authoritative enquiry record

The configured public form is https://tally.so/r/xVMoPv (`xVMoPv`), set in `.env.production`. Verify the existing form against the settings below; its account configuration and submission receipt have not been verified.

1. Create a free Tally account for the intended notification recipient, ideally `info@newroniq.com`, or use the authorised existing account. Create a consultation form titled **Let's Discuss Your AI Initiative** with the supporting copy **Tell us a little about your organisation and the challenge you're exploring.**
2. Add these fields in order:

   | Field                              | Type       | Required |
   | ---------------------------------- | ---------- | -------- |
   | Full name                          | Short text | Yes      |
   | Business email                     | Email      | Yes      |
   | Organisation                       | Short text | No       |
   | Area of interest                   | Dropdown   | Yes      |
   | Brief description of the challenge | Long text  | No       |

3. Use these exact dropdown options:
   - AI Strategy & Roadmap
   - AI Architecture & Integration
   - AI Security & Governance
   - AI Agents & Intelligent Automation
   - AI Cloud Readiness & Scalability
   - Enterprise AI Implementation Support
   - DOptimiser
   - IQPublish
   - StylePulse
   - NEWRONIQ Academy
   - General Enquiry
4. Beneath the description, add **Please do not include credentials, confidential client data or sensitive personal information.** Include a link to `https://www.newroniq.com/privacy/`.
5. Add hidden fields named exactly `interest_context` and `interest_label`. In the Area of interest field settings, enable **Default answer** and select `interest_label`. It must match an option exactly. Visitors can change the selected interest. The hidden context records the originating CTA category, not the final answer.
6. Edit the actual post-submission thank-you page to say **Thank you for contacting NEWRONIQ. Your enquiry has been received.** Do not redirect to a public page that implies receipt without a successful submission.
7. Keep the form to one page where possible. Use a simple white/transparent presentation, left alignment and readable default controls. Keep free Tally branding. Do not enable tracking integrations, custom scripts, advertising pixels, partial-submission capture, or additional collection such as file uploads and explicit IP fields.
8. Publish, copy the public URL `https://tally.so/r/<ID>` and set **only the ID** as `VITE_PUBLIC_TALLY_FORM_ID`. Rebuild. Do not use the example placeholder as an actual ID.
9. Under **Settings → Email notifications**, enable **Self email notifications**. These are free and go to the form creator by default. Customised email fields/recipients may require Pro; verify the intended free account receives notifications rather than assuming custom recipients are free. No paid plan is required by this website.
10. Send a clearly marked owner test enquiry, confirm it appears in Tally and that the account receives the notification. Verify all required fields, invalid email handling, product/service prefill, editing the area of interest, and the actual success message. Delete test data when finished.

The embedded form uses Tally's standard iframe URL with a fixed 850px viewport and native scrolling. It deliberately omits the optional JavaScript helper because that helper forwards the parent page URL and arbitrary query parameters. The website supplies only allowlisted category/label parameters and sets `referrerPolicy="no-referrer"`. A direct form link is always available, including without JavaScript. If the embed is blocked, use that link or the visible email address.

The host page processes only `Tally.FormSubmitted` messages from `https://tally.so`, the actual iframe window, and the configured form ID. A non-empty submission ID is required and repeated messages are ignored. Submission IDs are retained in component memory only for deduplication and are not sent to analytics. Form answers, respondent IDs and messages are never read for analytics. The outer page's success message is independent of PostHog and appears only after a validated successful-submission message.

`interest_context` in analytics means **entry context**, not the user's final dropdown answer. Direct Tally submissions outside the embed are authoritative in Tally but cannot emit a verified host-page submission event.

References: [standard embeds](https://developers.tally.so/widgets/embeds), [events](https://developers.tally.so/widgets/events), [prefill](https://tally.so/help/pre-populate-form-fields), [free self notifications](https://tally.so/help/self-email-notifications).

## PostHog Cloud EU

Use the existing PostHog **EU** project (ID `346547`). Its public browser token is not stored locally; retain the deployment variable. Add its **public project key** (`phc_…`) and `https://eu.i.posthog.com` to the public build settings. Never use a personal/secret API key. Configure project-level IP discard and review event retention, account access and subprocessors. Do not enable replay, autocapture, surveys, or automatic identification in project settings. Use free usage allowances and review account limits; the website requires no paid feature.

The official `posthog-js` SDK is loaded dynamically after consent, only in a configured production build. No SDK initialisation or events occur before consent or after rejection. Development, test mode and builds without a key remain inactive. The application does not use cookieless tracking on rejection.

The accessible preferences panel offers equal Accept and Reject controls and can be reopened from the footer. A versioned localStorage preference persists the choice; storage failures retain it in memory for the current document. Withdrawal blocks the central tracking gateway and SDK privacy filter immediately, opts out and clears SDK identity persistence. Cross-tab preference changes are respected. Do Not Track is passed to the SDK. Enquiries never depend on consent.

Only explicit events are enabled. The final SDK privacy filter strips query strings, fragments, arbitrary referrers, automatic person properties and other non-allowlisted properties. An anonymous browser ID is used after consent; this is not a promise of legally anonymous data. No names, email addresses, organisations, free text or form answer fields are sent.

| Event                      | Trigger                                                                              | Application properties                                           |
| -------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `$pageview`                | Once per document after acceptance, or navigation with saved acceptance              | `page_path`                                                      |
| `cta_clicked`              | Activation of a marked advisory/enquiry CTA                                          | `cta_id`, `cta_location`, `service` when applicable, `page_path` |
| `contact_started`          | Deliberate activation of an enquiry CTA or direct Tally link                         | CTA context and `page_path`                                      |
| `product_interest_clicked` | Product register-interest or pilot CTA                                               | `product`, `cta_location`, `page_path`                           |
| `lead_form_submitted`      | Verified, deduplicated Tally successful-submission message while consent is accepted | `form_id`, entry `interest_context`, `page_path`                 |

`contact_started` measures initiation through website links, not typing within a cross-origin form. Loading Contact or the iframe does not emit it. Visitors landing directly on Contact can therefore submit without a recorded start event. Events that occur before acceptance are not replayed. SDK loading failure may also reduce observations; the form remains usable.

### Dashboard setup

Create a dashboard named **NEWRONIQ website enquiries** in the configured EU project:

1. Top landing pages: use `$pageview`, unique visitors, grouped by `page_path`, with an initial-page/session-entry filter if available in the project; otherwise label it **Visited pages**, not landing pages.
2. Consultation CTA clicks: trend `cta_clicked`, grouped by `cta_id` and `cta_location`.
3. Advisory interest: `cta_clicked` filtered to `strategy`, `architecture`, `security`, `agents`, `cloud` or `implementation`, grouped by `service`.
4. Product interest: `product_interest_clicked`, grouped by `product`.
5. Observed submissions: `lead_form_submitted`, grouped by `interest_context` with its entry-context meaning clearly labelled.
6. Funnel: `cta_clicked` → `contact_started` → `lead_form_submitted`, across pages within the project's chosen conversion window. Exclude exploration-only CTAs from the enquiry funnel and check direct-entry submissions separately.

Tally is the source of truth for **all** enquiries. PostHog only observes consented interactions; rejected analytics, direct Tally visits, blockers and failed SDK loads cause undercounting. No dashboard or account configuration has been claimed as completed without access.

References: [JavaScript SDK configuration](https://posthog.com/docs/libraries/js/config), [consent and collection](https://posthog.com/docs/privacy/data-collection), [React SDK guidance](https://posthog.com/docs/libraries/react).

## Business decisions before launch

Confirm the actual Tally and email account owners and authorised recipients, processor agreements, international-processing arrangements, enquiry deletion workflow and retention criteria, PostHog project retention and access settings, and live privacy wording. No fixed retention period, client outcome, certification or legal-compliance guarantee has been invented.

Review the configured form's real browser network/storage behaviour. Tally's general website cookie notice is not proof of the exact embedded form's behaviour. The implementation introduces no Tally advertising pixels or third-party analytics integrations. Keep the enquiry form usable when optional PostHog consent is rejected.

## Repeatable isolated browser integration checks

The normal browser suite runs against an offline build: `VITE_PUBLIC_TALLY_FORM_ID= npm run build`. CI also runs the isolated fixture checks before building the project-path variant. For a separate controlled integration check, use the following **fake** identifiers only for the test build:

```sh
VITE_PUBLIC_TALLY_FORM_ID=newroniqTestForm VITE_PUBLIC_POSTHOG_KEY=phc_test_public npm run build
TEST_INTEGRATIONS=1 PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npm run test:e2e -- integrations.spec.ts --project=desktop --workers=1
npm run build
```

The last command restores the normal production build. Never deploy the fake integration build. The test intercepts every HTTPS request, serves a synthetic Tally event fixture and captures the real SDK's outgoing requests locally, including its EU project configuration request. It simulates a normal browser only within that intercepted fixture so the production SDK's bot filter remains enabled. These checks prove sender validation, consent independence, sanitised outgoing payloads, duplicate prevention, withdrawal and CTA navigation behavior. They do not prove live Tally persistence, field setup, notifications or real PostHog dashboard receipt.

## Academy registration context

Academy registration links use `/contact/?inquiry=academy`. The existing Tally URL builder sends the allowlisted `interest_context=academy` and `interest_label=NEWRONIQ Academy`; it does not select or verify fields within the cross-origin form.

Manual update required in Tally form `xVMoPv`: add **NEWRONIQ Academy** to the required **Area of interest** dropdown. Retain hidden fields `interest_context` and `interest_label`, and set the dropdown default answer from `interest_label`. Publish the form and verify preselection, required-field validation and a clearly marked owner test submission. This account-side configuration has not been changed or verified; visitors can manually select their area of interest.
