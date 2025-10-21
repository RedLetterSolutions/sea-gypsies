# Frontend Integration Guide – RLS Multi-Tenant Contact Form

This guide explains how to integrate the **RLS Contact Form System** into any static frontend site (HTML, React, etc.) once your backend endpoint is already configured.

---

## 1. Choose Integration Method

You can connect the frontend in one of two ways:
- **Option A (Recommended): JavaScript API** – simple, dynamic integration with built-in validation and feedback.
- **Option B: Direct HTML Form** – basic HTML submission with no JavaScript.

---

## 2. Option A – JavaScript API Integration

### Step 1. Include the API Script
Add this to your `<head>` or before the closing `</body>` tag:
```html
<script src="https://cdn.jsdelivr.net/gh/RedLetterSolutions/rls-contact-forms@main/rls-contact-api.min.js"></script>
```

### Step 2. Initialize the API
After loading the script, initialize it with your **site ID**:
```html
<script>
RLSContact.init({
    siteId: 'your-site-id'
});
</script>
```

### Step 3. Add Your Form
```html
<form data-rls-contact="your-site-id">
    <!-- Honeypot (spam protection) -->
    <input type="text" name="_hp" style="display:none;" tabindex="-1" autocomplete="off">

    <input name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Message" required></textarea>

    <!-- Optional custom fields -->
    <input name="phone_number" placeholder="Phone Number">
    <input name="company" placeholder="Company">
    <select name="budget_range">
        <option value="">Budget Range</option>
        <option value="Under $5K">Under $5K</option>
        <option value="$5K - $15K">$5K - $15K</option>
    </select>

    <button type="submit">Send Message</button>
</form>
```

The API will automatically handle:
- Validation
- Loading and error states
- Success redirects or callbacks

### Optional Attributes
| Attribute | Description |
|------------|-------------|
| `data-rls-redirect="false"` | Disable redirect behavior |
| `data-rls-on-success="mySuccessHandler"` | Call custom JS function on success |
| `data-rls-on-error="myErrorHandler"` | Call custom JS function on error |

### Example: Custom Handlers
```html
<script>
function mySuccessHandler(result) {
    alert('Thanks! Message sent successfully.');
}

function myErrorHandler(error) {
    alert('Error: ' + error.message);
}
</script>
```

---

## 3. Option B – Direct HTML Form
If you prefer a pure HTML solution, use the backend endpoint directly.

```html
<form action="https://your-function-app.azurewebsites.net/v1/contact/your-site-id" method="POST">
    <input name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Message" required></textarea>

    <input type="text" name="_hp" style="display:none;">
    <button type="submit">Send</button>
</form>
```

After submission, the server will automatically redirect the user to the configured thank-you page.

---

## 4. Common Troubleshooting

| Issue | Fix |
|-------|-----|
| **Form not submitting** | Check if the CDN script is loaded correctly (see console). |
| **CORS error** | Ensure your domain is added to the backend’s allowed origins list. |
| **No email received** | Confirm backend configuration and SendGrid setup. |
| **Unknown site error** | Make sure the `siteId` matches backend configuration. |

---

## 5. Recommended Setup
- Use **JavaScript API** for interactive sites (React, Vue, etc.).
- Use **Direct HTML Form** for static-only or no-JS pages.
- Always include the hidden `_hp` field for spam prevention.

---

Your frontend is now connected — no additional configuration or authentication is required.

