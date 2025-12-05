# Laravel Filament H5x 🚀

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Filament](https://img.shields.io/badge/Filament-FDAE4B?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Demo+GIF+Placeholder" alt="Demo GIF" width="100%">
</p>

**Laravel Filament H5x** is a powerful Learning Management System (LMS) component designed to create and manage interactive learning activities. Inspired by H5P, it leverages the robustness of **Laravel**, the elegance of **Filament Admin**, and the interactivity of **React** (via Inertia.js) to deliver a seamless educational experience.

## ✨ Key Features

-   **Interactive Video Player**: Engage learners with video content that supports interactive elements.
-   **Activity Management**: Easily create, edit, and manage learning activities through a user-friendly admin panel.
-   **Live Preview**: Instantly preview your interactive content as you build it.
-   **Modern Stack**: Built with the latest technologies for performance and scalability.
-   **Dockerized**: Fully containerized environment for consistent development and deployment.

## 🛠️ Tech Stack

-   **Backend**: Laravel 11
-   **Admin Panel**: FilamentPHP v3
-   **Frontend**: React.js with Inertia.js
-   **Styling**: Tailwind CSS
-   **Database**: MySQL (via Docker)
-   **DevOps**: Docker & Docker Compose

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:

-   [Docker](https://www.docker.com/)
-   [Docker Compose](https://docs.docker.com/compose/)
-   Make (optional, but recommended for using the Makefile)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/laravel-filament-h5x.git
    cd laravel-filament-h5x
    ```

2.  **Set up environment variables**
    ```bash
    cp .env.example .env
    ```

3.  **Build and start the containers**
    We use a `Makefile` to simplify common commands.
    ```bash
    make build
    make up
    ```

4.  **Install dependencies**
    ```bash
    make install      # Installs PHP dependencies
    make npm-install  # Installs Node dependencies
    ```

5.  **Setup Database**
    ```bash
    make fresh        # Runs migrations and seeders
    ```

6.  **Start Development Server**
    ```bash
    make npm-dev
    ```

## 📖 Usage

### Admin Panel
Access the Filament admin panel to manage content:
-   **URL**: `http://localhost/admin`
-   **Credentials**: (Check `database/seeders/DatabaseSeeder.php` or create a user via `make artisan cmd="make:filament-user"`)

### Frontend
Access the public-facing learning activities:
-   **URL**: `http://localhost`

## 🔧 Useful Commands

| Command | Description |
| :--- | :--- |
| `make up` | Start Docker containers |
| `make down` | Stop Docker containers |
| `make shell` | Access the app container shell |
| `make artisan cmd="..."` | Run Artisan commands (e.g., `make artisan cmd="migrate"`) |
| `make test` | Run PHP tests |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
