# AWS VPC Training Project - MERN Stack

A full-stack MERN (MongoDB, Express, React, Node.js) application designed for **AWS VPC (Virtual Private Cloud) training**. This project demonstrates real-world AWS networking concepts including public/private subnets, NAT gateways, load balancers, and internet gateways.

## 🎯 Project Purpose

This project is specifically designed for **AWS VPC training** to help understand:
- Public and private subnet configurations
- NAT Gateway implementation for outbound internet access from private subnets
- Application Load Balancer setup and routing
- Internet Gateway connectivity
- Multi-AZ (Availability Zone) architecture
- Network security best practices

## 🌐 AWS VPC Architecture

### Network Topology

```
Internet Gateway
    │
    ├─── Public Subnet 1a (us-east-1a)
    │    ├─── Frontend (React/Vite) - Direct Internet Access
    │    └─── NAT Gateway - For Private Subnet Outbound Access
    │
    ├─── Public Subnet 1b (us-east-1b)
    │    └─── Application Load Balancer - Routes to Private Subnet
    │
    └─── Private Subnet 1a (us-east-1a)
         └─── Backend Server (Node.js/Express) - No Direct Internet Access
              └─── MongoDB Database
```

### Component Details

#### **Public Subnet 1a**
- **Frontend Application**: React + Vite application running on EC2 instance
- **NAT Gateway**: Provides outbound internet connectivity for resources in Private Subnet 1a
- **Route Table**: Routes `0.0.0.0/0` → Internet Gateway

#### **Public Subnet 1b**
- **Application Load Balancer (ALB)**: 
  - Receives traffic from the internet
  - Routes requests to backend server in Private Subnet 1a
  - Provides high availability and load distribution
- **Route Table**: Routes `0.0.0.0/0` → Internet Gateway

#### **Private Subnet 1a**
- **Backend Server**: Node.js/Express API server running on EC2 instance
- **MongoDB Database**: Database instance (can be on same instance or separate)
- **Route Table**: Routes `0.0.0.0/0` → NAT Gateway (in Public Subnet 1a)
- **Security**: No direct internet access, only outbound through NAT Gateway

### Network Flow

1. **User Request Flow**:
   ```
   Internet → Internet Gateway → Public Subnet 1a → Frontend (React App)
   ```

2. **Frontend to Backend**:
   ```
   Frontend (Public Subnet 1a) → Application Load Balancer (Public Subnet 1b) 
   → Backend Server (Private Subnet 1a)
   ```

3. **Backend Outbound**:
   ```
   Backend (Private Subnet 1a) → NAT Gateway (Public Subnet 1a) 
   → Internet Gateway → Internet
   ```

## 🚀 Features

- **AWS VPC Training**: Hands-on experience with AWS networking
- **Multi-AZ Architecture**: High availability across availability zones
- **Security Best Practices**: Private subnet for backend, public for frontend
- **Load Balancing**: Application Load Balancer for traffic distribution
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
- EC2 instances or ECS/Fargate for running containers
- VPC with the following components:
  - Internet Gateway
  - Public Subnet 1a (with NAT Gateway)
  - Public Subnet 1b (for Load Balancer)
  - Private Subnet 1a (for Backend)
  - Route tables configured correctly
  - Security Groups configured

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
  - Frontend EC2 instance
  - NAT Gateway (Elastic IP required)

#### 4. Public Subnet 1b
- **CIDR**: `10.0.2.0/24` (example)
- **Route Table**: 
  - `10.0.0.0/16` → Local
  - `0.0.0.0/0` → Internet Gateway
- **Resources**:
  - Application Load Balancer

#### 5. Private Subnet 1a
- **CIDR**: `10.0.3.0/24` (example)
- **Route Table**: 
  - `10.0.0.0/16` → Local
  - `0.0.0.0/0` → NAT Gateway (in Public Subnet 1a)
- **Resources**:
  - Backend EC2 instance
  - MongoDB instance (or use MongoDB Atlas)

#### 6. Security Groups

**Frontend Security Group (Public Subnet 1a)**:
- Inbound: HTTP (80), HTTPS (443) from Internet
- Outbound: All traffic

**Backend Security Group (Private Subnet 1a)**:
- Inbound: Port 5000 from Load Balancer Security Group
- Outbound: All traffic (through NAT Gateway)

**Load Balancer Security Group (Public Subnet 1b)**:
- Inbound: HTTP (80), HTTPS (443) from Internet
- Outbound: Port 5000 to Backend Security Group

**NAT Gateway Security Group**:
- Allow outbound traffic from Private Subnet

#### 7. Application Load Balancer
- Type: Application Load Balancer
- Subnets: Public Subnet 1b
- Target Group: Backend server in Private Subnet 1a (Port 5000)
- Health Check: `/health` endpoint

## 🚀 Application Setup

### Backend Setup (Private Subnet 1a)

1. SSH into your backend EC2 instance in Private Subnet 1a

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
   ```

### Frontend Setup (Public Subnet 1a)

1. SSH into your frontend EC2 instance in Public Subnet 1a

2. Clone and navigate to client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```
   VITE_API_URL=http://your-load-balancer-dns-name/api
   ```

5. Build the production version:
   ```bash
   npm run build
   ```

6. Serve the built files using a web server (nginx, Apache, or serve):
   ```bash
   # Using serve
   npm install -g serve
   serve -s dist -l 80
   ```

   Or configure nginx:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/client/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 🔌 API Endpoints

- `GET /api/vpcs` - Get all VPCs
- `GET /api/vpcs/:id` - Get a single VPC by ID
- `POST /api/vpcs` - Create a new VPC
- `PUT /api/vpcs/:id` - Update a VPC
- `DELETE /api/vpcs/:id` - Delete a VPC
- `GET /health` - Health check endpoint (used by Load Balancer)

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
- **AWS Services**: VPC, EC2, ALB, NAT Gateway, Internet Gateway
- **Other**: CORS, dotenv

## 🔒 Security Considerations

1. **Private Subnet**: Backend server has no direct internet access, reducing attack surface
2. **Security Groups**: Restrictive rules allowing only necessary traffic
3. **NAT Gateway**: Provides secure outbound access without exposing inbound ports
4. **Load Balancer**: Acts as a single entry point, can add SSL/TLS termination
5. **No Public IP**: Backend instances should not have public IP addresses

## 📊 Network Diagram Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Gateway                      │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼────────┐                ┌─────────▼──────────┐
│ Public Subnet  │                │  Public Subnet     │
│     1a         │                │      1b            │
│                │                │                    │
│ • Frontend     │                │ • Load Balancer    │
│ • NAT Gateway  │                │                    │
└───────┬────────┘                └─────────┬──────────┘
        │                                   │
        │                                   │
        └───────────┬───────────────────────┘
                    │
            ┌───────▼────────┐
            │ Private Subnet │
            │      1a         │
            │                │
            │ • Backend      │
            │ • MongoDB      │
            └────────────────┘
```

## 🐛 Troubleshooting

- **Backend can't reach internet**: Check NAT Gateway route in Private Subnet route table
- **Frontend can't reach backend**: Verify Load Balancer target group health and security groups
- **Load Balancer health checks failing**: Ensure `/health` endpoint is accessible and security groups allow traffic
- **MongoDB Connection Error**: Verify MongoDB is accessible from Private Subnet (or use MongoDB Atlas)
- **CORS Errors**: Ensure backend CORS configuration allows requests from frontend domain

## 📚 AWS VPC Training Concepts Demonstrated

1. ✅ **Public vs Private Subnets**: Frontend in public, backend in private
2. ✅ **NAT Gateway**: Enables outbound internet access from private subnet
3. ✅ **Internet Gateway**: Provides internet connectivity to public subnets
4. ✅ **Application Load Balancer**: Distributes traffic and provides high availability
5. ✅ **Multi-AZ Architecture**: Load balancer in different AZ for redundancy
6. ✅ **Route Tables**: Proper routing configuration for each subnet
7. ✅ **Security Groups**: Network-level firewall rules
8. ✅ **Network Isolation**: Backend protected in private subnet

## 📄 License

ISC
