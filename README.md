# .NET 10 Next.js React Server Components Identity Auth Template

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/next-static.webp)

> Browse [source code](https://github.com/NetCoreTemplates/next-rsc)

A modern full-stack .NET 10.0 + Next.js 16 project template that combines the power of ServiceStack with Next.js static site generation and React 19. It provides a production-ready foundation for building scalable web applications with integrated authentication, database management, and background job processing.

## Quick Start

```bash
npx create-net next-rsc MyProject
```

## Getting Started

Run Server .NET Project (automatically starts both .NET and Next.js dev servers):

```bash
cd MyProject
dotnet watch
```

## Architecture

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/next-static-info.webp)

### Hybrid Development Approach

**Development Mode:**
- ASP.NET Core proxies requests to Next.js dev server (running on port 3000)
- Hot Module Replacement (HMR) support for instant UI updates
- WebSocket proxying for Next.js HMR functionality

**Production Mode:**
- Next.js app is statically exported to `/dist`
- Static files served directly from ASP.NET Core's wwwroot
- No separate Node.js server required in production

## Core Technologies

### Backend (.NET 10.0)
- **ServiceStack 8.x** - High-performance web services framework
- **ASP.NET Core Identity** - Complete authentication & authorization system
- **Entity Framework Core** - For Identity data management
- **OrmLite** - ServiceStack's fast, lightweight ORM for application data
- **SQLite** - Default database (easily upgradable to PostgreSQL/SQL Server/MySQL)

### Frontend (Next.js 16 + React 19)
- **Next.js** with static export capability
- **Tailwind CSS 4.x** - Utility-first styling with PostCSS
- **TypeScript** - Type-safe development
- **Vitest** - Modern testing framework
- **ServiceStack React Components** - Pre-built UI components

### .NET Frontend (Integrated + Optional)
- **Razor Pages** - For Identity UI (`/Identity` routes)

## Major Features

### 1. Authentication & Authorization
- ASP.NET Core Identity integration with role-based access control
- Custom user sessions with additional claims
- Admin users feature for user management at `/admin-ui/users`
- Email confirmation workflow (configurable SMTP)
- Razor Pages for Identity UI (`/Identity` routes)
- Credentials-based authentication

### 2. AutoQuery CRUD
- Declarative API development with minimal code
- Complete CRUD operations (see Bookings example at `/bookings-auto`)
- Automatic audit trails (created/modified/deleted tracking)
- Built-in validation and authorization
- Type-safe TypeScript DTOs auto-generated from C# models

### 3. Background Jobs
- `BackgroundsJobFeature` for async task processing
- Command pattern for job execution
- Email sending via background jobs
- Recurring job scheduling support
- Upgradable to `DatabaseJobsFeature` for enterprise RDBMS

### 4. Developer Experience
- **Admin UI** at `/admin-ui` for App management
- **Health checks** at `/up` endpoint
- **Modular startup** configuration pattern
- **Code-first migrations** with OrmLite
- **Docker support** with container publishing
- **Kamal deployment** configuration included

### 5. Production Features
- Static asset caching with intelligent cache invalidation
- Clean URLs without `.html` extensions
- HTTPS redirection and HSTS
- Data protection with persistent keys
- Health monitoring
- Database developer page for EF Core errors

## Project Structure

```
MyApp/                      # Main ASP.NET Core host
├── Configure.*.cs          # Modular startup configuration
├── Program.cs              # Application entry point
├── Proxy.cs                # Next.js dev server proxy utilities
└── wwwroot/                # Static files (production)

MyApp.Client/              # Next.js frontend application
├── app/                   # Next.js App Router pages
├── components/            # React components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── dist/                  # Build output (production)

MyApp.ServiceInterface/    # Service implementations
├── MyServices.cs          # Example services
└── Data/                  # EF Core DbContext

MyApp.ServiceModel/        # DTOs and service contracts
├── Bookings.cs            # AutoQuery CRUD example
└── Hello.cs               # Example service contract

MyApp.Tests/              # Integration and unit tests
config/                   # Kamal deployment configuration
```

## Development Workflow

### 1. Start Development
```bash
dotnet watch
```
This automatically starts both .NET and Next.js dev servers.

### 2. Generate TypeScript DTOs
After modifying C# service models, regenerate TypeScript types:
```bash
cd MyApp.Client
npm run dtos
```

### 3. Database Migrations

**OrmLite and Entity Framework:**
```bash
npm run migrate
```

**OrmLite (for application data):**
Create migration classes in `MyApp/Migrations/` following the pattern in `Migration1000.cs`.

### 4. Testing

**Frontend:**
```bash
cd MyApp.Client
npm run test        # Run tests in watch mode
npm run test:ui     # Run tests with UI
npm run test:run    # Run tests once
```

**Backend:**
```bash
dotnet test
```

### 5. Build for Production
```bash
cd MyApp.Client
npm run publish
```
This builds the Next.js static export and publishes the .NET application.

## Deployment Options

### Docker
Built-in container support with .NET SDK:
```bash
dotnet publish -c Release
```

### Kamal
Zero-downtime deployments with included configuration:
```bash
kamal deploy
```

### Traditional Hosting
Deploy as a standard ASP.NET Core application to IIS, Kestrel, or any hosting provider.

## Key Configuration Files

- **MyApp/appsettings.json** - Application configuration
- **MyApp.Client/next.config.mjs** - Next.js configuration
- **MyApp.Client/styles/index.css** - Tailwind CSS configuration
- **config/deploy.yml** - Kamal deployment settings

## Upgrading to Enterprise Database

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (ef-postgres, ef-mysql, ef-sqlserver), e.g:

```bash
x mix ef-postgres
```

2. Install `db-identity` to use RDBMS `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for Request Logs:

```bash
x mix db-identity
```

## Ideal Use Cases

- SaaS applications requiring authentication
- Admin dashboards with CRUD operations
- Content-driven sites with dynamic APIs
- Applications needing background job processing
- Projects requiring both SSG benefits and API capabilities
- Teams wanting type-safety across full stack

## Learn More

- [ServiceStack Documentation](https://docs.servicestack.net)
- [Next.js Documentation](https://nextjs.org/docs)
- [AutoQuery CRUD](https://docs.servicestack.net/autoquery-crud)
- [ServiceStack Auth](https://docs.servicestack.net/authentication-and-authorization)