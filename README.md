# Professional Networking App

A minimal Flask-based web application that lets users create professional profiles and connect with each other.

## Features

- Create a profile with name, headline, and bio.
- Browse a list of all profiles.
- View individual profiles and see their connections.
- Connect with other users.

## Getting Started

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**
   ```bash
   python app.py
   ```
   The app will start on `http://127.0.0.1:5000`.

3. **Using the app**
   - Open the home page to view existing profiles.
   - Click "Create Profile" in the navbar to add your own.
   - Inside a profile page, use the dropdown to connect with others.

## Project Structure

```
Prospera/
├── app.py              # Flask application with routes and models
├── requirements.txt    # Python dependencies
├── templates/          # HTML templates (Bootstrap 5)
│   ├── base.html
│   ├── index.html
│   ├── new_profile.html
│   └── profile.html
└── README.md
```

## Notes

- The database is a local SQLite file (`network.db`) created automatically on first run.
- Replace `app.config['SECRET_KEY']` in `app.py` for production use.
