# Wanderlust 🌍

**Wanderlust** is a web application that allows users to browse, review, and manage travel destinations and listings. It integrates maps for location-based listings and supports CRUD operations for both users and listings.

## Check out Live Demo: https://wanderlust-rm6j.onrender.com/listings

## Features
- User authentication and authorization.
- Add, edit, and delete travel listings (based on RESTful APIs).
- Leave reviews and ratings on listings.
- View location of listings on a responsive map (powered by Mapbox).
- Mobile-responsive design.
- Display of reviews with rating stars.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Map API**: Mapbox
- **Templating Engine**: EJS (Embedded JavaScript)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/siddhanth4/wanderlust.git
   ```
2. Navigate into the project directory:
   ```bash
   cd wanderlust
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Set up your `.env` file with the following environment variables:
   ```plaintext
   MAP_TOKEN=<your_mapbox_token>
   MONGODB_URI=<your_mongodb_connection_string>
   SESSION_SECRET=<your_secret_key>
   ```
5. Run the application:
   ```bash
   nodemon app.js
   ```

6. Visit the application at `http://localhost:8080/listings`.


## Environment Variables
The application requires the following environment variables:
- `MAP_TOKEN`: Your Mapbox API token to render maps.
- `MONGODB_URI`: Your MongoDB connection string.
- `SESSION_SECRET`: A secret key for session management.

## Screenshots of Main Page
![image](https://github.com/user-attachments/assets/db3086cb-4abd-4c96-929e-98b29b72acf2) 


Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m 'Add feature'
   ```
4. Push to your forked branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

Please ensure your changes are well-tested and adhere to the project’s coding guidelines.
