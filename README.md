# Prestige Finance

A modern, responsive web application for managing personal finances, built with Next.js and TypeScript.

## Live Demo

🌐 [View Live Demo](https://prestige-financial-danny-g.netlify.app/accounts)

## Screenshots

![Prestige Finance Dashboard](screen-shots/Screenshot%202025-03-20%20090110.png)

## Features

- 💳 Account Management
- 💸 Transaction History
- 👥 Friends & Social Features
- 📱 Responsive Design
- 🔒 Secure State Management with Redux
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.2.2
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Testing**: Jest & React Testing Library
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prestige-finance.git
cd prestige-finance
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The static build will be generated in the `out` directory.

## Project Structure

```
prestige-finance/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable components
│   ├── store/              # Redux store and slices
│   └── data/               # Static data and mock data
├── public/                 # Static assets
└── __tests__/             # Test files
```

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

For watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```

## Deployment

This project is configured for static export and can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Netlify Deployment

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Set the build command to `npm run build`
4. Set the publish directory to `out`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
