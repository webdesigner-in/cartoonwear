import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email and Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password');
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            throw new Error('No account found with this email address');
          }
          
          if (!user.password) {
            throw new Error('This account was created with social login. Please use Google to sign in');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Incorrect password. Please try again');
          }

          if (!user.isActive) {
            throw new Error('Your account has been deactivated. Please contact support');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Login error:', error.message);
          throw new Error(error.message);
        }
      }
    }),
    
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token
      if (user) {
        token.role = user.role
        token.isActive = user.isActive
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.isActive = token.isActive
      }
      return session
    },
    
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          // Check if existing user is active
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (existingUser && !existingUser.isActive) {
            console.log(`Blocked inactive user login attempt: ${user.email}`)
            return false
          }
          
          return true
        } catch (error) {
          console.error('Google OAuth sign-in error:', error)
          return false
        }
      }
      return true
    }
  },
  
  events: {
    async createUser({ user }) {
      // Fix role for new users created by PrismaAdapter
      // PrismaAdapter creates users with default schema values, so we need to fix them
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            role: 'CUSTOMER',  // Ensure new users get CUSTOMER role
            isActive: true     // Ensure they're active
          }
        })
        console.log(`✅ Set CUSTOMER role for new user: ${user.email}`)
      } catch (error) {
        console.error('❌ Error setting user role:', error)
      }
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }