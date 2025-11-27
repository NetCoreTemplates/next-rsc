# .NET 10 Next.js React Server Components Identity Auth Template

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/next-rsc.webp)

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

### Unified Proxy Architecture

This template uses a consistent architecture across all environments where the .NET application always proxies requests to a full-featured Next.js server:

**Development Mode:**

![](https://raw.githubusercontent.com/ServiceStack/docs.servicestack.net/refs/heads/main/MyApp/wwwroot/img/pages/react/info/next-rsc-dev.svg)

- ASP.NET Core proxies requests to Next.js dev server (running on port 3000)
- Hot Module Replacement (HMR) support for instant UI updates
- WebSocket proxying for Next.js HMR functionality
- Automatic startup of Next.js dev server in `dotnet watch`

**Production Mode:**

![](https://raw.githubusercontent.com/ServiceStack/docs.servicestack.net/refs/heads/main/MyApp/wwwroot/img/pages/react/info/next-rsc-prod.svg)

- ASP.NET Core proxies requests to Next.js production server (running on port 3000)
- Both servers run side-by-side in the same Docker container
- Static file responses cached in `NodeProxy` in-memory managed cache for optimal performance
- Full Next.js capabilities including React Server Components and dynamic rendering
- Single container deployment with coordinated process management

## Core Technologies

### Frontend (Next.js 16 + React 19)
- **Next.js** with static export capability
- **Tailwind CSS 4.x** - Utility-first styling with PostCSS
- **TypeScript** - Type-safe development
- **Vitest** - Modern testing framework
- **ServiceStack React Components** - Pre-built UI components

### .NET Frontend (Integrated + Optional)
- **Razor Pages** - For Identity Auth UI (`/Identity` routes)

### Backend (.NET 10.0)
- **ServiceStack 10.x** - High-performance web services framework
- **ASP.NET Core Identity** - Complete authentication & authorization system
- **Entity Framework Core** - For Identity data management
- **OrmLite** - ServiceStack's fast, lightweight Typed ORM for application data
- **SQLite** - Default database (easily upgradable to PostgreSQL/SQL Server/MySQL)

## Major Features

### 1. Authentication & Authorization
- ASP.NET Core Identity integration with role-based access control
- Custom user sessions with additional claims
- Admin users feature for user management at `/admin-ui/users`
- Email confirmation workflow (configurable SMTP)
- Razor Pages for Identity UI (`/Identity` routes)
- Credentials-based authentication

### [2. AutoQuery CRUD](#autoquery-crud-dev-workflow)
- Declarative API development with minimal code
- Complete Auth-protected CRUD operations (see Bookings example at `/bookings-auto`)
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
MyApp/                       # Main ASP.NET Core host
├── Configure.*.cs           # Modular startup configuration
├── Program.cs               # Application entry point
└── wwwroot/                 # Static files (production)

MyApp.Client/                # Next.js frontend application
├── app/                     # Next.js App Router pages
├── components/              # React components
├── lib/                     # Utilities and helpers
├── public/                  # Static assets
└── dist/                    # Build output (production)

MyApp.ServiceInterface/      # Service implementations
├── MyServices.cs            # Example services
└── Data/                    # EF Core DbContext

MyApp.ServiceModel/          # DTOs and service contracts
├── Bookings.cs              # AutoQuery CRUD example
└── Hello.cs                 # Example service contract

MyApp.Tests/                 # Integration and unit tests

config/                      # Deployment configuration
└── deploy.yml               # Kamal deployment settings

.github/                     # GitHub Actions workflows
└── workflows/
    ├── build.yml            # CI build and test
    ├── build-container.yml  # Container image build
    └── release.yml          # Production deployment with Kamal
```

## Development Workflow

### 1. Start Development

```bash
dotnet watch
```

This automatically starts both .NET and Next.js dev servers.

### 2. Generate TypeScript DTOs

After modifying C# service models, regenerate TypeScript dtos.ts in `MyApp` or `MyApp.Client` with:

```bash
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

## Configuration

### Key Configuration Files

- **MyApp/appsettings.json** - Application configuration
- **MyApp.Client/next.config.mjs** - Next.js configuration
- **MyApp.Client/styles/index.css** - Tailwind CSS configuration
- **config/deploy.yml** - Kamal deployment settings

### App Settings

Configure in `appsettings.json` or environment:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "DataSource=App_Data/app.db;Cache=Shared"
  },
  "SmtpConfig": {
    "Host": "smtp.example.com",
    "Port": 587,
    "FromEmail": "noreply@example.com",
    "FromName": "MyApp"
  },
  "AppConfig": {
    "BaseUrl": "https://myapp.example.com"
  }
}
```

### App Settings Secrets

Instead of polluting each GitHub Reposity with multiple App-specific GitHub Action Secrets, you can save all your secrets in a single `APPSETTINGS_PATCH` GitHub Action Secret to patch `appsettings.json` with environment-specific configuration using [JSON Patch](https://jsonpatch.com). E.g:

```json
[
    {
        "op":"replace",
        "path":"/ConnectionStrings/DefaultConnection",
        "value":"Server=service-postgres;Port=5432;User Id=dbuser;Password=dbpass;Database=dbname;Pooling=true;"
    },
    { "op":"add", "path":"/SmtpConfig", "value":{
        "UserName": "SmptUser",
        "Password": "SmptPass",
        "Host": "email-smtp.us-east-1.amazonaws.com",
        "Port": 587,
        "From": "noreply@example.org",
        "FromName": "MyApp",
        "Bcc": "copy@example.org"
      } 
    },
    { "op":"add", "path":"/Admins", "value": ["admin1@email.com","admin2@email.com"] },
    { "op":"add", "path":"/CorsFeature/allowOriginWhitelist/-", "value":"https://servicestack.net" }
]
```

### SMTP Email

Enable email sending by uncommenting in `Program.cs`:

```csharp
services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
```

## Upgrading to Enterprise Database

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (ef-postgres, ef-mysql, ef-sqlserver), e.g:

```bash
npx add-in ef-postgres
```

2. Install `db-identity` to use RDBMS `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for Request Logs:

```bash
npx add-in db-identity
```

## Deployment

### Docker + Kamal

This project includes GitHub Actions for CI/CD with automatic Docker image builds and production [deployment with Kamal](https://docs.servicestack.net/kamal-deploy). The `/config/deploy.yml` configuration is designed to be reusable across projects—it dynamically derives service names, image paths, and volume mounts from environment variables, so you only need to configure your server's IP and hostname using GitHub Action secrets.

### GitHub Action Secrets

**Required - App Specific*:

The only secret needed to be configured per Repository.

| Variable | Example | Description |
|----------|---------|-------------|
| `KAMAL_DEPLOY_HOST` | `example.org` | Hostname used for SSL certificate and Kamal proxy |

**Required** (Organization Secrets):

Other Required variables can be globally configured in your GitHub Organization or User secrets which will
enable deploying all your Repositories to the same server.

| Variable | Example  | Description |
|----------|----------|-------------|
| `KAMAL_DEPLOY_IP`   | `100.100.100.100` | IP address of the server to deploy to |
| `SSH_PRIVATE_KEY`   | `ssh-rsa ...`     | SSH private key to access the server |
| `LETSENCRYPT_EMAIL` | `me@example.org`  | Email for Let's Encrypt SSL certificate |

**Optional**:

| Variable | Example | Description |
| `SERVICESTACK_LICENSE` | `...` | ServiceStack license key |

**Inferred** (from GitHub Action context):

These are inferred from the GitHub Action context and don't need to be configured.

| Variable | Source | Description |
|----------|--------|-------------|
| `GITHUB_REPOSITORY` | `${{ github.repository }}` | e.g. `acme/example.org` - used for service name and image |
| `KAMAL_REGISTRY_USERNAME` | `${{ github.actor }}` | GitHub username for container registry |
| `KAMAL_REGISTRY_PASSWORD` | `${{ secrets.GITHUB_TOKEN }}` | GitHub token for container registry auth |

#### Features

- **Docker containerization** with optimized .NET images
- **SSL auto-certification** via Let's Encrypt
- **GitHub Container Registry** integration
- **Volume persistence** for App_Data including any SQLite database


## AutoQuery CRUD Dev Workflow

For Rapid Development simple [TypeScript Data Models](https://docs.servicestack.net/autoquery/okai-models) can be used to generate C# AutoQuery APIs and DB Migrations.

### Cheat Sheet

Create a new Table use `init <Table>`, e.g:

```bash
npx okai init Table
```

This will generate an empty `MyApp.ServiceModel/<Table>.d.ts` file along with stub AutoQuery APIs and DB Migration implementations. 

#### Regenerate AutoQuery APIs and DB Migrations

After modifying the TypeScript Data Model to include the desired fields, re-run the `okai` tool to re-generate the AutoQuery APIs and DB Migrations:

```bash
npx okai Table.d.ts
```

> Command can be run anywhere within your Solution

After you're happy with your Data Model you can run DB Migrations to run the DB Migration and create your RDBMS Table:

```bash
npm run migrate
```

#### Making changes after first migration

If you want to make further changes to your Data Model, you can re-run the `okai` tool to update the AutoQuery APIs and DB Migrations, then run the `rerun:last` npm script to drop and re-run the last migration:

```bash
npm run rerun:last
```

#### Removing a Data Model and all generated code

If you changed your mind and want to get rid of the RDBMS Table you can revert the last migration:

```bash
npm run revert:last
```

Which will drop the table and then you can get rid of the AutoQuery APIs, DB Migrations and TypeScript Data model with:

```bash
npx okai rm Transaction.d.ts
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