## SubStatz CSS best practices

- **TailwindCSS Utility-First**: Use TailwindCSS utility classes for all styling; avoid custom CSS when possible
- **ShadCN UI Theming**: Leverage ShadCN UI's design system and CSS variables for consistent theming
- **Responsive Design**: Use TailwindCSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for mobile-first design
- **Component Styling**: Style components using TailwindCSS classes; use `cn()` utility for conditional classes
- **Design Tokens**: Use CSS custom properties and TailwindCSS config for consistent spacing, colors, and typography
- **Dark Mode Support**: Implement dark mode using TailwindCSS dark mode utilities and ShadCN UI theming
- **Performance**: Leverage TailwindCSS purging to remove unused styles in production builds
- **Custom Components**: When extending ShadCN UI components, use TailwindCSS classes for customization
- **Global Styles**: Keep global styles minimal in `globals.css`; prefer component-level styling
