# Graph Report - .  (2026-07-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 966 nodes · 1359 edges · 73 communities (52 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- gray
- BM25
- color
- button
- slide_search_core.py
- spacing
- dependencies
- design_system.py
- compilerOptions
- html-token-validator.py
- TestTailwindConfigGenerator
- devDependencies
- BM25
- components.json
- DesignSystemGenerator
- generate-slide.py
- TailwindConfigGenerator
- fetch-background.py
- BM25
- icon/generate.py
- fontSize
- main
- TestShadcnInstaller
- extract-colors.cjs
- validate-asset.cjs
- .add_components
- ShadcnInstaller
- scripts/core.py
- validate-tokens.cjs
- test_tailwind_config_gen.py
- .generate_config_string
- inject-brand-context.cjs
- embed-tokens.cjs
- duration
- patch
- search
- layout.tsx
- ._base_config
- logo/generate.py
- generate-tokens.cjs
- sync-brand-to-tokens.cjs
- _run
- radius
- test_core.py
- sm
- lg
- Lightfall.tsx
- xl
- md
- default
- validate_data.py
- test_sync_brand_to_tokens.py
- main
- .temp_project
- test_shadcn_add.py
- .test_add_components_already_installed
- .test_add_all_components_no_config
- .test_init_default_project_root
- .test_add_components_no_components
- .test_add_fonts
- .test_add_colors_multiple_times
- .test_add_spacing
- .test_recommend_plugins
- .test_recommend_plugins_nextjs
- .test_validate_config_no_content
- .test_write_config_creates_content
- .test_init_framework
- .test_init_javascript
- .test_write_config_invalid_path
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 58 edges
2. `TestTailwindConfigGenerator` - 35 edges
3. `ShadcnInstaller` - 34 edges
4. `TestShadcnInstaller` - 26 edges
5. `DesignSystemGenerator` - 19 edges
6. `compilerOptions` - 16 edges
7. `color` - 15 edges
8. `search()` - 15 edges
9. `search_with_context()` - 12 edges
10. `gray` - 12 edges

## Surprising Connections (you probably didn't know these)
- `TestDomainDetection` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/design/scripts/cip/core.py
- `TestPersistence` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/design/scripts/cip/core.py
- `TestReasoningMatch` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/design/scripts/cip/core.py
- `TestSearchDomains` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/design/scripts/cip/core.py
- `TestTokenizer` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/design/scripts/cip/core.py

## Import Cycles
- None detected.

## Communities (73 total, 21 thin omitted)

### Community 0 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 1 - "BM25"
Cohesion: 0.07
Nodes (42): BM25, detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection (+34 more)

### Community 2 - "color"
Cohesion: 0.04
Nodes (48): $type, $value, background, destructive, destructive-foreground, foreground, muted, muted-foreground (+40 more)

### Community 3 - "button"
Cohesion: 0.06
Nodes (45): $type, $value, $type, $value, bg, fg, font-size, hover-bg (+37 more)

### Community 4 - "slide_search_core.py"
Cohesion: 0.09
Nodes (36): format_context(), format_result(), main(), Format a single search result for display, Format contextual recommendations for display., BM25, calculate_pattern_break(), detect_domain() (+28 more)

### Community 5 - "spacing"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 6 - "dependencies"
Cohesion: 0.06
Nodes (33): @base-ui/react, class-variance-authority, clsx, gsap, lucide-react, motion, next, ogl (+25 more)

### Community 7 - "design_system.py"
Cohesion: 0.12
Nodes (24): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+16 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "html-token-validator.py"
Cohesion: 0.14
Nodes (24): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+16 more)

### Community 10 - "TestTailwindConfigGenerator"
Cohesion: 0.07
Nodes (14): Test adding full color palette., Test adding custom breakpoints., Test TailwindConfigGenerator class., Test initialization with default settings., Test generating config with custom colors., Test validating valid configuration., Test validating config with empty theme extensions., Test writing configuration to file. (+6 more)

### Community 11 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 12 - "BM25"
Cohesion: 0.12
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 13 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 14 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (12): DesignSystemGenerator, Find matching reasoning rule for a category., Apply reasoning rules to search results., Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation. variance/motion/density are…, Bucket a 1-10 dial value into its tier config. Returns None if value is None., Generates design system recommendations from aggregated searches. (+4 more)

### Community 15 - "generate-slide.py"
Cohesion: 0.15
Nodes (19): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+11 more)

### Community 16 - "TailwindConfigGenerator"
Cohesion: 0.11
Nodes (10): Generate Tailwind CSS configuration files., Add full color palette (50-950 shades) for a base color. Args: name: Color name…, TailwindConfigGenerator, Test that adding same plugin twice doesn't duplicate., Test generating TypeScript configuration., Test generating JavaScript configuration., Test generating config with plugins., Test generating complete TypeScript configuration. (+2 more)

### Community 17 - "fetch-background.py"
Cohesion: 0.17
Nodes (17): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+9 more)

### Community 18 - "BM25"
Cohesion: 0.15
Nodes (9): BM25, _normalize(), Apply synonym substitution before tokenizing., BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords, Build BM25 index from documents, Score all documents against query, All indexed terms, for suggestion/typo-recovery purposes. (+1 more)

### Community 19 - "icon/generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 20 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 21 - "main"
Cohesion: 0.13
Nodes (8): main(), Add custom font families. Args: fonts: Dict of font_type: [font_names] e.g.,…, Add custom spacing values. Args: spacing: Dict of name: value e.g., {'18':…, Add custom breakpoints. Args: breakpoints: Dict of name: width e.g., {'3xl':…, Add plugin requirements. Args: plugins: List of plugin names e.g.,…, Get plugin recommendations based on configuration. Returns: List of recommended…, Validate configuration. Returns: Tuple of (valid, message), Add custom colors to theme. Args: colors: Dict of color_name: color_value Value…

### Community 22 - "TestShadcnInstaller"
Cohesion: 0.16
Nodes (7): Test adding components in dry run mode., Test ShadcnInstaller class., Test initialization with dry run mode., Test checking for existing shadcn config., Test getting installed components when none exist., Test getting installed components without config., TestShadcnInstaller

### Community 23 - "extract-colors.cjs"
Cohesion: 0.22
Nodes (11): calculateCompliance(), colorDistance(), displayPalette(), extractHexColors(), findNearestBrandColor(), fs, generateImageMagickCommand(), hexToRgb() (+3 more)

### Community 24 - "validate-asset.cjs"
Cohesion: 0.25
Nodes (13): checkManifest(), formatBytes(), formatOutput(), fs, main(), parseFilename(), path, RULES (+5 more)

### Community 25 - ".add_components"
Cohesion: 0.20
Nodes (7): main(), Add all available shadcn/ui components. Args: overwrite: If True, overwrite…, List installed components. Returns: Tuple of (success, message with component…, Check if shadcn is initialized in project. Returns: True if components.json…, Get list of already installed components. Returns: List of installed component…, Read shadcn version from project package.json; fall back to a pinned default., Add shadcn/ui components. Args: components: List of component names to add…

### Community 26 - "ShadcnInstaller"
Cohesion: 0.15
Nodes (8): Path, Handle shadcn/ui component installation., Initialize installer. Args: project_root: Project root directory (default:…, ShadcnInstaller, Test adding components without shadcn config., Test listing installed components when none exist., Test initialization with custom project root., Test checking for non-existent shadcn config.

### Community 27 - "scripts/core.py"
Cohesion: 0.21
Nodes (12): _domain_keywords(), _get_bm25(), _load_csv(), _load_product_keywords(), Load CSV and return list of dicts, with mtime-based caching., Fitted BM25 index for this file+columns, with mtime-based caching., Core search function using BM25. Returns (results, bm25_or_none)., Nearest known vocabulary terms for a query that returned 0 hits, so the caller… (+4 more)

### Community 28 - "validate-tokens.cjs"
Cohesion: 0.24
Nodes (11): extensions, formatReport(), fs, getFiles(), main(), parseArgs(), path, patterns (+3 more)

### Community 29 - "test_tailwind_config_gen.py"
Cohesion: 0.20
Nodes (8): Tests for tailwind_config_gen.py, Reduce a generated TS/JS config to a bare assignable object so it can be handed…, Regression guard for the missing-comma bug between the ``theme`` block and…, The property preceding ``plugins`` must end with a comma (pure-Python check, so…, The emitted config parses as valid JS via ``node --check``., _strip_to_object(), TestGeneratedConfigIsValidJs, parametrize

### Community 30 - ".generate_config_string"
Cohesion: 0.20
Nodes (6): Generate configuration file content. Returns: Configuration file as string, Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config. Validates each plugin name against a strict…, Add indentation to JSON string., Write configuration to file. Returns: Tuple of (success, message)

### Community 31 - "inject-brand-context.cjs"
Cohesion: 0.31
Nodes (10): extractColorsFromTable(), extractCoreAttributes(), extractHexColors(), extractImageStyle(), extractTypography(), extractVoice(), fs, generatePromptAddition() (+2 more)

### Community 32 - "embed-tokens.cjs"
Cohesion: 0.20
Nodes (9): args, extractTokens(), fs, minimal, MINIMAL_TOKENS, path, projectRoot, tokensPath (+1 more)

### Community 33 - "duration"
Cohesion: 0.20
Nodes (10): fast, normal, slow, $type, $value, $type, $value, duration (+2 more)

### Community 34 - "patch"
Cohesion: 0.18
Nodes (6): Test adding components with overwrite flag., Test successful component addition., Test component addition with subprocess error., Test component addition when npx is not found., Test successful addition of all components., patch

### Community 35 - "search"
Cohesion: 0.24
Nodes (6): Main search function with auto-domain detection, search(), format_output(), Format results for Claude consumption (token-optimized), Known query -> expected top-domain sanity checks (not exact-row pinning, since…, TestSearchDomains

### Community 36 - "layout.tsx"
Cohesion: 0.27
Nodes (8): geistMono, geistSans, inter, metadata, RootLayout(), Button(), buttonVariants, cn()

### Community 37 - "._base_config"
Cohesion: 0.22
Nodes (6): Any, Path, Initialize generator. Args: typescript: If True, generate .ts config, else .js…, Determine default output path., Create base configuration structure., Get default content paths for framework.

### Community 38 - "logo/generate.py"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation Args: aspect_ratio:…, Generate multiple logo variants with different styles (+1 more)

### Community 39 - "generate-tokens.cjs"
Cohesion: 0.36
Nodes (9): flattenTokens(), fs, generateCSS(), generateTailwind(), main(), parseArgs(), path, resolveReference() (+1 more)

### Community 40 - "sync-brand-to-tokens.cjs"
Cohesion: 0.33
Nodes (8): adjustBrightness(), { execFileSync }, extractColorsFromMarkdown(), fs, generateColorScale(), main(), path, updateDesignTokens()

### Community 41 - "_run"
Cohesion: 0.28
Nodes (8): Path, Regression tests for validate-tokens.cjs. The validator used to skip any line…, A hardcoded hex on the same line as a var() token is still a violation., A line that references only tokens produces no false positives., _run(), test_flags_hardcoded_hex_sharing_line_with_token(), test_token_only_line_reports_no_violation(), CompletedProcess

### Community 42 - "radius"
Cohesion: 0.24
Nodes (10): $type, $value, $type, $value, primitive, radius, shadow, full (+2 more)

### Community 43 - "test_core.py"
Cohesion: 0.25
Nodes (4): detect_domain(), Auto-detect the most relevant domain from query. Matches are weighted by…, TestDomainDetection, TestPersistence

### Community 44 - "sm"
Cohesion: 0.60
Nodes (5): sm, sm, sm, $type, $value

### Community 45 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 46 - "Lightfall.tsx"
Cohesion: 0.70
Nodes (4): hexToRGB(), Lightfall(), LightfallProps, prepColors()

### Community 47 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 48 - "md"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 49 - "default"
Cohesion: 0.67
Nodes (4): $type, $value, default, default

### Community 50 - "validate_data.py"
Cohesion: 0.83
Nodes (3): _check_file(), main(), _read_rows()

## Knowledge Gaps
- **201 isolated node(s):** `fs`, `path`, `fs`, `path`, `fs` (+196 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `primitive` connect `radius` to `gray`, `duration`, `color`, `spacing`, `fontSize`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `color` connect `gray` to `radius`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `TestTailwindConfigGenerator`) actually correct?**
  _`TailwindConfigGenerator` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestDomainDetection` and `TestPersistence`) actually correct?**
  _`DesignSystemGenerator` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `fs` to the rest of the system?**
  _201 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `gray` be split into smaller, more focused modules?**
  _Cohesion score 0.05370101596516691 - nodes in this community are weakly interconnected._
- **Should `BM25` be split into smaller, more focused modules?**
  _Cohesion score 0.06693877551020408 - nodes in this community are weakly interconnected._