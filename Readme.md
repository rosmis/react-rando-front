## ⛰️ Project Documentation: React Rando App 🗺️

This project is a **Full Stack Hiking Application** that allows users to discover and explore hiking trails. 🚶‍♀️🌲 It consists of a **React frontend** for user interaction and a **Laravel backend** to manage data and API functionalities.  The application leverages **Mapbox** for interactive maps and displays hiking trails, details, and related information.

**Key Features:**

* **Location-based Hike Search:**  Users can search for hikes near a specific location. 📍
* **Filter & Sort:**  Hikes can be filtered by difficulty, distance, and duration. ⚙️
* **Interactive Map:**  Display hikes on a map using Mapbox, showing trail paths and markers. 🗺️
* **Hike Details:**  Detailed information about each hike, including description, difficulty, duration, distance, elevation, and images. ℹ️
* **Shareable Hike URLs:**  Easily share hike links with others. 🔗

## 🛠️ Installation Guide: Get Started Locally

Follow these steps to set up the Rando App development environment on your local machine.

**Prerequisites:**

Before you begin, make sure you have the following installed:

* **Docker**:  🐳 
* **Docker Compose**: ⚙️
* **npm** (Node Package Manager):  📦

**Installation Steps:**

1. **Clone the Repository:** 📥

    ```bash
    git clone https://github.com/rosmis/react-rando-front
    cd react-rando-front
    ```

2. **Initialize the Development Environment:** 🚀

    **Note 👀:** Before running the `init` command, make sure you have the Mapbox API key ready (one sent you via mail).

    Run the `init` command using `make`. This will execute the `init-dev-env.sh` script which automates the setup process.

    ```bash
    make init
    ```

    In the setup process, the command will ask you for the Mapbox API key. Fill in the one I sent you in teams dms.

2.1 **Boot up frontend**

    


The frontend will be available at [http://localhost:(5173)](http://localhost:(5173)) 🚀

3. **Access the Application:** 🌐

    Once the `make init` command completes successfully, you boot up the frontend:

    ```bash
    cd frontend
    npm run dev
    ```

    * **Frontend:**  [http://localhost:5173](http://localhost:5173)
    * **Backend API:** [http://localhost:80](http://localhost:80)
