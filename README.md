# SockShop Automation Framework

A Playwright + TypeScript automation framework for testing SockShop.co.uk

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- VS Code recommended ([Download](https://code.visualstudio.com/))

### Setup

```bash
# 1. Navigate to project folder
cd sockshop-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Run tests
npm test
```

## 📁 Project Structure

```
sockshop-automation/
├── src/
│   ├── config/
│   │   └── environment.ts      # Environment configuration
│   ├── core/
│   │   └── pages/
│   │       ├── BasePage.ts     # Base class for all pages
│   │       ├── HomePage.ts     # Homepage page object
│   │       └── index.ts        # Barrel exports
│   └── tests/
│       └── amazon.spec.ts    # Homepage test cases
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## 🧪 Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:report` | View HTML test report |
| `npm run test:codegen` | Open codegen to record tests |

## 🔧 VS Code Extensions (Recommended)

1. **Playwright Test for VSCode** - Run tests from VS Code
2. **TypeScript** - Built-in support
3. **ESLint** - Code quality

## 📝 Java to TypeScript Quick Reference

| Concept | Java/Selenium | TypeScript/Playwright |
|---------|---------------|----------------------|
| Test annotation | `@Test` | `test()` |
| Before each | `@BeforeMethod` | `test.beforeEach()` |
| Test class | `class MyTest` | `test.describe()` |
| Page object | `class extends BasePage` | Same! |
| Find element | `driver.findElement(By.css())` | `page.locator()` |
| Click | `element.click()` | `await element.click()` |
| Type text | `element.sendKeys()` | `await element.fill()` |
| Wait | `WebDriverWait` | Auto-waits! |
| Assert | `Assert.assertTrue()` | `expect().toBe...()` |

## 🎯 Key Differences from Selenium

1. **No explicit waits needed** - Playwright auto-waits for elements
2. **No StaleElementException** - Locators are re-evaluated each time
3. **Built-in assertions** - `expect()` with auto-retry
4. **Trace viewer** - Debug failed tests visually
5. **Parallel by default** - Tests run in parallel out of the box

## 📚 Next Steps

1. Add more page objects (LoginPage, ProductPage, etc.)
2. Add your credentials to `src/config/environment.ts`
3. Create more test scenarios
4. Set up CI/CD pipeline

## 🆘 Troubleshooting

**Tests fail with "browser not found"**
```bash
npx playwright install
```

**TypeScript errors in VS Code**
```bash
npm install
```

**Need to see what's happening**
```bash
npm run test:headed
```
