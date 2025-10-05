Goal / Component

Razor component: DownloadScriptForm.razor + scoped stylesheet DownloadScriptForm.razor.css.

Displays a centered modal card over a dimmed backdrop.

Title: DOWNLOAD THE SCRIPT

Subtitle: Enter your information to receive the script via email:

Dynamic text fields (driven by a list) with labels matching the screenshot style:

First Name (optional)

Last Name (optional)

Email Address (required)

Two buttons:

Primary: “SEND SCRIPT” (uses an image/icon I will provide, left of text)

Secondary: “CANCEL”

The font is “Apotek Comp”. Use @font-face and fallbacks; accept a wwwroot/fonts/Apotek-Comp.woff2 file.

Design tokens (use CSS variables in the component stylesheet)

--c-bg: #000000;
--c-text: #d7f7ff;       /* slightly cool white for copy */
--c-accent: #43c9e6;     /* neon cyan for borders/lines */
--c-accent-soft: #2d9fba;/* darker cyan for hovers */
--c-muted: #7aaab6;      /* muted cyan for helper text */
--c-danger: #ff5a7a;     /* validation red */
--radius: 6px;
--gap: 18px;
--line: 1.5px;           /* input border thickness */
--shadow: 0 0 0 1px var(--c-accent) inset, 0 10px 30px rgba(0,0,0,.7);
--font: "Apotek Comp", "Oswald", "Teko", "Arial Narrow", system-ui, sans-serif;


Typography / Layout details

Whole modal uses --font. Tight, condensed, uppercase headings.

Card width ~ 560–620px on desktop; full width minus 32px padding on small screens.

Title tracking/letter-spacing: 0.18em. Subtitle smaller, muted color.

Inputs: full width, tall (48–52px), glow cyan border, black background, uppercase placeholder text.

Labels:

Small row with left label (e.g., “FIRST NAME”) and right “(OPTIONAL)” in muted cyan.

Primary button has cyan border + subtle glow; on hover brighten border and apply slight scale (1.02).

Secondary button is ghost/outline with muted cyan text.

Include a small “expand” icon placeholder (top-right of card) as a slot we can wire later (no functionality now).

Accessibility & UX

Trap focus inside modal; close on Esc. Secondary button triggers cancel.

EditForm + DataAnnotationsValidator. Email is required + email format.

Show inline validation under the field (muted -> danger color); keep layout stable.

Tab order: inputs then primary then secondary.

Buttons are <button type="submit"> and <button type="button">.

API/Interop

Component parameters:

EventCallback<FormModel> OnSubmit

EventCallback OnCancel

string? SendIconSrc and string? CancelIconSrc (optional image paths for the buttons)

bool IsOpen to show/hide modal

When submitted and valid, call OnSubmit.InvokeAsync(model).

Clicking backdrop or pressing Esc calls OnCancel.

Dynamic fields

Define a FieldSpec record/class: Key, Label, Optional, Type ("text" or "email"), Placeholder.

A default list for:

new("FirstName", "FIRST NAME", true, "text", "ENTER FIRST NAME")

new("LastName", "LAST NAME", true, "text", "ENTER LAST NAME")

new("Email", "EMAIL ADDRESS", false, "email", "ENTER EMAIL ADDRESS")

Render inputs from this list. Bind to a FormModel with properties FirstName, LastName, Email.

Files to generate

DownloadScriptForm.razor

Backdrop + centered card markup

Title/subtitle rows

EditForm with dynamic inputs rendered from FieldSpec[]

Buttons row with optional <img> inside the buttons if icon src provided

Keyboard handlers (Esc)

Parameters & cascading focus trap

DownloadScriptForm.razor.css (scoped)

@font-face:

@font-face {
  font-family: "Apotek Comp";
  src: url("/fonts/Apotek-Comp.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}


All styles using the tokens above, including glow borders on inputs, hover/focus states, error states, and responsive behavior.

FormModel.cs (or nested class in the .razor file)

public class FormModel
{
    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [Required, EmailAddress, MaxLength(254)]
    public string? Email { get; set; }
}
public record FieldSpec(string Key, string Label, bool Optional, string Type, string Placeholder);


Behavioral details

Placeholders are uppercase (style with CSS).

On focus: input border brightens (--c-accent → lighter via filter), slight outer glow, no default outline.

Primary button content: [icon] SEND SCRIPT. Secondary: CANCEL.

Don’t use any JS libraries; if needed for focus trap, write a tiny JS interop (but try to do it in C# first).

Ensure it looks the same in Chromium and Firefox.

Usage example (include at bottom of the .razor file as a demo section guarded by #if DEBUG or comments):

<DownloadScriptForm
    IsOpen="true"
    SendIconSrc="/img/send-icon.png"
    CancelIconSrc="/img/cancel-icon.png"
    OnSubmit="HandleSubmit"
    OnCancel="HandleCancel" />

@code {
    private Task HandleSubmit(FormModel model)
    {
        // TODO: wire to backend/email
        Console.WriteLine($"Submit: {model.FirstName} {model.LastName} {model.Email}");
        return Task.CompletedTask;
    }
    private Task HandleCancel() => Task.CompletedTask;
}


Make sure the visual style matches a neon-cyan, sci-fi UI on black like a HUD:

Inputs: cyan outline + inner shadow for depth

Headings: tight, uppercase, large line height ~1.1

Subtle scanline/gradient background on the card is okay but keep it minimal

Generate all files with complete code now.