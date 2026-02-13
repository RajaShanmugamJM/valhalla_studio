# Valhalla UI

A Vue.js Single Page Application (SPA) designed to visualize and interact with the **Valhalla** routing engine API. This application provides a user-friendly interface for testing and exploring Valhalla's capabilities, including routing, isochrones, matrix calculations, and map matching.

[![App Walkthrough](https://i9.ytimg.com/vi_webp/ad8RPaYBaTE/mq3.webp?sqp=CKid4bkG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgTihRMA8=&rs=AOn4CLAm5m1x4tTEQ3OJpc6h0wOsbiwdDg)](https://youtu.be/ad8RPaYBaTE)

## Features

This application implements several core features of the Valhalla engine:

### 1. Turn-by-Turn Routing (Route API)
Visualize optimal routes between multiple locations.
- Calculate routes based on different costing models (e.g., auto, bicycle, pedestrian).
- View detailed turn-by-turn instructions.
- Support for multiple waypoints.

### 2. Isochrones (Isochrone API)
Visualize reachable areas from a specific location within a given time or distance.
- Generate isochrone polygons to understand accessibility.
- Customize time/distance intervals.
- Useful for urban planning and accessibility analysis.

### 3. Distance & Time Matrix (Matrix API)
Calculate travel times and distances between multiple origins and destinations.
- Generate a matrix for solving logistics problems like the Traveling Salesman Problem (TSP).
- View the results in a tabular format.

### 4. Map Matching / Trace Attributes (Trace Route API)
Match raw GPS traces to the road network.
- Upload or input GPS trace data to snap it to the most likely road segments.
- Retrieve detailed attributes about the matched path, such as speed limits and road types.

### 5. Configurable Settings
Easily configure the connection to your Valhalla instance.
- **Valhalla Engine Endpoint**: Point the UI to any accessible Valhalla server (default: `http://localhost:8002`).
- **Authentication**: Supports Basic Authentication for secured Valhalla instances.
- **Persistence**: Settings are stored in your browser's LocalStorage, ensuring your configuration is remembered across sessions without sending data externally.

## Getting Started

### Prerequisites
- **Node.js**: Version 22+ (recommended, consistent with Dockerfile).
- **Yarn** or **npm**: Package manager for installing dependencies.
- A running instance of the **Valhalla Routing Engine**.

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dual-tone/valhalla_ui.git
    cd valhalla_ui
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    # or
    npm install
    ```

3.  **Run the development server:**
    ```bash
    yarn dev
    # or
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (default Vite port).

### Building for Production

To create a production-ready build:

```bash
yarn build
# or
npm run build
```

This will generate static files in the `dist` directory, which can be served by any static web server (e.g., Nginx, Apache, or `serve`).

To preview the production build locally:
```bash
yarn preview
# or
npm run preview
```

### Docker

For instructions on running the application using Docker, please refer to [INSTALL.md](./INSTALL.md).

## Configuration

To connect the UI to your Valhalla instance:

1.  Navigate to the **Settings** page (usually via a gear icon or menu).
2.  Enter the URL of your Valhalla server in the **Valhalla Endpoint** field.
3.  If your server requires authentication, enable **Basic Auth** and provide your username and password.
4.  Save your settings. The application will now use these details for all API requests.

## Project Structure

The project follows a standard Vue.js directory structure:

-   `src/components`: Reusable UI components.
-   `src/views`: Main page components (Home, Settings, Routing, etc.).
-   `src/stores`: State management using Pinia (handles Valhalla configuration and API interactions).
-   `src/router`: Vue Router configuration for navigation.
-   `src/utils`: Utility functions.
-   `public`: Static assets served as-is.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
