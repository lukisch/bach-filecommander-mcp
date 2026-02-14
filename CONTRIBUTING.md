# Contributing to recludOS FileCommander MCP

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Make your changes in `src/index.ts`
6. Test manually with your MCP client

## Development

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# One-time build
npm run build

# Start the server
npm start
```

## Pull Request Guidelines

- Keep changes focused - one feature or fix per PR
- Update the CHANGELOG.md with your changes
- Follow the existing code style
- Test your changes with an actual MCP client (e.g., Claude Desktop)

## Adding New Tools

When adding a new tool:

1. Follow the `fc_` prefix convention
2. Include proper `annotations` (readOnlyHint, destructiveHint, etc.)
3. Add the tool to the README's tool table
4. Add error handling with descriptive error messages

## Code Style

- TypeScript strict mode
- Use async/await (no raw Promises)
- Error messages should be clear and actionable
- Use the existing helper functions (`normalizePath`, `pathExists`, `formatFileSize`)

## Reporting Issues

- Use GitHub Issues
- Include your Node.js version, OS, and MCP client
- For bugs, include steps to reproduce

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
