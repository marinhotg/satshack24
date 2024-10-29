# Private Bills

### Central problem
There's a growing community of Bitcoin-first users who prefer to hold and use only Bitcoin, but still face the reality of needing to pay bills in fiat currency (rent, utilities, etc.). At the same time, there are people wanting to acquire Bitcoin in a P2P way, avoiding centralized exchanges and complex KYC processes. 

Currently, these two groups can't easily help each other: Bitcoin holders can't easily pay their bills without first converting to fiat, while potential Bitcoin buyers lack simple ways to acquire it while earning additional rewards.

### Project Overview
Private Bills is a platform that connects these two groups in a practical way: Bitcoin holders can upload their bills to be paid in fiat, while those wanting to acquire Bitcoin can pay these bills and receive satoshis via Lightning Network plus a bonus incentive set by the bill owner. 

The platform features a reputation system for trust, and flexible bonus rates set by bill owners. This creates a win-win solution where Bitcoin holders can maintain their Bitcoin-only lifestyle while paying necessary bills, and payers can acquire Bitcoin directly while earning extra rewards for their service.

### Project Flow
#### Core Flow
1. **Bill Upload**
   - User has a bill to pay but only holds Bitcoin
   - Uploads bill (PIX or Boleto) to the platform
   - Sets a bonus rate to incentivize quick payment

2. **Bill Selection**
   - Another user who wants to acquire Bitcoin sees the bill
   - User selects the bill to pay
   - Bill is automatically reserved for 30 minutes
   - If not paid within this time, bill becomes available again

3. **Payment Process**
   - Selecting user pays the bill using fiat currency
   - Uploads payment proof to the platform
   - Bill owner can verify payment in their bank app

4. **Bitcoin Transfer**
   - Once payment is confirmed
   - Bill owner sends Bitcoin (+ bonus) via Lightning Network
   - Transaction is completed instantly

#### Key Features
- Quick 30-minute reservation system
- Reputation system for trust building
- Instant Lightning Network settlements
- Flexible bonus rates
- Payment proof verification
- Simple P2P interaction

### Technologies Used
- #### Next.js
    - **Version**: 15.0.1
    - **Description**: A powerful React framework for building server-rendered and statically generated applications.

- #### React
    - **Version**: 19.0.0-rc
    - **Description**: A JavaScript library for building user interfaces. React allows developers to create reusable UI components and manage the application state efficiently.

- #### Vercel 
    - **Description**: Platform for deploying and hosting Next.js applications.

- #### Prisma
    - **Version**: 5.21.1
    - **Description**: An Object-Relational Mapping (ORM) tool that simplifies database access and management. It allows for type-safe database queries and schema migrations.

- #### Lightspark SDK
    - **Version**: 1.8.8
    - **Description**: A software development kit for integrating Lightspark's cryptocurrency payment solutions into the application.

- #### QR Code Generator
    - **Description**: A JavaScript library for generating QR codes from strings. Enabling users to create invoices for payments using the Lightning Network protocol

- #### Bitcoin price API
    - **Description**: A free and open-source API that provides real-time Bitcoin price data.
    - **Link**: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd

### Deployment Link
[Private Bills](https://satshack24.vercel.app/)

### Installation and Local Execution

1. Clone this repository:
    ```bash
    git clone https://github.com/marinhotg/satshack24.git
    cd satshack24/
    ```
2. Install dependencies
    ```bash
    npm install

    npx prisma migrate deploy

    npx prisma db push

    npx prisma generate
    ```
3. Add your database in **.env** file like this in **.env.example**

4. Start the server locally
   ```bash
   npm run dev
   ```
5. Access http://localhost:3000