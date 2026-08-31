# SendGrid confirmation template

The applicant confirmation is a SendGrid Dynamic Transactional Template. Its
design and subject are managed in SendGrid; the application only selects the
template and supplies personalization data.

## Create the template

1. In SendGrid, open **Email API → Dynamic Templates**.
2. Create a template named **Project Q waitlist confirmation**.
3. Add a version and choose the Code Editor.
4. Set the subject to **You're on the Project Q waitlist**.
5. Paste `waitlist-confirmation.html` into the HTML editor.
6. Use this test data in SendGrid's preview:

   ```json
   {
     "first_name": "Avery",
     "full_name": "Avery Rao",
     "organisation": "Example Imaging Lab",
     "current_year": 2026
   }
   ```

7. Preview desktop and mobile layouts, send a test, then make the version active.
8. Copy the template ID beginning with `d-` into
   `SENDGRID_CONFIRMATION_TEMPLATE_ID` in Vercel.

The route sends these Handlebars values:

- `first_name`: the first whitespace-delimited part of the submitted name
- `full_name`: the submitted name, or an empty string
- `organisation`: the submitted organisation, or an empty string
- `current_year`: the current UTC year

Keep `WAITLIST_SEND_CONFIRMATION=false` in Vercel Preview until the template is
active and its ID has been added. Enable it separately in Production.
