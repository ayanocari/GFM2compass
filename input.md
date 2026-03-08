# Compass Docs

A JSON-driven documentation renderer built with SvelteKit 5 and Carbon Design System. This is what I built for rendering my [Linux Migration Guide](https://talha-ijaz-qureshi.github.io/linux-migration-compass/) to date. It takes structured JSON files and turns them into interactive documentation sites with proper navigation, theming, and content organization.

The system is designed to be straightforward. You write your documentation in JSON format, drop it in the data folder, and the renderer handles the rest. No need to mess with HTML templates or build complex routing systems for each new documentation set.

## Function & Features

Compass Docs handles the rendering layer for documentation. You provide structured content in JSON, and it gives you a functional documentation site with a table of contents, section navigation, code blocks, and various content types. The renderer supports multiple documentation sources, meaning you can switch between different guides or manuals within the same deployment.

The UI is built on Svelte Carbon Design System, which provides a clean interface without requiring custom component design. There's some cool stuff like carbon and AMOLED themes, interactive table of contents with progress cues, some preferences options and some pretty nifty animations particularly the hamburger (took way too many hours than it needed to). The entire build outputs as static files, so you can deploy it anywhere that serves HTML.

## Getting Started

You'll need Node.js 18 or later and Yarn 4.6.0+. The project uses Yarn's modern release, so if you're on an older version, the package manager field in `package.json` should handle the upgrade.

Clone the repository and install dependencies:

```bash
git clone https://github.com/talha-ijaz-qureshi/compass-docs.git
cd compass-docs
yarn install
```

Start the development server:

```bash
yarn dev
```

The site runs on `http://localhost:5173` by default.

## Project Structure

The codebase is organized around SvelteKit's scaffold with some specific patterns for content management:

```
src/
├── lib/
│   ├── components/
│   │   ├── Toc.svelte              # Table of contents with scroll tracking
│   │   └── rightpanel.svelte       # Theme and preferences panel
│   ├── data/
│   │   ├── json/                   # Your JSON documentation files go here
│   │   ├── content.ts              # Default content import
│   │   └── testcontent.ts          # Additional content sources
│   ├── stores/
│   │   ├── contentStore.ts         # Manages active documentation source
│   │   ├── preferences.ts          # Theme and UI preferences
│   │   ├── toc.ts                  # Table of contents visibility state
│   │   └── menu.ts                 # Mobile menu state
│   ├── types/
│   │   └── content.ts              # TypeScript interfaces for content structure
│   └── utils/
│       └── parse.ts                # URL parsing and content utilities
├── routes/
│   ├── +layout.svelte              # Main layout with header and navigation
│   └── +page.svelte                # Content renderer
└── app.css                         # Global styles (Currently under works on modularity)
```

The `stores/` directory uses Svelte's reactive stores for state management. The content store handles switching between different documentation sources, while the preferences store manages theme selection and persists settings to localStorage.

## Writing Documentation

### JSON Structure

Documentation files live in `src/lib/data/json/`. The structure is hierarchical:

```json
{
  "guide": [
    {
      "topic": "Your Documentation Title",
      "sections": [
        {
          "id": "section-id",
          "title": "Section Title",
          "intro": "Section introduction text. Can include <b>HTML</b>.",
          "subtopics": [
            {
              "title": "Subtopic Title",
              "blocks": [
                {
                  "type": "text",
                  "value": "Paragraph content goes here."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

The top-level key (like `"guide"` above) can be anything. The content store will extract the first array it finds. Each documentation source needs at least one topic, which contains multiple sections. Sections are what appear in the table of contents.

### Content Blocks

There are three block types:

**Text blocks** render as paragraphs. They support inline HTML and will auto-link URLs:

```json
{
  "type": "text",
  "value": "Visit https://example.com for more information."
}
```

**Code blocks** render with syntax highlighting and copy functionality:

```json
{
  "type": "code",
  "value": "sudo apt update\nsudo apt install timeshift",
  "codeBlock": "multi"
}
```

The `codeBlock` property has three options:
- `"single"` - Single line of code
- `"multi"` - Multiple lines, preserves formatting
- `"inline"` - Inline code within text (not commonly used)

**Note blocks** render as Carbon notification components with different severity levels:

```json
{
  "type": "note",
  "kind": "warning",
  "message": "Important to Note",
  "value": "This operation will erase all data on the drive."
}
```

Available `kind` values: `info`, `info-square`, `success`, `warning`, `warning-alt`, `error`. These map to Carbon's notification types and change the icon and color scheme.

### Adding New Documentation

Create your JSON file in `src/lib/data/json/`, then import it in a new file in `src/lib/data/`:

```typescript
import type { Topic } from '$lib/types/content';
import data from './json/your-documentation.json';

const yourDocs: Topic[] = data.guide as Topic[];
export default yourDocs;
```

The content store automatically discovers JSON files in the data directory and makes them available in the source switcher. File names are converted to display names (e.g., `linux-migration-guide.json` becomes "Linux Migration Guide").

If you want to set a specific documentation source as the default, update `src/lib/stores/contentStore.ts`:

```typescript
export const currentSource = writable<Topic[]>(yourDocs);
```

Otherwise it defaults to whatever's imported as `linuxguide` in `content.ts`.

## Customization

### Themes

There are six built-in themes based on Carbon's color tokens:

- White (g10 light)
- Gray 10 (g10 subtle)
- Gray 80 (g80 dark)
- Gray 90 (g90 darker)
- Gray 100 (g100 full dark)
- AMOLED (pure black for OLED)

Users can switch themes via the preferences panel (gear icon in the header). The selection persists in localStorage, so it survives page reloads. Theme switching updates the Carbon theme class on the document root, which triggers all the design system's color variables to update.

### Styling

Global styles are in `src/app.css`. This is where you'd (preferrably) override Carbon variables or add custom utilities. Component-specific styles use Svelte's scoped `<style>` blocks.

If you need to customize Carbon components themselves, you can override their CSS custom properties. Carbon exposes a lot of design tokens as variables. Check their documentation for what's available.

### Preferences Panel

The preferences panel in `rightpanel.svelte` currently handles:
- Theme selection
- Heading text transformation (slugify vs camelCase)

The transformation setting affects how heading text is displayed on screen (as a cool design choice). Slugify converts "Getting Started" to "getting-started", while camelCase produces "gettingStarted". Note that URL fragments (the IDs) are always slugified regardless of this setting to maintain consistent URL structure.

You can extend the preferences store to add more settings. Just add new properties to the store and update the panel component to render controls for them.

## Building and Deployment

### Local Build

Build for production:

```bash
yarn build
```

This runs SvelteKit's build process with the static adapter. Output goes to `build/`. The adapter configuration in `svelte.config.js` sets up fallback routing to `index.html`, which enables client-side navigation in the SPA.

Preview the production build locally:

```bash
yarn preview
```

### GitHub Pages

#### Configure Your Repository Name

Before deploying, update the `BASE_PATH` in the deploy script in `package.json` to match your repository name:

```json
"deploy": "BASE_PATH=/your-repo-name NODE_ENV=production yarn run build && touch build/.nojekyll && gh-pages -d build --dotfiles"
```

For example, if your repository is `username/my-docs`, set `BASE_PATH=/my-docs`.

If you're deploying to a user/organization page (like `username.github.io`), you can remove the `BASE_PATH=/your-repo-name` part entirely:

```json
"deploy": "NODE_ENV=production yarn run build && touch build/.nojekyll && gh-pages -d build --dotfiles"
```

Then deploy:

```bash
yarn deploy
```

This builds the site, adds a `.nojekyll` file (so GitHub doesn't ignore files starting with underscores), and pushes the `build/` directory to the `gh-pages` branch.

#### Repository Settings

1. Go to your repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select the `gh-pages` branch and `/ (root)` folder
4. Save

Your site will be available at `https://username.github.io/repository-name/` (or `https://username.github.io/` for user/org pages).

### Custom Domain

If you're using a custom domain:

1. Create a file `static/CNAME` with your domain:

   ```text
   docs.yourdomain.com
   ```

2. Remove `BASE_PATH` from the deploy script in `package.json`:

   ```json
   "deploy": "NODE_ENV=production yarn run build && touch build/.nojekyll && gh-pages -d build --dotfiles"
   ```

3. Configure your DNS settings:
   - For apex domain (`yourdomain.com`): Add A records pointing to GitHub's IPs
   - For subdomain (`docs.yourdomain.com`): Add CNAME record pointing to `username.github.io`

4. In GitHub repository Settings → Pages, add your custom domain

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for detailed DNS setup.

### Other Platforms

The build output is just static HTML, CSS, and JavaScript. No server-side rendering or API routes are used, so there are no runtime requirements. Everything is pre-rendered at build time, so you can follow your choice of deployment platform's static deployment.

## Development

### Available Commands

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build locally
yarn check            # Run TypeScript type checking
yarn check:watch      # Type checking in watch mode
yarn deploy           # Build and deploy to GitHub Pages
```

Type checking runs via `svelte-check`, which validates both TypeScript and Svelte component types. It's worth running before committing to catch type errors early. (To date there are some bizzare type errors with carbon components like <Theme> so those can be ignored, like on line 46 in `lib/components/rightpanel.svelte`)

### Adding Features

**New components** go in `src/lib/components/`. Import them in your route files or other components. Component files follow Svelte 5 conventions with runes for reactivity.

**New stores** go in `src/lib/stores/`. Use Svelte's `writable` or `readable` stores for reactive state that needs to be shared across components. For persistent state, add localStorage sync like the preferences store does.

**New routes** go in `src/routes/`. SvelteKit uses file-based routing. This project is essentially a single-page app, so you probably won't need additional routes unless you're adding standalone pages.

**Extending types** happens in `src/lib/types/content.ts`. If you add new block types or content properties, update the interfaces there. TypeScript will then catch missing properties throughout the codebase.

### Runtime Validation

The content import files have commented-out Zod schemas. If you want runtime validation of your JSON structure (useful for catching malformed content), uncomment those sections:

```typescript
import { z } from 'zod';

const TopicSchema = z.object({
  topic: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      intro: z.string(),
      subtopics: z.array(z.object({
        title: z.string(),
        blocks: z.array(z.object({
          type: z.enum(['text', 'code', 'note']),
          value: z.string(),
          kind: z.enum(['error', 'info', 'info-square', 'success', 'warning', 'warning-alt']).optional(),
          message: z.string().optional(),
          codeBlock: z.enum(['single', 'multi', 'inline']).optional()
        }))
      }))
    })
  )
});

const validated: Topic[] = TopicSchema.array().parse(data.guide);
```

This adds runtime overhead, so it's disabled by default. But if you're working with untrusted content or want strict validation during development, it's there.

## Technical Stack

- **[SvelteKit 5](https://kit.svelte.dev/)** - Framework with file-based routing and static adapter
- **[Carbon Components Svelte](https://https://svelte.carbondesignsystem.com//)** - IBM's design system components for Svelte
- **TypeScript** - Type safety across the codebase
- **[Iconify](https://iconify.design/)** - Icon system with multiple icon sets
- **[Lodash](https://lodash.com/)** - Utility functions

Carbon provides most of the UI components. Iconify gives access to thousands of icons through a single component interface.

## Contributing

If you want to contribute, fork the repository and open a pull request. Follow existing patterns for component structure and store usage.

For bug reports or feature requests, open an issue on GitHub. Include reproduction steps for bugs and use cases for feature requests.

## License

GNU General Public License v3.0. See the [LICENSE](LICENSE) file for full terms. You can copy, modify, and distribute this work under GPL v3 or any later version. Any derivative work must also be distributed under GPL v3.

## Support

- **Issues**: [GitHub Issues](https://github.com/talha-ijaz-qureshi/compass-docs/issues)
- **Documentation**: This README and the inline code comments

Built on SvelteKit with Svelte Carbon Design System and Icons from Iconify.

---

Compass Docs. System by Talha "tal" Ijaz.
