# Contributing to Bitcoin Inscription Viewer

Thank you for your interest in contributing to the Bitcoin Inscription Viewer! We welcome contributions from the community to help make this library better for everyone.

## 🤝 How to Contribute

### 🐛 Reporting Issues

If you find a bug or have a feature request, please create an issue on GitHub with:

1. **Clear description** of the problem or feature request
2. **Steps to reproduce** (for bugs)
3. **Expected behavior** vs **actual behavior**
4. **Environment details** (OS, browser, Node.js version, etc.)
5. **Screenshots or code samples** when helpful

### 💡 Feature Requests

We're always interested in new features! Before submitting a feature request:

1. Check if a similar request already exists
2. Describe the use case and why it would be beneficial
3. Consider if it fits with the library's goals and scope
4. Provide mockups or examples if applicable

### 🔧 Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/switch-900/inscription-viewer.git
   cd inscription-viewer
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### 📋 Development Guidelines

#### Code Style
- Use **TypeScript** for all new code
- Follow existing code formatting and naming conventions
- Use **ESLint** and **Prettier** (will be configured in future versions)
- Write **clear, descriptive variable and function names**
- Add **JSDoc comments** for public APIs

#### Component Guidelines
- Components should be **responsive by default**
- Use **React.memo** for performance optimization where appropriate
- Implement **proper error boundaries** and error handling
- Follow **accessibility best practices** (ARIA labels, keyboard navigation)
- Use **semantic HTML** elements

#### TypeScript Guidelines
- Maintain **strict type safety**
- Export types that other developers might need
- Use **proper generic types** for reusable components
- Document complex types with comments

#### Responsive Design
- All new components must be **fully responsive**
- Test on multiple screen sizes and devices
- Use **CSS Grid** and **Flexbox** for layouts
- Ensure content maintains **aspect ratio** while filling containers
- Content should be **perfectly centered** in all container sizes

#### Testing
- Add tests for new features and bug fixes
- Test responsive behavior at different screen sizes
- Test with different inscription types and content
- Verify error handling and edge cases

### 🚀 Submitting Changes

1. **Ensure your code passes all checks**:
   ```bash
   npm run type-check
   npm run build
   ```

2. **Test your changes thoroughly**:
   - Test responsive design at different screen sizes
   - Test with various inscription types
   - Test error scenarios and edge cases
   - Verify performance doesn't regress

3. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add responsive image zoom functionality"
   # or
   git commit -m "fix: resolve aspect ratio issue in video renderer"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** with:
   - Clear title and description
   - Link to any related issues
   - Screenshots or GIFs for UI changes
   - Testing instructions for reviewers

### 📝 Pull Request Guidelines

#### PR Title Format
Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code restructuring`
- `test: add or update tests`
- `chore: maintenance tasks`

#### PR Description Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested with different inscription types
- [ ] Added/updated tests

## Screenshots
(If applicable)

## Related Issues
Fixes #123
```

### 🎯 Priority Areas

We especially welcome contributions in these areas:

#### High Priority
- **Accessibility improvements** (ARIA labels, keyboard navigation, screen reader support)
- **Performance optimizations** (lazy loading, memory management, bundle size)
- **Mobile responsiveness** enhancements
- **Error handling** and user experience improvements
- **Documentation** and examples

#### Medium Priority
- **New content type renderers** (additional file formats)
- **Advanced 3D model features** (lighting, animations, materials)
- **Video and audio enhancements** (subtitles, chapters, quality selection)
- **Advanced gallery features** (search, filtering, sorting)
- **Integration guides** for popular frameworks

#### Future Considerations
- **Animation and transition** improvements
- **Dark mode** theme support
- **Internationalization** (i18n) support
- **Advanced caching** strategies
- **Social features** (sharing, favorites)

### 🏗️ Architecture Guidelines

#### File Structure
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── InscriptionViewer/ # Main viewer components
│   └── renderers/       # Content type renderers
├── services/            # API and data services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Sample data and constants
```

#### Component Architecture
- **Separation of concerns**: Keep business logic separate from UI components
- **Composition over inheritance**: Build complex components from simpler ones
- **Props interfaces**: Well-defined TypeScript interfaces for all component props
- **Error boundaries**: Proper error handling at component boundaries

#### State Management
- Use **React hooks** for local component state
- Consider **context** for shared state between components
- Avoid **prop drilling** by using appropriate state management patterns
- Keep state **minimal and normalized**

### 🧪 Testing Strategy

#### Unit Tests
- Test individual component functionality
- Test utility functions and helpers
- Test error handling and edge cases
- Mock external dependencies appropriately

#### Integration Tests
- Test component interactions
- Test API integration and data flow
- Test responsive behavior
- Test accessibility features

#### Manual Testing Checklist
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Android Chrome)
- [ ] Different screen sizes and orientations
- [ ] Various inscription types and content
- [ ] Error scenarios (network failures, invalid IDs)
- [ ] Performance with large galleries
- [ ] Accessibility with screen readers

### 📚 Documentation

When contributing, please update relevant documentation:

- **README.md** - For major feature additions
- **API.md** - For new props or API changes
- **EXAMPLES.md** - For new usage patterns
- **INTEGRATION-GUIDE.md** - For integration improvements
- **JSDoc comments** - For all public APIs
- **CHANGELOG.md** - For all notable changes

### 🔍 Code Review Process

1. **Automated checks** must pass (TypeScript, build)
2. **Manual review** by maintainers
3. **Testing** of the changes in development environment
4. **Discussion** and iteration if needed
5. **Merge** once approved

### 🎉 Recognition

Contributors will be:
- Listed in the project's contributors
- Mentioned in release notes for significant contributions
- Given credit in documentation for major features

### 📞 Getting Help

If you need help or have questions:

1. **Check existing issues** and documentation first
2. **Create a discussion** for general questions
3. **Join our community** (links will be added when available)
4. **Reach out to maintainers** for guidance

### 🌟 Code of Conduct

This project follows a standard code of conduct:

- **Be respectful** and inclusive
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and questions
- **Be collaborative** and work together
- **Be open** to different perspectives and approaches

We reserve the right to remove contributors who don't follow these guidelines.

---

## 🚀 Ready to Contribute?

1. Fork the repository
2. Set up your development environment
3. Find an issue or create a feature
4. Follow the guidelines above
5. Submit your pull request

Thank you for helping make Bitcoin Inscription Viewer better for everyone! 🙏

---

**Questions?** Feel free to create an issue or start a discussion. We're here to help! 💬
