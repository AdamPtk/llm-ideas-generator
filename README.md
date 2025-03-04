# Ideas Generator

A modern web application built with Next.js that helps users generate creative ideas using AI. This project combines the power of LLM's with a beautiful, responsive UI built using TailwindCSS and Shadcn components.

## 🚀 Features

- 🤖 AI-powered idea generation
- 🌙 Dark/Light mode support
- 🔒 User authentication with Clerk
- 📱 Responsive design
- 🎨 Modern UI with TailwindCSS and Shadcn
- ⚡ Fast and optimized performance
- 🔄 Real-time idea generation
- 💾 Persistent storage with MongoDB

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Shadcn/UI
- **Authentication:** Clerk
- **Database:** MongoDB
- **AI Integration:** OpenAI API, Anthropic API, Deepseek API
- **State Management:** React Hooks
- **Deployment:** Vercel (recommended)

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB database
- OpenAI API key
- Clerk account for authentication

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ideas-generator.git
   cd ideas-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```
   OPENAI_API_KEY=your_openai_api_key
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Usage

1. Sign up or log in using your Clerk account
2. Navigate to the idea generation page
3. Enter your prompt or topic
4. Click "Generate" to get AI-powered ideas
5. Save or share your generated ideas

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- Adam Pietkiewicz (AdamPtk) - Initial work

## 🙏 Acknowledgments

- OpenAI for their powerful API
- Clerk for authentication
- The Next.js team for the amazing framework
- The TailwindCSS and Shadcn communities for the beautiful UI components
