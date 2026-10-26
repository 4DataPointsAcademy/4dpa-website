# 4datapoints.com

Static website for 4 Data Points Academy, served by GitHub Pages at https://4datapoints.com.

- Each page is a folder with an `index.html`. Shared styles: `assets/site.css`. Shared script: `assets/site.js`.
- Forms post to the Supabase `website-lead` edge function, which saves the lead and text-message consent and creates the contact in GoHighLevel.
