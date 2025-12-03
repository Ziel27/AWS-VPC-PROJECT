# AWS VPC Training Project - MERN Stack

A full-stack MERN (MongoDB Atlas, Express, React, Node.js) application designed for **AWS VPC (Virtual Private Cloud) training**. This project demonstrates real-world AWS networking concepts including public/private subnets, NAT gateways, bastion hosts, reverse-proxy frontends, and internet gateways.

DIAGRAM
(VPC-DIAGRAM.JPG)

## 🎯 Project Purpose

This project is specifically designed for **AWS VPC training** to help understand:
- Public and private subnet configurations
- NAT Gateway implementation for outbound internet access from private subnets
- Reverse proxy setup using Nginx on the frontend server
- Bastion host pattern for securely administering private instances
- Internet Gateway connectivity
- Backend isolation while consuming **MongoDB Atlas**
- Network security best practices

## 🌐 AWS VPC Architecture

### Network Topology

```
Internet Gateway
    │
    └─── Public Subnet 1a (us-east-1a)
         ├─── Frontend EC2 (React/Vite + Nginx Reverse Proxy)
         │       └── HTTPS: https://vpcproject.giandazielpon.online
         ├─── Bastion Host EC2 (SSH jump host)
         └─── NAT Gateway → provides egress for private subnet
                 │
                 └─── Private Subnet 1a (us-east-1a)
                      └─── Backend Server (Node.js/Express) - IP: 10.0.2.235:5000
                           └─── Connects securely to MongoDB Atlas (cloud)
```

### Component Details

#### **Public Subnet 1a**
- **Frontend EC2 Instance**
  - Hosts the React + Vite build (static files)
  - Runs Nginx to terminate HTTPS and reverse-proxy `/api/*` to the backend
  - Entry point for all internet traffic
- **Bastion Host EC2**
  - Dedicated SSH jump box
  - The only instance allowed to SSH into the private subnet
  - Accessible from trusted IPs via port 22
- **NAT Gateway**
  - Allows private subnet instances to make outbound requests (e.g., npm install, OS updates, MongoDB Atlas)
- **Route Table**
  - `0.0.0.0/0` → Internet Gateway

#### **Private Subnet 1a**
- **Backend Server**
  - Node.js/Express API
  - Listens on port 5000 (private IP only)
  - Consumes MongoDB Atlas over the internet through the NAT gateway
- **No Database in VPC**
  - MongoDB Atlas handles persistence; no self-managed MongoDB inside the VPC
- **Route Table**
  - `0.0.0.0/0` → NAT Gateway (in Public Subnet 1a)
- **Security**
  - No public IP
  - SSH access only via bastion host

### Network Flow

1. **User Request Flow (Frontend)**
   ```
   Internet → Internet Gateway → Public Subnet 1a → Frontend EC2 (Nginx)
   → Serves React App (Static Files)
   ```

2. **API Request Flow (Reverse Proxy)**
   ```
   Internet → Internet Gateway → Public Subnet 1a → Frontend EC2 (Nginx)
   → Forwards /api/* requests → Private Subnet 1a → Backend (10.0.2.235:5000)
   → Backend → MongoDB Atlas (via NAT)
   ```

3. **Backend Outbound**
   ```
   Backend (Private Subnet 1a) → NAT Gateway (Public Subnet 1a)
   → Internet Gateway → MongoDB Atlas / Public Internet
   ```

### Access Pattern

- **Frontend**: `https://vpcproject.giandazielpon.online/`
- **API**: `https://vpcproject.giandazielpon.online/api/...` (proxied by Nginx)
- **Backend**: Accessible only through the frontend proxy or via SSH port-forwarding after jumping through the bastion host

### SSH Administration

```
Local Machine
   │
   └── SSH → Bastion Host (Public Subnet 1a, port 22)
            │
            └── SSH → Backend EC2 (Private Subnet 1a, port 22)
```

Sample SSH command using ProxyJump:

```bash
ssh -J ubuntu@<bastion-public-ip> ubuntu@10.0.2.235
```

## 🚀 Features

- **AWS VPC Training**: Realistic enterprise-style topology
- **Reverse Proxy Architecture**: Frontend proxies API traffic over HTTPS
- **Bastion Host Access**: Secure SSH entry into private subnet
- **MongoDB Atlas Integration**: Managed database service, no database servers in VPC
- **Security Best Practices**: Private backend, restricted SSH, TLS termination
- **NAT Gateway**: Safe outbound access for private resources

## 📁 Project Structure

```
aws-vpc-project/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # Mongoose models for MongoDB Atlas
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
- EC2 instances for:
  - Frontend / Reverse Proxy
  - Bastion Host
  - Backend (private subnet)
- MongoDB Atlas cluster (e.g., M0/M10)
- Domain name + SSL certificate (Let's Encrypt or ACM)

### AWS Infrastructure Components

#### 1. VPC Configuration
- CIDR example: `10.0.0.0/16`
- DNS hostnames and DNS resolution enabled

#### 2. Internet Gateway
- Attached to the VPC to serve public subnets

#### 3. Public Subnet 1a (e.g., `10.0.1.0/24`)
- **Resources**
  - Frontend EC2 (public IP) with Nginx + React build
  - Bastion Host EC2 (public IP) for SSH tunneling
  - NAT Gateway (Elastic IP) for egress
- **Route Table**
  - `0.0.0.0/0` → Internet Gateway

#### 4. Private Subnet 1a (e.g., `10.0.2.0/24`)
- **Resources**
  - Backend EC2 instance (no public IP)
- **Route Table**
  - `0.0.0.0/0` → NAT Gateway (Public Subnet 1a)

#### 5. Security Groups

- **Frontend Security Group**
  - Inbound: HTTP (80), HTTPS (443), SSH (22 from trusted IPs)
  - Outbound: All traffic (needs to reach backend + MongoDB Atlas)

- **Bastion Security Group**
  - Inbound: SSH (22) from trusted IPs
  - Outbound: SSH (22) to backend security group

- **Backend Security Group**
  - Inbound: Port 5000 + SSH from Bastion and Frontend security groups only
  - Outbound: All traffic (for NAT egress to MongoDB Atlas)

- **MongoDB Atlas Access List**
  - Add NAT gateway public IP (or AWS VPC CIDR) to the Atlas IP Access List

## 🚀 Application Setup

### Backend Setup (Private Subnet 1a via Bastion)

1. SSH into backend using bastion:
   ```bash
   ssh -J ubuntu@<bastion-public-ip> ubuntu@10.0.2.235
   ```

2. Navigate to `server/` and install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/aws-vpc
   NODE_ENV=production
   ```

4. Start backend (or use PM2):
   ```bash
   npm start
   # or
   pm2 start server.js --name aws-vpc-backend
   ```

### Frontend Setup (Public Subnet 1a)

1. SSH into frontend instance:
   ```bash
   ssh ubuntu@<frontend-public-ip>
   ```

2. Install Nginx + dependencies, build Vite app, configure reverse proxy (same steps as previous section, but ensure proxy upstream target remains `http://10.0.2.235:5000`).

3. `.env` for Vite (optional but recommended):
   ```env
   VITE_API_URL=https://vpcproject.giandazielpon.online/api
   ```

4. Deploy build artifacts to `/var/www/vpcproject` (or preferred path) and reload Nginx.

### Bastion Host Setup

1. Harden security group to only allow SSH from trusted IPs.
2. Disable password authentication (`PasswordAuthentication no` in `/etc/ssh/sshd_config`).
3. Use SSH agent forwarding or AWS Systems Manager Session Manager if preferred.

## 🔌 API Endpoints

All API endpoints go through the frontend proxy:

- `GET https://vpcproject.giandazielpon.online/api/vpcs`
- `GET https://vpcproject.giandazielpon.online/api/vpcs/:id`
- `POST https://vpcproject.giandazielpon.online/api/vpcs`
- `PUT https://vpcproject.giandazielpon.online/api/vpcs/:id`
- `DELETE https://vpcproject.giandazielpon.online/api/vpcs/:id`
- `GET https://vpcproject.giandazielpon.online/health`

## 📝 VPC Model (MongoDB Atlas)

```javascript
{
  name: String (required),
  cidrBlock: String (required),
  region: String (required),
  status: { type: String, enum: ['pending', 'available', 'deleting'], default: 'pending' },
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Technologies Used

- **Frontend**: React, Vite, Axios, CSS3, Nginx
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (managed cluster)
- **AWS Services**: VPC, EC2, NAT Gateway, Internet Gateway, Route Tables
- **Security**: Bastion host, security groups, HTTPS, reverse proxy

## 🔒 Security Considerations

1. **Bastion Host**: Single controlled entry for SSH into private subnet
2. **No Public DB**: Database is managed via MongoDB Atlas with IP allow lists
3. **Reverse Proxy**: Frontend terminates TLS and enforces consistent access path
4. **Least Privilege SGs**: Only required ports opened between components
5. **NAT Gateway**: Backend outbound-only internet access
6. **Secrets Management**: MongoDB credentials stored in backend `.env` (consider AWS Secrets Manager)

## ⚠️ Architecture Pros & Cons

**Pros**
- ✅ Backend hidden in private subnet
- ✅ MongoDB Atlas reduces ops overhead
- ✅ Bastion host keeps SSH access secure
- ✅ HTTPS front door via Nginx
- ✅ No load balancer cost

**Cons**
- ⚠️ Backend cannot be tested directly without bastion/forwarding
- ⚠️ Frontend is a single point of failure
- ⚠️ Manual scaling (no ALB/ASG)

## 📊 Network Diagram Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Gateway                     │
└─────────────────────────────────────────────────────────┘
                          │
               ┌──────────┴──────────┐
               │   Public Subnet 1a  │
               │   • Frontend EC2    │
               │   • Nginx Reverse   │
               │   • Bastion Host    │
               │   • NAT Gateway     │
               └──────────┬──────────┘
                          │
                          │ (Private link only)
                          │
               ┌──────────▼──────────┐
               │  Private Subnet 1a  │
               │  • Backend EC2      │
               │  • Express API      │
               └──────────┬──────────┘
                          │
                          │ (Outbound via NAT)
                          │
                 ┌────────▼────────┐
                 │  MongoDB Atlas  │
                 │  (Managed DB)   │
                 └─────────────────┘
```

## 🐛 Troubleshooting

- **Cannot SSH to backend**  
  - Ensure you're connecting through the bastion host with `ssh -J` or ProxyCommand  
  - Confirm backend security group allows SSH from bastion security group

- **Frontend cannot reach backend API**  
  - Verify backend is running on port 5000 and reachable from frontend instance (`curl http://10.0.2.235:5000/health`)  
  - Check Nginx proxy_pass target matches backend private IP  
  - Ensure backend security group allows traffic from frontend SG

- **MongoDB Atlas connection failures**  
  - Add the NAT Gateway public IP (or 0.0.0.0/0 temporarily) to the Atlas IP Access List  
  - Verify `MONGODB_URI` string is correct and uses `mongodb+srv://` format

- **SSL/HTTPS issues**  
  - Run `sudo nginx -t` to validate config  
  - Renew Let's Encrypt certs with `sudo certbot renew`

- **API unavailable from local machine**  
  - All access must go through `https://vpcproject.giandazielpon.online/api/...` because the backend has no public IP

## 📚 AWS VPC Training Concepts Demonstrated

1. ✅ **Public vs Private Subnets** – Split front/back concerns
2. ✅ **Bastion Host Pattern** – Secure SSH access
3. ✅ **Reverse Proxy Frontend** – Central HTTPS entry point
4. ✅ **NAT Gateway Usage** – Outbound-only private subnet
5. ✅ **Managed Database (Atlas)** – Hybrid cloud connectivity
6. ✅ **Security Groups & Routing** – Principle of least privilege
7. ✅ **TLS Termination** – Encryption in transit

## 📄 License

ISC
