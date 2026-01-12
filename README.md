# IAM SE Enablement 2026 - B2C Workshop

This repository contains the code for the IAM SE Enablement 2026 workshop focused on B2C scenarios using [WSO2 Identity Server](https://wso2.com/identity-server/).

## Try Out

### Setup the Repository

1. Fork https://github.com/brionmario/iam-se-enablement-2026.git

2. Install Dependencies

```bash
npm install
```

3. Build the repository

```bash
npm run build
```

### Setup Pizza Shack

```bash
cd apps/pizza-shack
cp .env.example .env
```

Update the `VITE_ASGARDEO_CLIENT_ID` placeholder with the client ID obtained from the application created in the guide.

```bash
npm run dev
```

The application will start to run on [http://localhost:5173](http://localhost:5173)

### Setup Unity Rewards

```bash
cd apps/unity-rewards
cp .env.example .env
```

Update the `VITE_ASGARDEO_CLIENT_ID` placeholder with the client ID obtained from the application created in the guide.

```bash
npm run dev
```

The application will start to run on [http://localhost:5174](http://localhost:5174)

### Setup Pizza Shack Delivery Hub

```bash
cd apps/pizza-shack-delivery-hub
cp .env.example .env
```

Update the `VITE_ASGARDEO_CLIENT_ID` placeholder with the client ID obtained from the application created in the guide.

```bash
npm run dev
```

The application will start to run on [http://localhost:5175](http://localhost:5175)

### Setup Pizza Shack API

```bash
cd apps/pizza-shack-api
cp .env.example .env
```

```bash
npm run dev
```

The API will start to run on [http://localhost:3000](http://localhost:3000)
