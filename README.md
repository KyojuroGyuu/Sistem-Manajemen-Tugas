# Sistem Manajemen Tugas

## Deskripsi Proyek

Sistem Manajemen Tugas merupakan aplikasi backend berbasis RESTful API
yang dirancang untuk mengelola distribusi dan penyelesaian tugas antara
Admin dan User. Sistem ini mendukung autentikasi berbasis JSON Web Token
(JWT), kontrol akses berbasis peran (Role-Based Access Control), serta
manajemen relasi tugas dengan pengguna.

Aplikasi dikembangkan menggunakan Node.js dan Express.js dengan Prisma
ORM sebagai penghubung ke database MySQL.

------------------------------------------------------------------------

## Tujuan Pengembangan

Proyek ini dibuat untuk:

-   Menerapkan arsitektur RESTful API
-   Mengimplementasikan sistem autentikasi dan otorisasi
-   Mengelola relasi data menggunakan Prisma ORM
-   Menerapkan validasi input dan pengamanan data
-   Mengelola upload file pada server backend

------------------------------------------------------------------------

## Teknologi yang Digunakan

-   Node.js\
-   Express.js\
-   Prisma ORM\
-   MySQL\
-   JSON Web Token (JWT)\
-   bcrypt\
-   Joi (validasi input)\
-   Multer (upload file)\
-   Nodemon

------------------------------------------------------------------------

## Struktur Direktori

    SistemManajemenTugas/
    │
    ├── src/
    │   ├── index.js
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   ├── prisma/
    │   └── utils/
    │
    ├── prisma.config.ts
    ├── package.json
    └── .env

------------------------------------------------------------------------

## Skema Basis Data

### User

-   id (Primary Key)
-   fullname
-   username (Unique)
-   email (Unique)
-   password (Hashed)
-   role (ADMIN / USER)
-   createdAt

### Task

-   id (Primary Key)
-   title
-   description
-   createdBy (Relasi ke User)

### UserTask

-   id (Primary Key)
-   userId (Foreign Key)
-   taskId (Foreign Key)
-   isCompleted (Boolean)
-   response
-   file

------------------------------------------------------------------------

## Instalasi dan Konfigurasi

### 1. Clone Repository

``` bash
git clone <repository-url>
cd SistemManajemenTugas
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env`:

    DATABASE_URL="mysql://USER:PASSWORD@localhost:port/nama_database"
    DATABASE_USER="user"
    DATABASE_PASSWORD="password"
    DATABASE_NAME="nama_database"
    DATABASE_HOST="localhost"
    DATABASE_PORT=port_number
    JWT_SECRET="your_secret_key"
    PORT=3000

### 4. Setup Database

``` bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Menjalankan Aplikasi

``` bash
npm run dev
```

Server akan berjalan pada:

    http://localhost:3000

------------------------------------------------------------------------

## Mekanisme Autentikasi

Gunakan header berikut untuk endpoint yang membutuhkan autentikasi:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## Hak Akses

### Admin

-   Membuat tugas
-   Menugaskan tugas
-   Melihat seluruh data

### User

-   Melihat tugas yang diberikan
-   Mengirim jawaban
-   Upload file
-   Menandai tugas selesai

------------------------------------------------------------------------