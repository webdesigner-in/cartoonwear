# The Kroshet Nani - Handmade Crochet Store

A beautiful e-commerce platform for handmade crochet items built with Next.js 15, featuring a modern design and comprehensive admin functionality.

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by categories with search functionality
- **Product Details**: Detailed product pages with image galleries and specifications
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Sign up, sign in with email/password or OAuth (Google, GitHub)
- **User Profile**: Manage personal information and delivery addresses
- **Order Management**: View order history and track order status
- **Checkout Process**: Complete checkout with address selection and payment options
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of sales, products, orders, and users
- **Product Management**: Add, edit, delete products with full specifications
- **Order Management**: View and update order statuses
- **Category Management**: Organize products into categories
- **User Management**: View customer information
- **Analytics**: Sales and performance metrics

### Technical Features
- **Modern Stack**: Next.js 15 with App Router, React 19, TailwindCSS v4
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **State Management**: Zustand for client-side state
- **Payment Integration**: Cashfree payment gateway support
- **Image Handling**: Optimized image loading with fallbacks
- **SEO Optimized**: Meta tags and structured data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the_kroshet_nani
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_ID=""
   GITHUB_SECRET=""

   # Payment Gateway (Optional)
   CASHFREE_APP_ID=""
   CASHFREE_SECRET_KEY=""
   CASHFREE_ENVIRONMENT="sandbox"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push database schema
   npx prisma db push

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/      # Product management
│   │   ├── cart/         # Shopping cart
│   │   ├── order/        # Order management
│   │   ├── user/         # User management
│   │   └── admin/        # Admin endpoints
│   ├── auth/             # Authentication pages
│   ├── admin/            # Admin dashboard
│   ├── products/         # Product pages
│   ├── cart/             # Shopping cart
│   ├── orders/           # Order management
│   └── profile/          # User profile
├── components/            # Reusable components
│   ├── Header.js         # Navigation header
│   ├── Footer.js         # Site footer
│   ├── CartContext.js    # Shopping cart context
│   └── AuthProvider.js   # Authentication provider
├── lib/                  # Utility libraries
│   └── prisma.js         # Database client
└── store/                # State management
    └── productStore.js   # Product state
```

## 🗄️ Database Schema

The application uses Prisma with SQLite and includes the following main models:

- **User**: Customer and admin accounts
- **Product**: Crochet items with detailed specifications
- **Category**: Product categorization
- **CartItem**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Individual items in orders
- **Address**: Customer delivery addresses
- **Review**: Product reviews and ratings

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and seed database

## 🎨 Customization

### Styling
The application uses TailwindCSS v4 with custom CSS variables for theming. Colors and styles can be customized in `src/app/globals.css`.

### Adding New Features
1. Create API routes in `src/app/api/`
2. Add pages in `src/app/`
3. Create reusable components in `src/components/`
4. Update the database schema in `prisma/schema.prisma`

## 🔐 Authentication

The application supports multiple authentication methods:
- Email/password authentication
- Google OAuth
- GitHub OAuth

Admin users can be created by setting the `role` field to `ADMIN` or `SUPER_ADMIN` in the database.

## 💳 Payment Integration

The application includes Cashfree payment gateway integration for online payments. Configure your Cashfree credentials in the environment variables.

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for mobile devices with:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized images and loading states
- Responsive navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: hello@thekroshetnani.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- TailwindCSS for the utility-first CSS framework
- The crochet community for inspiration

---

**Made with ❤️ for the crochet community**