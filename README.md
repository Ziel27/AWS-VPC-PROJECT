# AWS VPC Training Project - MERN Stack

A full-stack MERN (MongoDB, Express, React, Node.js) application designed for **AWS VPC (Virtual Private Cloud) training**. This project demonstrates real-world AWS networking concepts including public/private subnets, NAT gateways, reverse proxy configuration, and internet gateways.

## 🎯 Project Purpose

This project is specifically designed for **AWS VPC training** to help understand:
- Public and private subnet configurations
- NAT Gateway implementation for outbound internet access from private subnets
- Reverse Proxy setup using Nginx on frontend server
- Internet Gateway connectivity
- Network security best practices
- Backend isolation in private subnet

## 🌐 AWS VPC Architecture

### Network Topology

```
Internet Gateway
    │
    └─── Public Subnet 1a (us-east-1a)
         ├─── Frontend EC2 (React/Vite + Nginx Reverse Proxy)
         │    └─── HTTPS: https://vpcproject.giandazielpon.online
         └─── NAT Gateway - For Private Subnet Outbound Access
              │
              └─── Private Subnet 1a (us-east-1a)
                   └─── Backend Server (Node.js/Express) - IP: 10.0.2.235:5000
                        └─── MongoDB Database
```

### Component Details

#### **Public Subnet 1a**
- **Frontend EC2 Instance**: 
  - React + Vite application (serves static files)
  - Nginx web server configured as reverse proxy
  - Handles HTTPS traffic from internet
  - Forwards API requests to backend in private subnet
- **NAT Gateway**: Provides outbound internet connectivity for resources in Private Subnet 1a
- **Route Table**: Routes `0.0.0.0/0` → Internet Gateway

#### **Private Subnet 1a**
- **Backend Server**: Node.js/Express API server running on EC2 instance
  - **Private IP**: `10.0.2.235`
  - **Port**: `5000`
  - **No Public IP**: Not directly accessible from internet
- **MongoDB Database**: Database instance (can be on same instance or separate)
- **Route Table**: Routes `0.0.0.0/0` → NAT Gateway (in Public Subnet 1a)
- **Security**: No direct internet access, only outbound through NAT Gateway

### Network Flow

1. **User Request Flow (Frontend)**:
   ```
   Internet → Internet Gateway → Public Subnet 1a → Frontend EC2 (Nginx)
   → Serves React App (Static Files)
   ```

2. **API Request Flow (Frontend as Reverse Proxy)**:
   ```
   Internet → Internet Gateway → Public Subnet 1a → Frontend EC2 (Nginx)
   → Forwards /api/* requests → Private Subnet 1a → Backend (10.0.2.235:5000)
   ```

3. **Backend Outbound**:
   ```
   Backend (Private Subnet 1a) → NAT Gateway (Public Subnet 1a) 
   → Internet Gateway → Internet
   ```

### Access Pattern

- **Frontend Access**: `https://vpcproject.giandazielpon.online/`
- **API Access**: `https://vpcproject.giandazielpon.online/api/...`
  - All API requests go through the frontend Nginx reverse proxy
  - Backend is not directly accessible from the internet
  - Backend can only be accessed through the frontend server

## 🚀 Features

- **AWS VPC Training**: Hands-on experience with AWS networking
- **Reverse Proxy Architecture**: Frontend acts as proxy for backend
- **Security Best Practices**: Backend isolated in private subnet
- **HTTPS Support**: Secure communication via SSL/TLS
- **NAT Gateway**: Secure outbound internet access for private resources
- **Full-Stack Application**: MERN stack for complete application development

## 📁 Project Structure

```
aws-vpc-project/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── client/                # Frontend (React + Vite)
│   ├── src/               # React source files
│   ├── index.html         # HTML entry point
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🛠️ AWS Deployment Setup

### Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- EC2 instances for frontend and backend
- VPC with the following components:
  - Internet Gateway
  - Public Subnet 1a (with NAT Gateway)
  - Private Subnet 1a (for Backend)
  - Route tables configured correctly
  - Security Groups configured
- Domain name and SSL certificate (for HTTPS)

### AWS Infrastructure Components

#### 1. VPC Configuration
- Create a VPC with appropriate CIDR block (e.g., `10.0.0.0/16`)
- Enable DNS hostnames and DNS resolution

#### 2. Internet Gateway
- Attach Internet Gateway to VPC
- Allows public subnets to communicate with the internet

#### 3. Public Subnet 1a
- **CIDR**: `10.0.1.0/24` (example)
- **Route Table**: 
  - `10.0.0.0/16` → Local
  - `0.0.0.0/0` → Internet Gateway
- **Resources**:
  - Frontend EC2 instance (with public IP)
  - NAT Gateway (Elastic IP required)

#### 4. Private Subnet 1a
- **CIDR**: `10.0.2.0/24` (example)
- **Route Table**: 
  - `10.0.0.0/16` → Local
  - `0.0.0.0/0` → NAT Gateway (in Public Subnet 1a)
- **Resources**:
  - Backend EC2 instance (no public IP)
  - MongoDB instance (or use MongoDB Atlas)

#### 5. Security Groups

**Frontend Security Group (Public Subnet 1a)**:
- Inbound: 
  - HTTP (80) from Internet
  - HTTPS (443) from Internet
  - SSH (22) from your IP (for management)
- Outbound: 
  - All traffic (to reach backend in private subnet)

**Backend Security Group (Private Subnet 1a)**:
- Inbound: 
  - Port 5000 from Frontend Security Group only
  - SSH (22) from Frontend Security Group (for management)
- Outbound: 
  - All traffic (through NAT Gateway)

**NAT Gateway Security Group**:
- Allow outbound traffic from Private Subnet

## 🚀 Application Setup

### Backend Setup (Private Subnet 1a)

1. SSH into your backend EC2 instance in Private Subnet 1a
   - You'll need to SSH through the frontend instance or use a bastion host

2. Clone and navigate to server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aws-vpc
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aws-vpc
   NODE_ENV=production
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   
   Or use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name aws-vpc-backend
   pm2 save
   pm2 startup
   ```

6. Verify backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

### Frontend Setup (Public Subnet 1a)

1. SSH into your frontend EC2 instance in Public Subnet 1a

2. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

3. Clone and navigate to client directory:
   ```bash
   cd client
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file:
   ```
   VITE_API_URL=https://vpcproject.giandazielpon.online/api
   ```

6. Build the production version:
   ```bash
   npm run build
   ```

7. Configure Nginx as Reverse Proxy:

   Create/edit Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/vpcproject
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name vpcproject.giandazielpon.online;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name vpcproject.giandazielpon.online;

       # SSL Certificate (use Let's Encrypt or your certificate)
       ssl_certificate /etc/letsencrypt/live/vpcproject.giandazielpon.online/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/vpcproject.giandazielpon.online/privkey.pem;

       # SSL Configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       # Frontend - Serve React App
       location / {
           root /path/to/client/dist;
           try_files $uri $uri/ /index.html;
           index index.html;
       }

       # Backend API - Reverse Proxy
       location /api/ {
           proxy_pass http://10.0.2.235:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       # Health check endpoint
       location /health {
           proxy_pass http://10.0.2.235:5000/health;
           proxy_set_header Host $host;
       }
   }
   ```

8. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vpcproject /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

9. Set up SSL Certificate (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d vpcproject.giandazielpon.online
   ```

10. Verify Nginx is running:
    ```bash
    sudo systemctl status nginx
    ```

## 🔌 API Endpoints

All API endpoints are accessed through the frontend reverse proxy:

- `GET https://vpcproject.giandazielpon.online/api/vpcs` - Get all VPCs
- `GET https://vpcproject.giandazielpon.online/api/vpcs/:id` - Get a single VPC by ID
- `POST https://vpcproject.giandazielpon.online/api/vpcs` - Create a new VPC
- `PUT https://vpcproject.giandazielpon.online/api/vpcs/:id` - Update a VPC
- `DELETE https://vpcproject.giandazielpon.online/api/vpcs/:id` - Delete a VPC
- `GET https://vpcproject.giandazielpon.online/health` - Health check endpoint

## 📝 VPC Model

```javascript
{
  name: String (required),
  cidrBlock: String (required, format: IP/CIDR),
  region: String (required),
  status: String (enum: 'pending', 'available', 'deleting'),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Technologies Used

- **Frontend**: React, Vite, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Web Server**: Nginx (Reverse Proxy)
- **AWS Services**: VPC, EC2, NAT Gateway, Internet Gateway
- **Other**: CORS, dotenv, SSL/TLS

## 🔒 Security Considerations

1. **Private Subnet**: Backend server has no direct internet access, reducing attack surface
2. **Security Groups**: Restrictive rules allowing only necessary traffic
   - Backend only accepts connections from frontend security group
3. **NAT Gateway**: Provides secure outbound access without exposing inbound ports
4. **Reverse Proxy**: Frontend acts as single entry point, can add SSL/TLS termination
5. **No Public IP**: Backend instances have no public IP addresses
6. **HTTPS**: All traffic encrypted via SSL/TLS
7. **Network Isolation**: Backend cannot be accessed directly from internet

## ⚠️ Important Notes

### Pros of This Architecture:
- ✅ **No Load Balancer Cost**: Saves on AWS ALB charges
- ✅ **Backend Security**: Backend is not exposed to internet
- ✅ **HTTPS Support**: Secure communication via SSL/TLS
- ✅ **Works from Anywhere**: Accessible from any internet location
- ✅ **Simple Architecture**: Easier to understand and maintain

### Cons of This Architecture:
- ⚠️ **Backend Not Directly Accessible**: Backend cannot be tested directly from local machine
- ⚠️ **Single Point of Entry**: Frontend server is the only entry point
- ⚠️ **No High Availability**: If frontend goes down, entire application is unavailable
- ⚠️ **Testing Limitation**: Must test backend through frontend reverse proxy

### Testing Backend:
- Backend can only be accessed through the frontend at `https://vpcproject.giandazielpon.online/api/...`
- Direct access to `http://10.0.2.235:5000` is only possible from within the VPC
- For local development, you can SSH into frontend and test backend connectivity

## 📊 Network Diagram Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Gateway                      │
└─────────────────────────────────────────────────────────┘
                          │
                          │
                  ┌───────▼────────┐
                  │ Public Subnet  │
                  │     1a         │
                  │                │
                  │ • Frontend EC2 │
                  │   (Nginx)      │
                  │ • NAT Gateway  │
                  └───────┬────────┘
                          │
                          │ (Private IP: 10.0.2.235:5000)
                          │
                  ┌───────▼────────┐
                  │ Private Subnet │
                  │      1a         │
                  │                │
                  │ • Backend      │
                  │   (10.0.2.235) │
                  │ • MongoDB      │
                  └────────────────┘
```

## 🐛 Troubleshooting

- **Backend can't reach internet**: Check NAT Gateway route in Private Subnet route table
- **Frontend can't reach backend**: 
  - Verify backend security group allows traffic from frontend security group
  - Check backend is running on port 5000
  - Verify private IP address (10.0.2.235) is correct
- **Nginx proxy errors**: Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- **SSL Certificate issues**: Verify certificate is valid and paths are correct in Nginx config
- **MongoDB Connection Error**: Verify MongoDB is accessible from Private Subnet (or use MongoDB Atlas)
- **CORS Errors**: Ensure backend CORS configuration allows requests from `https://vpcproject.giandazielpon.online`
- **API requests failing**: Test backend directly from frontend server: `curl http://10.0.2.235:5000/health`

## 📚 AWS VPC Training Concepts Demonstrated

1. ✅ **Public vs Private Subnets**: Frontend in public, backend in private
2. ✅ **NAT Gateway**: Enables outbound internet access from private subnet
3. ✅ **Internet Gateway**: Provides internet connectivity to public subnets
4. ✅ **Reverse Proxy**: Nginx on frontend routes API requests to backend
5. ✅ **Route Tables**: Proper routing configuration for each subnet
6. ✅ **Security Groups**: Network-level firewall rules
7. ✅ **Network Isolation**: Backend protected in private subnet
8. ✅ **HTTPS/SSL**: Secure communication setup

## 📄 License

ISC
