# Getting Started with BaseCompose

Welcome! This guide will help you get started with BaseCompose, whether you're a user or a contributor.

## For Users

### Quick Start (5 minutes)

1. **Visit the Website**
   - Go to [basecompose.example.com](https://basecompose.example.com)
   - No installation needed!

2. **Create Your Stack**
   - Chat with the AI assistant
   - Select your preferred technologies
   - Download your complete stack

3. **Run Locally**
   ```bash
   unzip basecompose-stack.tar.gz
   cd my-app
   docker-compose up
   ```

### What You Can Build

- Full-stack SaaS applications
- REST APIs with databases
- Microservices architectures
- Prototypes and MVPs
- Production-ready applications

### Supported Technologies

**Frontend:**
- Next.js 14+

**Backend:**
- Node.js + Express
- FastAPI (Python)

**Database:**
- MongoDB
- PostgreSQL
- Redis (cache)

**Authentication:**
- Auth.js (NextAuth)

## For Contributors

### New to Open Source?

We welcome first-time contributors! Here's how to get started:

1. **Understand the Project**
   - Read [README.md](README.md)
   - Check [DEVELOPMENT.md](DEVELOPMENT.md) for architecture

2. **Set Up Locally**
   - Follow [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
   - Run setup script: `./scripts/setup.sh` or `./scripts/setup.bat`

3. **Find Your First Issue**
   - Look for [good first issue](https://github.com/icancodefyi/basecompose/labels/good%20first%20issue)
   - Start small and simple
   - Ask questions if unsure!

### Contributing Types

Choose what interests you most:

#### 🐛 Bug Fixes
- Find issues marked `bug`
- Fix and test the bug
- Submit PR with test case

**Good for:** Anyone wanting to fix problems

**Difficulty:** Varies

#### ✨ New Features
- Check [feature requests](https://github.com/icancodefyi/basecompose/issues?q=label%3Aenhancement)
- Implement the feature
- Add documentation

**Good for:** Intermediate developers

**Difficulty:** Medium to Hard

#### 📚 Documentation
- Improve existing docs
- Add missing documentation
- Create tutorials

**Good for:** Writers and technical communicators

**Difficulty:** Easy to Medium

#### 🎨 UI/UX
- Improve user interface
- Enhance user experience
- Create designs

**Good for:** Designers and frontend developers

**Difficulty:** Medium

#### 🧪 Testing
- Write tests
- Test edge cases
- Create test fixtures

**Good for:** QA engineers

**Difficulty:** Medium

### Development Workflow

1. **Fork the Repository**
   ```bash
   # On GitHub, click "Fork"
   git clone https://github.com/YOUR_USERNAME/basecompose.git
   cd basecompose
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Code your changes
   - Test locally
   - Commit with meaningful message

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

5. **Review and Merge**
   - Wait for reviews
   - Make requested changes
   - Get merged!

### Common Tasks

#### Add a New Technology

1. Open `packages/types/stack-config.ts`
2. Add your technology to the appropriate category
3. Update types in `packages/types/blueprint.ts`
4. Test in dev server: `pnpm dev`

#### Fix a Bug

1. Understand the bug (check issue description)
2. Write a test that reproduces it
3. Fix the code
4. Verify test passes
5. Submit PR

#### Improve Documentation

1. Edit the relevant `.md` file
2. Make it clearer/more complete
3. Check links are valid
4. Submit PR

## Development Tools

### Essential Commands

```bash
# Installation
pnpm install              # Install dependencies

# Development
pnpm dev                  # Start dev server
pnpm dev:watch            # Dev with watch

# Building
pnpm build                # Build for production
pnpm start                # Start production

# Code Quality
pnpm lint                 # Check code style
pnpm lint:fix             # Fix code style
pnpm typecheck            # Check TypeScript

# Testing
pnpm test                 # Run tests
pnpm test:watch           # Tests with watch
```

### Recommended Editor

We recommend VS Code with these extensions:
- ESLint
- Prettier
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense

### Browser DevTools

- React Developer Tools
- Redux DevTools (if using Redux)
- MongoDB Compass (for database)

## Project Structure Quick Reference

```
basecompose/
├── app/                    # Next.js application
│   ├── api/               # API endpoints
│   ├── chat/              # Chat interface
│   └── components/        # UI components
├── packages/              # Shared code
│   ├── engine/            # Generation logic
│   └── types/             # Type definitions
├── templates/             # Template files
├── lib/                   # Utilities
├── public/                # Static files
├── scripts/               # Automation scripts
└── .github/               # GitHub config
```

## Getting Help

### Questions?
- Open a [Discussion](https://github.com/icancodefyi/basecompose/discussions)
- Ask in the issue you're working on
- Email maintainers

### Need to Report a Bug?
- Check [existing issues](https://github.com/icancodefyi/basecompose/issues)
- Create using [bug template](.github/ISSUE_TEMPLATE/bug_report.md)

### Have a Feature Idea?
- Check [existing discussions](https://github.com/icancodefyi/basecompose/discussions)
- Create using [feature template](.github/ISSUE_TEMPLATE/feature_request.md)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). We're committed to creating an inclusive, welcoming community.

## Security

Found a security vulnerability? Please see [SECURITY.md](SECURITY.md) for responsible disclosure.

## Next Steps

Choose your path:

### Path 1: Just Getting Started
- [ ] Read README.md
- [ ] Set up locally using DEVELOPMENT_SETUP.md
- [ ] Run `pnpm dev` and explore
- [ ] Find a [good first issue](https://github.com/icancodefyi/basecompose/labels/good%20first%20issue)

### Path 2: Want to Contribute Code
- [ ] Set up development environment
- [ ] Read CONTRIBUTING.md
- [ ] Pick an issue or create one
- [ ] Follow the contribution workflow

### Path 3: Want to Improve Docs
- [ ] Read existing documentation
- [ ] Identify improvements
- [ ] Submit documentation PR

### Path 4: Want to Report Issues
- [ ] Try to reproduce the issue
- [ ] Use bug report template
- [ ] Submit with clear details

## Learning Resources

- **Git & GitHub**: [GitHub Learning Lab](https://lab.github.com/)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **React**: [React Official Docs](https://react.dev/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Tailwind CSS**: [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com/)

## Celebrating Contributions

We celebrate all contributions! You'll be recognized in:
- GitHub contributors page
- README contributors section
- Release notes

## Good Luck! 🚀

We're excited to have you as part of the BaseCompose community!

Remember:
- **Be respectful** - Everyone deserves respect
- **Be patient** - Learning takes time
- **Ask questions** - No question is too simple
- **Have fun** - Enjoy the process!

Questions? Open an issue or start a discussion. We're here to help!

---

**Ready to contribute?** [Start here!](CONTRIBUTING.md)
