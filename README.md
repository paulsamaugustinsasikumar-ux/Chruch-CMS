# Church Management System

A comprehensive full-stack web application for managing church families, divisions, and members with professional UI/UX, secure authentication, and advanced export features.

## Features

### Core Functionality
- **Secure Authentication**: JWT-based login system with hashed passwords
- **Family Management**: Complete family records with dynamic member addition
- **Division Management**: Organize families by divisions with leader assignment
- **Youth Management**: Separate module for youth/bachelor members
- **Quick Entry**: Streamlined forms for rapid data entry

### Advanced Features
- **QR Code Generation**: Generate QR codes for divisions, families, and youth groups
- **Multi-format Export**: Export data as PDF, Excel, and Word documents
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface
- **Professional UI**: Clean, modern design with intuitive navigation

### Technical Stack
- **Frontend**: React.js with modern hooks and responsive design
- **Backend**: Node.js with Express.js
- **Database**: MySQL with normalized relational schema
- **Authentication**: JWT with bcrypt password hashing
- **File Export**: PDFKit, ExcelJS, and Docx libraries

## Project Structure

```
church-management-system/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── initDb.js           # Database initialization
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── errorHandler.js     # Error handling middleware
│   ├── models/                 # Database models (future enhancement)
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── dashboard.js        # Dashboard stats
│   │   ├── divisions.js        # Division management
│   │   ├── families.js         # Family management
│   │   ├── youth.js            # Youth management
│   │   ├── export.js           # Export functionality
│   │   └── qrcode.js           # QR code generation
│   ├── utils/
│   │   ├── qrCode.js           # QR code utilities
│   │   ├── pdfExport.js        # PDF export utilities
│   │   ├── excelExport.js      # Excel export utilities
│   │   └── wordExport.js       # Word export utilities
│   ├── server.js               # Main server file
│   ├── package.json
│   └── .env                    # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js       # Main layout component
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Dashboard.js    # Dashboard with stats
│   │   │   ├── Families.js     # Family management
│   │   │   ├── Divisions.js    # Division management
│   │   │   ├── Youth.js        # Youth management
│   │   │   └── QuickEntry.js   # Quick entry forms
│   │   ├── utils/
│   │   │   └── api.js          # API configuration
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   └── package.json
└── README.md
```

## Database Schema

### Tables

#### users
- id (Primary Key)
- username (Unique)
- password (Hashed)
- email
- role (admin/superadmin)
- created_at, updated_at

#### divisions
- id (Primary Key)
- division_name
- leader_name
- description
- created_at, updated_at

#### families
- id (Primary Key)
- name_english, name_tamil
- phone_number
- full_address
- aadhaar_number
- native_place
- baptism_date, baptized_by
- marriage_date, married_by
- division_id (Foreign Key)
- division_leader_name
- created_at, updated_at

#### family_members
- id (Primary Key)
- family_id (Foreign Key)
- relationship
- name_english, name_tamil
- phone_number
- gender, date_of_birth
- created_at, updated_at

#### youth_members
- id (Primary Key)
- name_english, name_tamil
- phone_number
- division_id (Foreign Key)
- gender, date_of_birth
- occupation, address
- created_at, updated_at

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd church-management-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=24h
```

4. Ensure MySQL is running and accessible with the provided credentials.

5. Start the backend server:
```bash
npm start
```

The server will automatically create tables and insert a default admin user if the database connection is successful. If database connection fails, the server will still start and log appropriate error messages.

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd church-management-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Default Login Credentials

- **Username**: HJChosur
- **Password**: HJC@007

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/change-password` - Change password

### Dashboard
- `GET /api/dashboard` - Get statistics

### Divisions
- `GET /api/divisions` - Get all divisions
- `POST /api/divisions` - Create division
- `PUT /api/divisions/:id` - Update division
- `DELETE /api/divisions/:id` - Delete division

### Families
- `GET /api/families` - Get all families (with search/filter)
- `GET /api/families/:id` - Get family by ID
- `POST /api/families` - Create family
- `PUT /api/families/:id` - Update family
- `DELETE /api/families/:id` - Delete family

### Youth Members
- `GET /api/youth` - Get all youth members
- `POST /api/youth` - Create youth member
- `PUT /api/youth/:id` - Update youth member
- `DELETE /api/youth/:id` - Delete youth member

### Export
- `GET /api/export/family/:id/:format` - Export family (pdf/excel/word)
- `GET /api/export/division/:id/:format` - Export division (pdf/excel/word)
- `GET /api/export/youth/excel` - Export all youth
- `GET /api/export/all-families/excel` - Export all families

### QR Code
- `GET /api/qrcode/family/:id` - Generate family QR
- `GET /api/qrcode/division/:id` - Generate division QR
- `GET /api/qrcode/youth` - Generate youth group QR

## Health Check

- `GET /` - Simple health check returning "API Running"
- `GET /api/health` - Detailed health check with timestamp

## 🏗️ **SINGLE APPLICATION ARCHITECTURE**

### **How It Works**
```
🌐 Frontend (Netlify) ←→ 🔧 Backend (Railway) ←→ 🗄️ Database (Railway MySQL)
```

**ONE Application** handles everything:
- ✅ **Single Frontend**: React app on Netlify
- ✅ **Single Backend**: Node.js API on Railway
- ✅ **Single Database**: MySQL on Railway
- ✅ **Role-Based Access**: Admin vs Division Leaders

### **User Types & Access**
- **Super Admin**: Full CRUD access to all data
- **Division Leaders**: View-only access to their division data
- **No Separate Hosting**: Everything in one system!

### **Login Flow**
1. User visits `/login`
2. Selects "Admin Login" or "Division Login"
3. Enters credentials
4. **Automatic Redirect** based on role:
   - Admin → `/admin-dashboard`
   - Division Leader → `/division-dashboard`

### **Security & Access Control**
- **JWT Authentication** with role-based tokens
- **Division Filtering**: `WHERE division_id = user.division_id`
- **View-Only**: Division leaders cannot edit/delete
- **Secure API**: Protected routes with middleware

## 🚀 **DEPLOYMENT: SEPARATE PORTALS**

### **Architecture Overview**
```
🌐 Netlify (Frontend) ←→ 🔧 Railway (Backend + Database)
```

**TWO SEPARATE PORTALS - ONE APPLICATION!**

### **Portal URLs**
- **Admin Portal**: `https://your-netlify-site.netlify.app/admin/login`
- **Division Portal**: `https://your-netlify-site.netlify.app/division/login`

### **Step 1: Railway Backend + Database**

1. **Deploy Backend**: Connect GitHub repo to Railway
2. **Add MySQL Database**: Attach to your Railway project
3. **Set Environment Variables**:
   ```
   DB_HOST=${{MYSQLHOST}}
   DB_USER=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   DB_NAME=${{MYSQLDATABASE}}
   JWT_SECRET=your_super_secure_random_string_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   ```
4. **Get Backend URL**: `https://your-project.up.railway.app`

### **Step 2: Netlify Frontend**

1. **Deploy Frontend**: Connect GitHub repo to Netlify
2. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-backend.up.railway.app
   ```

### **Step 3: How Separate Portals Work**

#### **Admin Portal (/admin)**
- **Login**: `/admin/login` → Admin credentials only
- **Dashboard**: Full CRUD access to all data
- **Features**: Add/Edit/Delete Families, Members, Divisions, Youth
- **Access**: Complete church management

#### **Division Portal (/division)**
- **Login**: `/division/login` → Division leader credentials only
- **Dashboard**: View-only access to their division data
- **Features**: View Families, Members, Youth (Male/Female separate)
- **Access**: Filtered by `division_id`

#### **Data Filtering**
```sql
-- Admin sees everything
SELECT * FROM families

-- Division leader sees only their division
SELECT * FROM families WHERE division_id = loggedInUser.divisionId
```

### **Authentication Flow**

#### **Admin Login**
```
POST /api/admin/auth/login
→ JWT Token with role: 'admin', divisionId: null
→ Redirect to /admin/dashboard
```

#### **Division Login**
```
POST /api/division/auth/login
→ JWT Token with role: 'division_leader', divisionId: X
→ Redirect to /division/dashboard
```

### **API Endpoints Structure**

#### **Admin APIs** (Full Access)
- `/api/admin/auth/login`
- `/api/admin/dashboard`
- `/api/admin/families` (CRUD)
- `/api/admin/divisions` (CRUD)
- `/api/admin/youth` (CRUD)

#### **Division APIs** (Filtered View)
- `/api/division/auth/login`
- `/api/division/dashboard` (Filtered stats)

### **Security Implementation**
- **JWT Tokens**: Include `role` and `divisionId`
- **Middleware**: `divisionFilter` for data filtering
- **Middleware**: `adminOnly` for write operations
- **Route Protection**: Separate protected routes for each portal

### Adding Families
1. Go to "Families" section
2. Click "Add Family"
3. Fill in family head details (required fields marked with *)
4. Add family members using the "+" button
5. Save the family

### Managing Divisions
1. Go to "Divisions" section
2. Add divisions with name and leader
3. Assign families to divisions during family creation

### Quick Entry
1. Use "Quick Entry" for rapid data input
2. Choose between Family or Youth tabs
3. Fill minimal required fields
4. Add additional members if needed

### Exporting Data
1. Go to Families or Divisions sections
2. Use the export buttons (PDF/XLS/DOC) next to each record
3. Files will download automatically

### QR Code Generation
1. QR codes can be generated for divisions and families
2. Use the QR button in the actions column
3. Scan to access formatted information

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection protection
- CORS configuration
- Error handling and logging

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Production Deployment

### Backend Deployment

1. **Environment Setup**:
   - Set secure environment variables in production
   - Use a production MySQL database
   - Configure HTTPS certificates
   - Set up proper logging

2. **Server Deployment**:
   - Use PM2 or similar process manager
   - Configure reverse proxy (nginx/apache)
   - Set up SSL/TLS certificates
   - Configure firewall and security settings

3. **Database Setup**:
   - Create production MySQL database
   - Run database migrations if needed
   - Set up database backups

### Frontend Deployment (Netlify/Vercel/etc.)

1. **Build the Application**:
```bash
cd frontend
npm run build
```

2. **Environment Variables**:
   - Create `.env` file with production API URL:
   ```
   REACT_APP_API_URL=https://your-backend-api-url.com
   ```

3. **Deploy to Netlify**:
   - Connect your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

4. **Deploy to Vercel**:
   - Connect repository to Vercel
   - Vercel will auto-detect React app
   - Add environment variables in Vercel dashboard

### SPA Routing Configuration

The app includes `_redirects` file for Netlify/Vercel to handle client-side routing. For other hosting services, ensure SPA routing is configured:

- **Netlify**: The `_redirects` file handles this automatically
- **Vercel**: No additional configuration needed
- **Apache**: Add `.htaccess`:
  ```
  Options -MultiViews
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.html [QSA,L]
  ```
- **Nginx**: Add to server block:
  ```
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

### CORS Configuration

Update backend CORS settings for production domain:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true
};
```

### Troubleshooting Deployment Issues

1. **404 on refresh**: Ensure SPA routing is configured (check `_redirects` file)
2. **API calls failing**: Verify `REACT_APP_API_URL` environment variable
3. **CORS errors**: Update backend CORS settings for production domain
4. **Build failing**: Ensure all dependencies are installed and Node.js version matches

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.